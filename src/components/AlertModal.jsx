import React from "react";
import {
    Modal,
    View,
    Text,
    Pressable,
    StyleSheet,
    TouchableWithoutFeedback,
} from "react-native";

const AlertModal = ({
    visible,
    onClose,
    alertText,
    showCancel = true,
    showOk = true,
    onCancel,
    onOk,
    cancelText = "Cancel",
    okText = "OK",
}) => {
    return (
        <Modal
            transparent
            animationType="fade"
            visible={visible}
            onRequestClose={onClose}
        >
            <TouchableWithoutFeedback onPress={onClose}>
                <View style={styles.overlay}>
                    <TouchableWithoutFeedback>
                        <View style={styles.container}>
                            {/* Inner Content */}
                            <View style={styles.innerBox}>
                                {/* Alert Text */}
                                <Text style={styles.alertText}>{alertText}</Text>

                                {/* Buttons */}
                                <View style={styles.buttonRow}>
                                    {showCancel && (
                                        <Pressable
                                            style={[styles.button, styles.cancelButton]}
                                            onPress={onCancel || onClose}
                                        >
                                            <Text style={[styles.buttonText, styles.cancelText]}>
                                                {cancelText}
                                            </Text>
                                        </Pressable>
                                    )}

                                    {showOk && (
                                        <Pressable
                                            style={[styles.button, styles.okButton]}
                                            onPress={onOk || onClose}
                                        >
                                            <Text style={[styles.buttonText, styles.okText]}>
                                                {okText}
                                            </Text>
                                        </Pressable>
                                    )}
                                </View>
                            </View>
                        </View>
                    </TouchableWithoutFeedback>
                </View>
            </TouchableWithoutFeedback>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.5)",
        justifyContent: "center",
        alignItems: "center",
    },
    container: {
        width: "80%",
        backgroundColor: "#4267b2",
        borderTopStartRadius: 30,
        borderBottomRightRadius: 30,
        padding: 3, // creates border effect
    },
    innerBox: {
        backgroundColor: "#fff",
        borderTopStartRadius: 28,
        borderBottomRightRadius: 28,
        padding: 20,
        alignItems: "center",
    },
    alertText: {
        fontSize: 16,
        color: "#333",
        textAlign: "center",
        marginBottom: 20,
        lineHeight: 22,
    },
    buttonRow: {
        flexDirection: "row",
        justifyContent: "flex-end",
        marginTop: 10,
        width: "100%",
    },
    button: {
        paddingVertical: 10,
        paddingHorizontal: 18,
        borderRadius: 6,
        marginLeft: 10,
    },
    cancelButton: {
        backgroundColor: "#f1f1f1",
    },
    okButton: {
        backgroundColor: "#007BFF",
    },
    buttonText: {
        fontSize: 14,
        fontWeight: "500",
    },
    cancelText: {
        color: "#333",
    },
    okText: {
        color: "#fff",
    },
});

export default AlertModal;
