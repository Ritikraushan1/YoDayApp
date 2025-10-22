import React, { useState } from "react";
import {
    View,
    Text,
    TouchableOpacity,
    ScrollView,
    StyleSheet,
    Modal,
} from "react-native";

const CustomDropDown = ({
    label,
    placeholder = "Select an option",
    value,
    dropDownItems = [],
    onSelect,
    error,
    errorMessage,
}) => {
    const [visible, setVisible] = useState(false);

    return (
        <View style={styles.container}>
            {label && <Text style={styles.label}>{label}</Text>}

            {/* Input-like box */}
            <TouchableOpacity
                style={styles.inputContainer}
                onPress={() => setVisible(true)}
            >
                <Text style={[styles.valueText, !value && { color: "#999" }]}>
                    {value || placeholder}
                </Text>
                <Text style={styles.arrow}>▼</Text>
            </TouchableOpacity>

            {/* Error message */}
            {error && errorMessage && (
                <Text style={styles.errorText}>{errorMessage}</Text>
            )}

            {/* Dropdown modal */}
            <Modal
                transparent
                animationType="fade"
                visible={visible}
                onRequestClose={() => setVisible(false)}
            >
                <TouchableOpacity
                    style={styles.overlay}
                    activeOpacity={1}
                    onPressOut={() => setVisible(false)}
                >
                    <View style={styles.dropdown}>
                        <ScrollView>
                            {dropDownItems.map((item, index) => (
                                <TouchableOpacity
                                    key={index}
                                    style={styles.option}
                                    onPress={() => {
                                        onSelect(item);
                                        setVisible(false);
                                    }}
                                >
                                    <Text
                                        style={[
                                            styles.optionText,
                                            value === item && { fontWeight: "600" },
                                        ]}
                                    >
                                        {item}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                    </View>
                </TouchableOpacity>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: 16,
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
        justifyContent: "space-between",
    },
    valueText: {
        fontSize: 15,
        color: "#333",
    },
    arrow: {
        fontSize: 14,
        color: "#666",
    },
    overlay: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0,0,0,0.3)",
        paddingHorizontal: 30,
    },
    dropdown: {
        width: "100%",
        backgroundColor: "#fff",
        borderRadius: 12,
        maxHeight: 250,
        borderWidth: 1,
        borderColor: "#ddd",
        overflow: "hidden",
    },
    option: {
        padding: 14,
        borderBottomWidth: 1,
        borderBottomColor: "#eee",
    },
    optionText: {
        fontSize: 15,
        color: "#333",
    },
    errorText: {
        marginTop: 4,
        color: "red",
        fontSize: 12,
    },
});

export default CustomDropDown;
