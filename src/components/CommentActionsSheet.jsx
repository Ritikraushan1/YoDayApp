import React from "react";
import { Modal, View, Text, StyleSheet, Pressable, TouchableOpacity } from "react-native";

const reactions = [
    { id: "like", emoji: "👍", label: "Like" },
    { id: "love", emoji: "❤️", label: "Love" },
    { id: "care", emoji: "🤗", label: "Care" },
    { id: "haha", emoji: "😂", label: "Haha" },
    { id: "wow", emoji: "😮", label: "Wow" },
    { id: "sad", emoji: "😢", label: "Weeping" },
    { id: "angry", emoji: "😡", label: "Angry" },
];

const CommentActionSheet = ({
    visible,
    onClose,
    onReport,
    onCopy,
    showDelete = false,
    onDelete,
    onReact, // 👈 new callback for reactions
}) => {
    return (
        <Modal
            transparent
            animationType="slide"
            visible={visible}
            onRequestClose={onClose}
        >
            {/* 👇 Tapping outside closes only */}
            <Pressable style={styles.overlay} onPress={onClose}>
                <View style={styles.sheet}>
                    {/* 👇 Reactions Bar */}
                    <View style={styles.reactionRow}>
                        {reactions.map((reaction) => (
                            <TouchableOpacity
                                key={reaction.id}
                                style={styles.reactionBtn}
                                onPress={() => {
                                    onClose();
                                    onReact?.(reaction.id);
                                }}
                            >
                                <Text style={styles.reactionEmoji}>{reaction.emoji}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>

                    {/* Divider */}
                    <View style={styles.divider} />

                    {/* 👇 Other actions */}
                    {showDelete && (
                        <Pressable
                            style={styles.option}
                            onPress={() => {
                                onClose();
                                onDelete?.();
                            }}
                        >
                            <Text style={[styles.optionText, { color: "red" }]}>Delete</Text>
                        </Pressable>
                    )}

                    <Pressable style={styles.option} onPress={onReport}>
                        <Text style={styles.optionText}>Report</Text>
                    </Pressable>

                    <Pressable style={[styles.option, styles.cancel]} onPress={onClose}>
                        <Text style={[styles.optionText, { color: "gray" }]}>Cancel</Text>
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
    reactionRow: {
        flexDirection: "row",
        justifyContent: "space-around",
        marginBottom: 12,
        paddingVertical: 4,
    },
    reactionBtn: {
        paddingHorizontal: 6,
    },
    reactionEmoji: {
        fontSize: 28,
    },
    divider: {
        borderBottomWidth: 1,
        borderBottomColor: "#eee",
        marginBottom: 10,
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