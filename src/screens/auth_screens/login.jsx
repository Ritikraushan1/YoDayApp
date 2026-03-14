import React, { useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    StatusBar,
    Dimensions,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import FacebookIcon from '../../assets/icon/FacebookIcon';
import PhoneIcon from '../../assets/icon/PhoneIcon';
import { LoginManager, AccessToken } from 'react-native-fbsdk-next';
import { saveUserSession, UserService } from '../../api/UserService';
import { AuthService } from '../../api/AuthService';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useDispatch } from 'react-redux';
import { setUserInfo } from '../../redux/slices/userSlice';
import DesignedLoader from '../../components/DesignedLoader';
import AlertModal from '../../components/AlertModal';

const { width } = Dimensions.get("window");

const LoginScreen = ({ navigation }) => {
    const dispatch = useDispatch();
    const [loading, setIsLoading] = useState(false);
    const [loaderText, setLoaderText] = useState('');
    const [isChecked, setIsChecked] = useState(false);
    const [customAlert, setCustomAlert] = useState({
        visible: false,
        message: "",
        showCancel: false,
        onOk: null,
        onCancel: null,
    });
    const handleFacebookSignIn = async () => {
        if (!isChecked) {
            setCustomAlert({
                visible: true,
                message: "Please accept the Terms and Conditions before proceeding.",
                showCancel: false,
                onOk: () => setCustomAlert(prev => ({ ...prev, visible: false })),
            });
            return;
        }

        try {
            const result = await LoginManager.logInWithPermissions(['public_profile', 'email']);

            if (result.isCancelled) {
                setCustomAlert({
                    visible: true,
                    message: "You cancelled Facebook login. Do you want to try again?",
                    showCancel: true,
                    onOk: () => handleFacebookSignIn(), // retry login
                    onCancel: () => console.log("User chose not to retry"),
                });
                return;
            }

            const data = await AccessToken.getCurrentAccessToken();

            if (!data) {
                setCustomAlert({
                    visible: true,
                    message: "Failed to get access token. Please try again.",
                    showCancel: false,
                    onOk: () => handleFacebookSignIn(),
                });
                return;
            }
            setIsLoading(true);
            setLoaderText('Logging in with facebook...')
            const res = await AuthService.loginWithFacebook(data.accessToken.toString());
            if (res.status === 200) {
                saveUserSession(res.data.id, res.data.token, res.data.profile);
                const expiry = Date.now() + 5 * 24 * 60 * 60 * 1000;
                const dataToStore = {
                    id: res.data.id,
                    token: res.data.token,
                    expiry
                };
                await AsyncStorage.setItem("yodayuser", JSON.stringify(dataToStore));
                dispatch(setUserInfo(res?.data?.profile));

                navigation.navigate("Posts");
            }
        } catch (error) {
            console.error("Facebook login error:", error);
            setIsLoading(false);
            setLoaderText('')
            setCustomAlert({
                visible: true,
                message: "Unable to login with Facebook. Please try again.",
                showCancel: true,
                onOk: () => handleFacebookSignIn(),
            });
        } finally {
            setIsLoading(false);
            setLoaderText('')
        }
    };



    const handlePhoneLogin = () => {
        if (!isChecked) {
            setCustomAlert({
                visible: true,
                message: "Please accept the Terms and Conditions before proceeding.",
                showCancel: false,
                onOk: () => setCustomAlert(prev => ({ ...prev, visible: false })),
            });
            return;
        }
        navigation.navigate("SubmitMobile");
    }


    return (
        <SafeAreaView style={styles.container}>
            {/* <StatusBar barStyle="light-content" backgroundColor="transparent" /> */}

            {/* Gradient background */}
            <LinearGradient
                colors={['#7030A0', '#7030A0']}
                style={styles.background}
            >
                {/* Content Box */}
                <View style={styles.card}>
                    <Text style={styles.title}>Welcome to YoDay</Text>
                    <Text style={styles.subtitle}>Sign in to continue</Text>

                    {/* Facebook Login Button */}
                    <View style={{ gap: 8 }}>

                        {/* <TouchableOpacity
                            style={styles.fbButton}
                            activeOpacity={0.85}
                            onPress={handleFacebookSignIn}
                        >
                            <FacebookIcon width={22} height={22} />
                            <Text style={styles.fbButtonText}>Continue with Facebook</Text>
                        </TouchableOpacity> */}
                        <TouchableOpacity
                            style={styles.fbButton}
                            activeOpacity={0.85}
                            onPress={handlePhoneLogin}
                        >
                            <PhoneIcon />
                            <Text style={styles.fbButtonText}>Continue with Mobile Number</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.termsContainer}>
                        <TouchableOpacity
                            style={styles.checkbox}
                            onPress={() => setIsChecked(!isChecked)}
                        >
                            <View style={[styles.checkboxBox, isChecked && styles.checkboxBoxChecked]}>
                                {isChecked && <Text style={styles.checkmark}>✓</Text>}
                            </View>
                            <Text style={styles.checkboxText}>
                                I have read and agree to{' '}
                                <Text
                                    style={styles.linkText}
                                    onPress={() => navigation.navigate('Terms')}
                                >
                                    Terms & Conditions
                                </Text>
                            </Text>
                        </TouchableOpacity>
                    </View>

                    {/* Divider */}
                    {/* <View style={styles.divider}>
                        <View style={styles.line} />
                        <Text style={styles.dividerText}>or</Text>
                        <View style={styles.line} />
                    </View> */}

                    {/* Signup Option */}
                    {/* <TouchableOpacity
                        activeOpacity={0.8}
                        onPress={() => handleFacebookSignUp()}
                    >
                        <Text style={styles.signupText}>
                            Don’t have an account? <Text style={styles.signupLink}>Sign up</Text>
                        </Text>
                    </TouchableOpacity> */}
                </View>
                <DesignedLoader visible={loading} text={loaderText} />
                <AlertModal
                    visible={customAlert.visible}
                    alertText={customAlert.message}
                    showCancel={customAlert.showCancel}
                    showOk={true}
                    onOk={() => {
                        if (customAlert.onOk) customAlert.onOk();
                        setCustomAlert(prev => ({ ...prev, visible: false }));
                    }}
                    onCancel={() => {
                        if (customAlert.onCancel) customAlert.onCancel();
                        setCustomAlert(prev => ({ ...prev, visible: false }));
                    }}
                    okText="Retry"
                    cancelText="Cancel"
                />

            </LinearGradient>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#7030A0",
    },
    background: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    card: {
        width: width * 0.9,
        backgroundColor: "#fff",
        borderRadius: 20,
        paddingVertical: 45,
        paddingHorizontal: 25,
        alignItems: "center",
        shadowColor: "#000",
        shadowOpacity: 0.15,
        shadowOffset: { width: 0, height: 5 },
        shadowRadius: 8,
        elevation: 6,
    },
    title: {
        fontSize: 28,
        color: '#111',
        fontWeight: '700',
        marginBottom: 10,
        textAlign: "center",
    },
    subtitle: {
        fontSize: 16,
        color: '#555',
        marginBottom: 35,
        textAlign: "center",
    },
    fbButton: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: '#7030A0',
        paddingVertical: 14,
        paddingHorizontal: 25,
        borderRadius: 30,
        shadowColor: "#000",
        shadowOpacity: 0.2,
        shadowOffset: { width: 0, height: 3 },
        shadowRadius: 6,
        elevation: 4,
    },
    fbButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
        marginLeft: 10,
    },
    divider: {
        flexDirection: "row",
        alignItems: "center",
        marginVertical: 30,
        width: "100%",
    },
    line: {
        flex: 1,
        height: 1,
        backgroundColor: "#ccc",
    },
    dividerText: {
        marginHorizontal: 12,
        color: "#999",
        fontSize: 14,
    },
    signupText: {
        fontSize: 15,
        color: "#555",
        textAlign: "center",
    },
    signupLink: {
        color: "#3b5998",
        fontWeight: "600",
    },
    checkboxText: {
        color: '#555',
        fontSize: 14,
        flexShrink: 1,
    },
    linkText: {
        color: '#3b5998',
        fontWeight: '600',
        textDecorationLine: 'underline',
    },
    termsContainer: {
        marginTop: 25,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    checkbox: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    checkboxBox: {
        width: 20,
        height: 20,
        borderWidth: 2,
        borderColor: '#3b5998',
        borderRadius: 5,
        marginRight: 8,
        justifyContent: 'center',
        alignItems: 'center',
    },
    checkboxBoxChecked: {
        backgroundColor: '#3b5998',
    },
    checkmark: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 14,
    },

});

export default LoginScreen;
