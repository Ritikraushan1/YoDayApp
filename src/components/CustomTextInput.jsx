import React from "react";
import { View, Text, TextInput, StyleSheet } from "react-native";

const CustomTextInput = ({
    label,
    icon,
    placeholder,
    value,
    onChangeText,
    keyboardType = "default",
    secureTextEntry = false,
    autoCapitalize = "sentences",
    error,
    errorMessage,
}) => {
    return (
        <View style={styles.wrapper}>
            {label && <Text style={styles.label}>{label}</Text>}

            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    placeholder={placeholder}
                    placeholderTextColor="#999"
                    value={value}
                    onChangeText={onChangeText}
                    keyboardType={keyboardType}
                    secureTextEntry={secureTextEntry}
                    autoCapitalize={autoCapitalize}
                />
            </View>

            {error && errorMessage && (
                <Text style={styles.errorText}>{errorMessage}</Text>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    wrapper: {
        // marginBottom: 16,
    },
    label: {
        fontSize: 14,
        fontWeight: "600",
        color: "#fff",
        marginBottom: 6,
    },
    inputContainer: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#fff",
        borderRadius: 12,
        borderWidth: 1,
        borderColor: "#ddd",
        paddingHorizontal: 12,
        height: 50,
        shadowColor: "#000",
        shadowOpacity: 0.05,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 4,
        elevation: 2,
    },
    icon: {
        marginRight: 8,
    },
    input: {
        flex: 1,
        fontSize: 15,
        color: "#333",
    },
    errorText: {
        marginTop: 4,
        color: "red",
        fontSize: 12,
    },
});

export default CustomTextInput;
