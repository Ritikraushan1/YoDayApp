// components/CommentCard.js
import React, { useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    Pressable,
    TextInput,
    TouchableOpacity,
} from "react-native";

const CommentCard = ({ comment, onLike, onReply, onReact, onAttach }) => {
    const [showReplyInput, setShowReplyInput] = useState(false);
    const [replyText, setReplyText] = useState("");

    const handleReply = () => {
        if (replyText.trim()) {
            onReply(comment.id, replyText);
            setReplyText("");
            setShowReplyInput(false);
        }
    };

    return (
        <View style={styles.card}>
            <Text style={styles.author}>{comment.author}</Text>
            <Text style={styles.text}>{comment.text}</Text>

            {/* Action buttons */}
            <View style={styles.actions}>
                <Pressable onPress={() => onLike(comment.id)}>
                    <Text style={styles.actionBtn}>👍 Like</Text>
                </Pressable>
                <Pressable onPress={() => setShowReplyInput(!showReplyInput)}>
                    <Text style={styles.actionBtn}>💬 Reply</Text>
                </Pressable>
                <Pressable onPress={() => onReact(comment.id)}>
                    <Text style={styles.actionBtn}>😀 React</Text>
                </Pressable>
            </View>

            {/* Reply input */}
            {showReplyInput && (
                <View style={styles.replyBox}>
                    {/* Attach button */}
                    <TouchableOpacity
                        style={styles.attachBtn}
                        onPress={() => onAttach && onAttach(comment.id)}
                    >
                        <Text style={styles.attachText}>＋</Text>
                    </TouchableOpacity>

                    {/* Input */}
                    <TextInput
                        style={styles.input}
                        placeholder="Write a reply..."
                        value={replyText}
                        onChangeText={setReplyText}
                    />

                    {/* Send button */}
                    <Pressable style={styles.sendBtn} onPress={handleReply}>
                        <Text style={styles.sendText}>Send</Text>
                    </Pressable>
                </View>
            )}

            {/* Nested replies */}
            {comment.replies?.length > 0 && (
                <View style={styles.replies}>
                    {comment.replies.map((reply) => (
                        <CommentCard
                            key={reply.id}
                            comment={reply}
                            onLike={onLike}
                            onReply={onReply}
                            onReact={onReact}
                            onAttach={onAttach}
                        />
                    ))}
                </View>
            )}
        </View>
    );
};

export default CommentCard;

const styles = StyleSheet.create({
    card: {
        backgroundColor: "#fff",
        padding: 12,
        marginVertical: 8,
        borderRadius: 10,
        shadowColor: "#000",
        shadowOpacity: 0.05,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 4,
        elevation: 2,
    },
    author: {
        fontWeight: "bold",
        fontSize: 14,
        marginBottom: 4,
        color: "#333",
    },
    text: {
        fontSize: 14,
        color: "#444",
        marginBottom: 8,
    },
    actions: {
        flexDirection: "row",
        justifyContent: "flex-start",
        gap: 15,
    },
    actionBtn: {
        fontSize: 13,
        color: "#007BFF",
    },
    replyBox: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: 8,
    },
    attachBtn: {
        marginRight: 8,
        backgroundColor: "#f1f1f1",
        borderRadius: 8,
        padding: 8,
        justifyContent: "center",
        alignItems: "center",
    },
    attachText: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#007BFF",
    },
    input: {
        flex: 1,
        borderWidth: 1,
        borderColor: "#ddd",
        borderRadius: 8,
        padding: 8,
        fontSize: 14,
    },
    sendBtn: {
        marginLeft: 8,
        backgroundColor: "#007BFF",
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 8,
    },
    sendText: {
        color: "#fff",
        fontWeight: "bold",
    },
    replies: {
        marginTop: 10,
        marginLeft: 20,
        borderLeftWidth: 1,
        borderLeftColor: "#eee",
        paddingLeft: 10,
    },
});
