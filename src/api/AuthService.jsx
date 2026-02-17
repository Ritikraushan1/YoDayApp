import axios from "axios";
import { Alert, Platform } from 'react-native';
import Config from 'react-native-config';
import messaging from '@react-native-firebase/messaging';
import * as YDAPI from '../constants/apiConstants';
import { requestNotifications, RESULTS } from 'react-native-permissions';
import * as DeviceInfo from '../constants/DeviceInfoConstants';


const getPushNotificationToken = async () => {
    console.log("getPushNotificationToken started");
    try {
        if (Platform.OS === 'ios') {
            const isRegistered = messaging().isDeviceRegisteredForRemoteMessages;
            console.log("isDeviceRegisteredForRemoteMessages:", isRegistered);
            if (!isRegistered) {
                console.log("Registering for remote messages...");
                await messaging().registerDeviceForRemoteMessages();
                console.log("Registered for remote messages");
            }
        }
    } catch (e) {
        console.log("Error in registerDeviceForRemoteMessages:", e);
    }
    let registrationToken = null;
    const result = await requestNotifications(['alert', 'badge', 'sound']);
    if (result.status === RESULTS.GRANTED)
        try {
            registrationToken = await messaging().getToken();
        } catch (e) {
            Alert.alert('Something went wrong, please try again!');
        }
    return registrationToken;
};

async function registerUser(country_code, mobile_number) {
    console.log("registerUser called", country_code, mobile_number);
    let url = Config.API_URL + YDAPI.REGISTER_USER;
    let device_info = {};
    const deviceName = await DeviceInfo.DeviceName;
    const pushToken = await getPushNotificationToken();

    // Use placeholder token for iOS if Firebase initialization failed
    const finalPushToken = pushToken || (Platform.OS === 'ios' ? 'ios_placeholder_token' : null);

    device_info = {
        app_version: DeviceInfo.CurrentDeviceAppVersion,
        device_os: DeviceInfo.DevicePlatform,
        os_version: DeviceInfo.DeviceSystemVersion,
        device_model: DeviceInfo.DeviceModel,
        device_name: deviceName,
        push_token: finalPushToken,
    }

    let logreq = {
        country_code: country_code,
        mobile_number: mobile_number,
        device_info
    };
    console.log("register body url", url, logreq);

    return new Promise((resolve, reject) => {
        axios
            .post(url, logreq)
            .then(response => {
                let result = '';
                console.log(response.status, response.data);
                switch (response.status) {
                    case 200:
                    case 201:
                        if (
                            response.data.transaction_id !== null &&
                            response.data.transaction_id !== undefined
                        ) {
                            result = {
                                status: response.status,
                                new_registration: response.data.new_registration,
                                transaction_id: response.data.transaction_id,
                            };
                            console.log('result after new account creation', response.data);
                        }
                        break;
                    case 400:
                        result = {
                            status: response.status,
                            message: response.data.message,
                        };
                        break;
                    case 500:
                        result = {
                            status: response.status,
                            message: 'Server Error',
                        };
                        break;
                    default:
                        result = {
                            status: response.status,
                            message: 'unhandled',
                        };
                        break;
                }

                resolve(result);
            })
            .catch(err => {
                console.log("error", err)
                // alert(JSON.stringify(err));
                reject(err);
            });
    });
}

async function verifyOTP(country_code, mobile_number, transaction_id, otp) {
    let url = Config.API_URL + YDAPI.VERIFY_OTP;
    let logreq = {
        country_code: country_code,
        mobile_number: mobile_number,
        transaction_id,
        otp
    };
    console.log("register body url", logreq);

    return new Promise((resolve, reject) => {
        axios
            .post(url, logreq)
            .then(response => {
                let result = '';
                console.log(response.status, response.data);
                switch (response.status) {
                    case 200:
                        result = {
                            status: response.status,
                            data: response.data,
                        };
                        break;
                    case 400:
                        result = {
                            status: response.status,
                            message: response.data.message,
                        };
                        break;
                    case 500:
                        result = {
                            status: response.status,
                            message: 'Server Error',
                        };
                        break;
                    default:
                        result = {
                            status: response.status,
                            message: 'unhandled',
                        };
                        break;
                }

                resolve(result);
            })
            .catch(err => {
                console.log("error", err)
                // alert(JSON.stringify(err));
                reject(err);
            });
    });
}

