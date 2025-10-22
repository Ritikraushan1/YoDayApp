import React from "react";
import { View, Text, StyleSheet, ActivityIndicator, Modal } from "react-native";

const DesignedLoader = ({ visible = false, text = "Loading..." }) => {
    return (
        <Modal
            transparent={true}
            animationType="fade"
            visible={visible}
            statusBarTranslucent={true}
        >
            <View style={styles.overlay}>
                <View style={styles.loaderContainer}>
                    <ActivityIndicator size="large" color="#007bff" />
                    {text ? <Text style={styles.loaderText}>{text}</Text> : null}
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.4)",
        justifyContent: "center",
        alignItems: "center",
    },
    loaderContainer: {
        backgroundColor: "#fff",
        padding: 25,
        borderRadius: 15,
        alignItems: "center",
        justifyContent: "center",
        minWidth: 150,
    },
    loaderText: {
        marginTop: 12,
        fontSize: 16,
        fontWeight: "500",
        color: "#333",
        textAlign: "center",
    },
});

export default DesignedLoader;
