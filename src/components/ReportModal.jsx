import React, { useState } from "react";
import {
    Modal,
    View,
    Text,
    StyleSheet,
    Pressable,
    TextInput,
} from "react-native";
import CustomDropDown from "./CustomDropDown"; // 👈 your dropdown

const ReportModal = ({ visible, onClose, onSubmit, comment }) => {
    const [reason, setReason] = useState("");
    const [details, setDetails] = useState("");

    const handleSubmit = () => {
        if (!reason) return;
        onSubmit({ reason, details, commentId: comment?.comment_id, post_code: comment?.post_code });
        setReason("");
        setDetails("");
        onClose();
    };

    return (
        <Modal
            transparent
            visible={visible}
            animationType="slide"
            onRequestClose={onClose}
        >
            <View style={styles.overlay}>
                <View style={styles.container}>
                    {/* Header */}
                    <Text style={styles.title}>Report Comment</Text>

                    {/* Comment preview */}
                    {comment && (
                        <View style={styles.commentBox}>
                            <Text style={styles.commentAuthor}>
                                {comment.username}
                            </Text>
                            <Text style={styles.commentText}>
                                {comment.text}
                            </Text>
                        </View>
                    )}

                    {/* Dropdown */}
                    <CustomDropDown
                        label="Reason"
                        placeholder="Select a reason"
                        value={reason}
                        dropDownItems={[
                            "Spam",
                            "Harassment",
                            "Hate speech",
                            "Other",
                        ]}
                        onSelect={(val) => setReason(val)}
                        error={!reason}
                        errorMessage="Reason is required"
                    />

                    {/* Details input */}
                    <TextInput
                        style={styles.input}
                        placeholder="Additional details (optional)"
                        placeholderTextColor="#bbb"
                        value={details}
                        onChangeText={setDetails}
                        multiline
                    />

                    {/* Buttons */}
                    <View style={styles.buttons}>
                        <Pressable style={styles.cancelBtn} onPress={onClose}>
                            <Text style={styles.cancelText}>Cancel</Text>
                        </Pressable>
                        <Pressable
                            style={[
                                styles.submitBtn,
                                !reason && { backgroundColor: "#6c8ed6" },
                            ]}
                            onPress={handleSubmit}
                            disabled={!reason}
                        >
                            <Text style={styles.submitText}>Report</Text>
                        </Pressable>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

export default ReportModal;

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.4)",
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
    },
    container: {
        backgroundColor: "#7030A0", // dark blue
        borderRadius: 16,
        padding: 20,
        width: "100%",
    },
    title: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 15,
        color: "#fff", // white text for contrast
    },
    commentBox: {
        backgroundColor: "#fff",
        borderRadius: 8,
        padding: 10,
        marginBottom: 15,
        borderWidth: 1,
        borderColor: "#ddd",
    },
    commentAuthor: {
        fontWeight: "600",
        fontSize: 14,
        color: "#222",
        marginBottom: 4,
    },
    commentText: {
        fontSize: 14,
        color: "#444",
    },
    input: {
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 8,
        padding: 10,
        minHeight: 60,
        textAlignVertical: "top",
        fontSize: 14,
        marginBottom: 15,
        backgroundColor: "#fff",
        color: "#000",
    },
    buttons: {
        flexDirection: "row",
        justifyContent: "flex-end",
        gap: 10,
    },
    cancelBtn: {
        paddingVertical: 10,
        paddingHorizontal: 16,
        backgroundColor: "#fff",
        borderRadius: 8,
    },
    cancelText: {
        color: "#d9534f",
        fontWeight: "600",
    },
    submitBtn: {
        backgroundColor: "#1f6f8b",
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 8,
    },
    submitText: {
        color: "#fff",
        fontWeight: "600",
    },
});