async function resendOtp(country_code, mobile_number) {
    let url = Config.API_URL + YDAPI.RESEND_OTP;
    let logreq = {
        country_code: country_code,
        mobile_number: mobile_number,
    };
    console.log("register body url", url);

    return new Promise((resolve, reject) => {
        axios
            .post(url, logreq)
            .then(response => {
                let result = '';
                console.log(response.status, response.data);
                switch (response.status) {
                    case 201:
                        if (
                            response.data.transaction_id !== null &&
                            response.data.transaction_id !== undefined
                        ) {
                            result = {
                                status: response.status,
                                new_registration: response.data.new_registration,
                                transaction_id: response.data.transaction_id,
                            };
                            console.log('result after new account creation', response.data);
                        }
                        break;
                    case 400:
                        result = {
                            status: response.status,
                            message: response.data.message,
                        };
                        break;
                    case 500:
                        result = {
                            status: response.status,
                            message: 'Server Error',
                        };
                        break;
                    default:
                        result = {
                            status: response.status,
                            message: 'unhandled',
                        };
                        break;
                }

                resolve(result);
            })
            .catch(err => {
                console.log("error", err)
                // alert(JSON.stringify(err));
                reject(err);
            });
    });
}

async function loginWithFacebook(access_token) {
    let url = Config.API_URL + YDAPI.FACEBOOK_LOGIN;
    let device_info = {
        app_version: DeviceInfo.CurrentDeviceAppVersion,
        device_os: DeviceInfo.DevicePlatform,
        os_version: DeviceInfo.DeviceSystemVersion,
        device_model: DeviceInfo.DeviceModel,
        device_name: await DeviceInfo.DeviceName,
        push_token: await getPushNotificationToken(),
    }
    let logreq = {
        access_token,
        device_info
    };
    return new Promise((resolve, reject) => {
        axios
            .post(url, logreq)
            .then(response => {
                let result = '';
                console.log(response.status, response.data);
                switch (response.status) {
                    case 200:
                    case 201:
                        result = {
                            status: response.status,
                            data: response.data,
                        };
                        break;
                    case 400:
                        result = {
                            status: response.status,
                            message: response.data.message,
                        };
                        break;
                    case 500:
                        result = {
                            status: response.status,
                            message: 'Server Error',
                        };
                        break;
                    default:
                        result = {
                            status: response.status,
                            message: 'unhandled',
                        };
                        break;
                }

                resolve(result);
            })
            .catch(err => {
                // alert(JSON.stringify(err));
                reject(err);
            });
    });
}

async function getRefreshToken(tokenval) {
    let url = Config.API_URL + '/auth/refresh'
    let headers = {
        Authorization: `Bearer ${tokenval}`
    }
    return new Promise((resolve, reject) => {
        axios
            .get(url, { headers: headers })
            .then(response => {
                let result = '';
                console.log(response.status, response.data);
                switch (response.status) {
                    case 200:
                        result = {
                            status: response.status,
                            data: response.data,
                        };
                        break;
                    case 400:
                        result = {
                            status: response.status,
                            message: response.data.message,
                        };
                        break;
                    case 500:
                        result = {
                            status: response.status,
                            message: 'Server Error',
                        };
                        break;
                    default:
                        result = {
                            status: response.status,
                            message: 'unhandled',
                        };
                        break;
                }

                resolve(result);
            })
            .catch(err => {
                console.log("error", err)
                // alert(JSON.stringify(err));
                reject(err);
            });
    });
}

export const AuthService = {
    registerUser,
    loginWithFacebook,
    verifyOTP,
    resendOtp,
    getRefreshToken
}