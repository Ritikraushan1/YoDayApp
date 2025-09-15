import React from 'react';
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

const { width } = Dimensions.get("window");

const LoginScreen = ({ navigation }) => {
    const dispatch = useDispatch();
    const handleFacebookSignIn = async () => {
        try {
            // Trigger Facebook login
            const result = await LoginManager.logInWithPermissions(['public_profile', 'email']);

            if (result.isCancelled) {
                console.log("Facebook login cancelled");
                return;
            }

            // Get Access Token
            const data = await AccessToken.getCurrentAccessToken();

            if (!data) {
                console.log("Failed to get access token");
                return;
            }

            console.log("Facebook Access Token:", data.accessToken.toString());

            const res = await AuthService.loginWithFacebook(data.accessToken.toString());
            console.log("res after logging from facebook", res);
            if (res.status === 200) {

                saveUserSession(res.data.id, res.data.token, res.data.profile);
                const expiry = Date.now() + 5 * 24 * 60 * 60 * 1000;
                const dataToStore = {
                    id: res.data.id,
                    token: res.data.token,
                    expiry
                }
                await AsyncStorage.setItem("yodayuser", JSON.stringify(dataToStore));
                dispatch(setUserInfo(res?.data?.profile));

                navigation.navigate("Posts");
            }


            // You can send this token to your backend or directly fetch user profile
            // Example: fetch user profile
            // const response = await fetch(`https://graph.facebook.com/me?access_token=${data.accessToken}&fields=id,name,email`);
            // const userInfo = await response.json();
            // console.log("Facebook User Info:", userInfo);

            // Navigate to Posts screen
            // navigation.navigate("Posts");

        } catch (error) {
            console.error("Facebook login error:", error);
            Alert.alert("Login Error", "Unable to login with Facebook. Please try again.");
        }
    };


    const handlePhoneLogin = () => {
        navigation.navigate("SubmitMobile");
    }


    return (
        <SafeAreaView style={styles.container}>
            {/* <StatusBar barStyle="light-content" backgroundColor="transparent" /> */}

            {/* Gradient background */}
            <LinearGradient
                colors={['#3b5998', '#192f6a']}
                style={styles.background}
            >
                {/* Content Box */}
                <View style={styles.card}>
                    <Text style={styles.title}>Welcome to YoDay</Text>
                    <Text style={styles.subtitle}>Sign in to continue</Text>

                    {/* Facebook Login Button */}
                    <View style={{ gap: 8 }}>

                        <TouchableOpacity
                            style={styles.fbButton}
                            activeOpacity={0.85}
                            onPress={handleFacebookSignIn}
                        >
                            <FacebookIcon width={22} height={22} />
                            <Text style={styles.fbButtonText}>Continue with Facebook</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.fbButton}
                            activeOpacity={0.85}
                            onPress={handlePhoneLogin}
                        >
                            <PhoneIcon />
                            <Text style={styles.fbButtonText}>Continue with Mobile Number</Text>
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
            </LinearGradient>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#3b5998",
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
        backgroundColor: '#4267B2',
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
});

export default LoginScreen;
