import React, { useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    Pressable,
    TextInput,
    TouchableOpacity,
    Image
} from "react-native";
import CommentActionSheet from "./CommentActionsSheet";
import Clipboard from "@react-native-clipboard/clipboard";
import ReportModal from "./ReportModal";
import { CommentsService } from "../api/CommentService";
import CommentInput from "./CommentInput";

const CommentCard = ({ comment, onLike, onReply, onReact, onAttach }) => {
    const [showReplyInput, setShowReplyInput] = useState(false);
    const [showReplies, setShowReplies] = useState(false);
    const [replyText, setReplyText] = useState("");
    const [showReportModal, setShowReportModal] = useState(false);
    const [showActionSheet, setShowActionSheet] = useState(false);
    const [showReplyComments, setShowReplyComments] = useState(false)


    const handleReply = ({ text, image }) => {
        if (text.trim() || image) {
            onReply(comment.comment_id, text, image); // pass text + image to parent
            setShowReplyInput(false);
            setShowReplies(true); // auto-show replies after submitting
        }
    };


    const handleReport = () => {
        setShowActionSheet(false);
        setShowReportModal(true);
    };

    const submitReport = async (data) => {
        console.log("Report submitted:", data);
        const res = await CommentsService.addNewReportComments(data.commentId, data.reason, data?.reason, data?.details, data?.post_code);
        console.log("res after reporting", res);

        // Call API with data.commentId, data.reason, data.details
    };
    const handleCopy = () => {
        Clipboard.setString(comment.text);
    }

    const toggleReply = () => {
        // toggle reply input + replies visibility
        const newState = !showReplyInput;
        setShowReplyInput(newState);
        if (!newState) {
            setShowReplies(false);
        }
    };

    return (
        <Pressable onPress={() => setShowReplies(!showReplies)} onLongPress={() => setShowActionSheet(true)} // 👈 open action sheet on long press
            delayLongPress={300}>
            <View style={styles.card}>
                <Text style={styles.author}>{comment.username}</Text>
                <Text style={styles.text}>{comment.text}</Text>

                {comment?.image_url && (
                    <Image
                        source={{ uri: comment.image_url }}
                        style={styles.commentImage}
                        resizeMode="cover"
                    />
                )}

                {/* Action buttons */}
                <View style={styles.actions}>
                    <Pressable onPress={() => onLike(comment.comment_id)}>
                        <Text style={styles.actionBtn}>
                            Like {comment?.likes > 0 && comment?.likes}
                        </Text>
                    </Pressable>

                    <Pressable onPress={toggleReply}>
                        <Text style={styles.actionBtn}>
                            {showReplyInput ? "Hide Reply" : "Reply"}
                        </Text>
                    </Pressable>
                </View>

                {/* Reply input */}
                {showReplyInput && (
                    <CommentInput
                        onSend={handleReply}
                    />
                )}

                {/* Nested replies (only when requested) */}
                {/* Nested replies (always show if they exist) */}
                {showReplies && comment.replies?.length > 0 && (
                    <View style={styles.replies}>
                        {comment.replies.map((reply) => (
                            <CommentCard
                                key={reply.comment_id}
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
            <CommentActionSheet
                visible={showActionSheet}
                onClose={() => setShowActionSheet(false)}
                onReport={handleReport}
                onCopy={handleCopy}
            />
            <ReportModal
                visible={showReportModal}
                onClose={() => setShowReportModal(false)}
                onSubmit={submitReport}
                comment={comment}
            />
        </Pressable>
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
    commentImage: {
        width: "70%",
        height: 180,
        borderRadius: 8,
        marginTop: 6,
    },

});
