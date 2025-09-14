import React, { useRef, useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Dimensions,
    KeyboardAvoidingView,
    Platform,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AuthService } from '../../api/AuthService';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useDispatch } from 'react-redux';
import { setUserInfo } from '../../redux/slices/userSlice';
import * as Keychain from 'react-native-keychain';
import { saveUserSession } from '../../api/UserService';


const { width } = Dimensions.get("window");

const SubmitOtpScreen = ({ navigation, route }) => {
    const { country_code, mobile, transaction_id, new_registration } = route.params;
    const dispatch = useDispatch()

    const [otp, setOtp] = useState(["", "", "", "", "", ""]);
    const inputs = useRef([]);

    const handleChange = (text, index) => {
        if (/^\d$/.test(text)) {
            const newOtp = [...otp];
            newOtp[index] = text;
            setOtp(newOtp);

            // Move to next input if available
            if (index < 5) {
                inputs.current[index + 1].focus();
            }
        } else if (text === "") {
            const newOtp = [...otp];
            newOtp[index] = "";
            setOtp(newOtp);
        }
    };

    const handleKeyPress = (e, index) => {
        if (e.nativeEvent.key === "Backspace" && otp[index] === "" && index > 0) {
            inputs.current[index - 1].focus();
        }
    };

    const handleSubmitOtp = async () => {
        const enteredOtp = otp.join("");
        if (enteredOtp.length !== 6) {
            console.log("Please enter the 6-digit OTP");
            return;
        }

        const res = await AuthService.verifyOTP(country_code, mobile, transaction_id, enteredOtp)
        console.log("OTP submitted res :", res);
        const dataToStore = {
            id: res.data.id,
            token: res.data.token
        }
        await AsyncStorage.setItem("yodayuser", JSON.stringify(dataToStore))
        if (res.data.update_profile) {

            navigation.navigate("UpdateProfile", {
                id: res.data.id,
                token: res.data.token
            }); // Example: navigate after successful OTP
        } else {
            saveUserSession(dataToStore.id, dataToStore.token, res?.data?.profile)
            dispatch(setUserInfo(res?.data?.profile));

            navigation.navigate("Posts")
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <LinearGradient
                colors={['#3b5998', '#192f6a']}
                style={styles.background}
            >
                <KeyboardAvoidingView
                    style={styles.card}
                    behavior={Platform.OS === "ios" ? "padding" : undefined}
                >
                    <Text style={styles.title}>Enter OTP</Text>
                    <Text style={styles.subtitle}>
                        Please enter the 6-digit code sent to your mobile
                    </Text>

                    {/* OTP Input */}
                    <View style={styles.otpRow}>
                        {otp.map((digit, index) => (
                            <TextInput
                                key={index}
                                style={styles.otpInput}
                                value={digit}
                                onChangeText={(text) => handleChange(text, index)}
                                keyboardType="number-pad"
                                maxLength={1}
                                ref={(ref) => (inputs.current[index] = ref)}
                                onKeyPress={(e) => handleKeyPress(e, index)}
                            />
                        ))}
                    </View>

                    {/* Submit Button */}
                    <TouchableOpacity
                        style={styles.submitButton}
                        activeOpacity={0.85}
                        onPress={handleSubmitOtp}
                    >
                        <Text style={styles.submitButtonText}>Verify</Text>
                    </TouchableOpacity>
                </KeyboardAvoidingView>
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
        fontSize: 24,
        color: '#111',
        fontWeight: '700',
        marginBottom: 10,
        textAlign: "center",
    },
    subtitle: {
        fontSize: 14,
        color: '#555',
        marginBottom: 25,
        textAlign: "center",
    },
    otpRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        width: "100%",
        marginBottom: 25,
    },
    otpInput: {
        width: 45,
        height: 55,
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 10,
        textAlign: "center",
        fontSize: 20,
        fontWeight: "600",
        color: "#111",
        backgroundColor: "#f9f9f9",
    },
    submitButton: {
        backgroundColor: '#4267B2',
        paddingVertical: 14,
        paddingHorizontal: 25,
        borderRadius: 30,
        shadowColor: "#000",
        shadowOpacity: 0.2,
        shadowOffset: { width: 0, height: 3 },
        shadowRadius: 6,
        elevation: 4,
        width: "100%",
        alignItems: "center",
    },
    submitButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
});

export default SubmitOtpScreen;
