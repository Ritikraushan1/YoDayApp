import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Dimensions,
    KeyboardAvoidingView,
    Platform,
    Alert,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AuthService } from '../../api/AuthService';

const { width } = Dimensions.get("window");

const SubmitMobileScreen = ({ navigation }) => {
    const country_code = "+91";
    const [mobile, setMobile] = useState("");

    const handleSubmitMobile = async () => {
        console.log("mobile", mobile);

        if (mobile.length !== 10) {
            console.log("Please enter a valid 10-digit mobile number");
            return;
        }
        console.log("Mobile number submitted:", `+91${mobile}`);
        const res = await AuthService.registerUser(country_code, mobile);
        console.log("res after submitting", res);

        if (res.status === 201 || res.status === 200) {
            navigation.navigate("SubmitOTP", {
                country_code,
                mobile,
                transaction_id: res.transaction_id,
                new_registration: res?.new_registration
            });
        }

    };

    return (
        <SafeAreaView style={styles.container}>
            <LinearGradient
                colors={['#7030A0', '#7030A0']}
                style={styles.background}
            >
                <KeyboardAvoidingView
                    style={styles.card}
                    behavior={Platform.OS === "ios" ? "padding" : undefined}
                >
                    <Text style={styles.title}>Enter Your Mobile Number</Text>
                    <Text style={styles.subtitle}>
                        We'll send you a verification code
                    </Text>

                    {/* Mobile Input */}
                    <View style={styles.inputRow}>
                        <View style={styles.countryCodeBox}>
                            <Text style={styles.countryCode}>{country_code}</Text>
                        </View>
                        <TextInput
                            style={styles.mobileInput}
                            placeholder="Enter mobile number"
                            placeholderTextColor="#888"
                            keyboardType="number-pad"
                            maxLength={10}
                            value={mobile}
                            onChangeText={setMobile}
                        />
                    </View>

                    {/* Submit Button */}
                    <TouchableOpacity
                        style={styles.submitButton}
                        activeOpacity={0.85}
                        onPress={() => handleSubmitMobile()}
                    >
                        <Text style={styles.submitButtonText}>Continue</Text>
                    </TouchableOpacity>
                </KeyboardAvoidingView>
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
    inputRow: {
        flexDirection: "row",
        alignItems: "center",
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 12,
        marginBottom: 25,
        width: "100%",
        backgroundColor: "#f9f9f9",
    },
    countryCodeBox: {
        paddingHorizontal: 12,
        paddingVertical: 14,
        backgroundColor: "#eee",
        borderTopLeftRadius: 12,
        borderBottomLeftRadius: 12,
        justifyContent: "center",
        alignItems: "center",
    },
    countryCode: {
        fontSize: 16,
        fontWeight: "600",
        color: "#333",
    },
    mobileInput: {
        flex: 1,
        paddingVertical: 14,
        paddingHorizontal: 12,
        fontSize: 16,
        color: "#111",
    },
    submitButton: {
        backgroundColor: '#7030A0',
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

export default SubmitMobileScreen;
