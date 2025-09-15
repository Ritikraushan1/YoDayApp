import axios from "axios";
import { Alert, Platform } from 'react-native';
import Config from 'react-native-config';
import * as YDAPI from '../constants/apiConstants';
import * as Keychain from 'react-native-keychain';

async function getUserInformation() {
    try {
        let creddentials_obj;
        const credentials = await Keychain.getGenericPassword();
        if (credentials.password !== undefined)
            creddentials_obj = JSON.parse(credentials.password);
        if (creddentials_obj !== undefined && creddentials_obj !== null)
            return creddentials_obj;
    } catch (error) {
        console.log(error);
    }
}

export const saveUserSession = async (id, token, profile) => {
    try {

        // If not, fetch the existing session and reuse its token
        if (!token) {
            const existingSession = await getUserInformation();
            token = existingSession?.token || null;
        }

        const dataToStore = {
            id: id,
            token,
            profile: profile,
        };

        await Keychain.setGenericPassword(
            "usersession",
            JSON.stringify(dataToStore)
        );

        return true;
    } catch (error) {
        console.error("Error saving user session:", error);
        return false;
    }
};

async function updateUserProfile(data, token = null) {
    let url = Config.API_URL + YDAPI.PROFILE_SELF;
    console.log("url and data in update", url, data);
    const user = await getUserInformation();
    let tokenval = user?.token;
    console.log("detailsinuserinfo", user);
    let headers = {
        Authorization: `Bearer ${tokenval}`
    }
    return new Promise((resolve, reject) => {
        axios
            .put(url, data, { headers: headers })
            .then(response => {
                let result = '';
                console.log(response.status, response.data);
                switch (response.status) {
                    case 201:
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

async function deleteUserProfile(data) {
    let url = Config.API_URL + YDAPI.PROFILE_SELF;
    console.log("url and data in update", url, data);

    const user = await getUserInformation();
    let tokenval = user?.token;
    console.log("detailsinuserinfo", user);
    let headers = {
        Authorization: `Bearer ${tokenval}`
    }
    return new Promise((resolve, reject) => {
        axios
            .delete(url, { headers: headers })
            .then(response => {
                let result = '';
                console.log(response.status, response.data);
                switch (response.status) {
                    case 201:
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

export const UserService = {
    updateUserProfile,
    deleteUserProfile,
    getUserInformation
}
