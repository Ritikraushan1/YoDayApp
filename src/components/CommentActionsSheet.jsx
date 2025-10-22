import React from "react";
import { Modal, View, Text, StyleSheet, Pressable } from "react-native";

const CommentActionSheet = ({ visible, onClose, onReport, onCopy }) => {
    return (
        <Modal
            transparent
            animationType="slide"
            visible={visible}
            onRequestClose={onClose}
        >
            <Pressable style={styles.overlay} onPress={onClose}>
                <View style={styles.sheet}>
                    <Pressable style={styles.option} onPress={onReport}>
                        <Text style={styles.optionText}>Report</Text>
                    </Pressable>

                    <Pressable style={[styles.option, styles.cancel]} onPress={onClose}>
                        <Text style={[styles.optionText, { color: "red" }]}>Cancel</Text>
                    </Pressable>
                </View>
            </Pressable>
        </Modal>
    );
};

export default CommentActionSheet;

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        justifyContent: "flex-end",
        backgroundColor: "rgba(0,0,0,0.3)",
    },
    sheet: {
        backgroundColor: "#fff",
        padding: 15,
        borderTopLeftRadius: 16,
        borderTopRightRadius: 16,
    },
    option: {
        paddingVertical: 14,
    },
    optionText: {
        fontSize: 16,
        color: "#007BFF",
    },
    cancel: {
        borderTopWidth: 1,
        borderTopColor: "#eee",
        marginTop: 10,
    },
});
