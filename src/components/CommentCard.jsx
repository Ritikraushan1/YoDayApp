// path: src/components/CommentCard.js
import React, { useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    Pressable,
    TouchableOpacity,
    Image,
    useWindowDimensions,
} from "react-native";
import CommentActionSheet from "./CommentActionsSheet";
import Clipboard from "@react-native-clipboard/clipboard";
import ReportModal from "./ReportModal";
import { CommentsService } from "../api/CommentService";
import CommentInput from "./CommentInput";
import ImageModal from "./ImageModal";
import { useSelector } from "react-redux";

const reactions = [
    { id: "like", emoji: "👍", label: "Like" },
    { id: "love", emoji: "❤️", label: "Love" },
    { id: "care", emoji: "🤗", label: "Care" },
    { id: "haha", emoji: "😂", label: "Haha" },
    { id: "wow", emoji: "😮", label: "Wow" },
    { id: "sad", emoji: "😢", label: "Weeping" },
    { id: "angry", emoji: "😡", label: "Angry" },
];

const MAX_LEVEL = 2;              // cap visual depth
const INDENT = 20;                // per-level intended indent
const MIN_CARD_RATIO = 0.6;       // each card must keep >= 60% of screen

const CommentCard = ({
    comment,
    onLike,
    onReply,
    onReact,
    onAttach,
    onDelete,
    level = 0,
}) => {
    const { width } = useWindowDimensions();
    const user = useSelector((state) => state.user.userInfo);

    const [showReplyInput, setShowReplyInput] = useState(false);
    const [showReplies, setShowReplies] = useState(false);
    const [showReportModal, setShowReportModal] = useState(false);
    const [showActionSheet, setShowActionSheet] = useState(false);
    const [imageModalVisible, setImageModalVisible] = useState(false);

    const MAX_LEFT_GAP = Math.max(0, width * (1 - MIN_CARD_RATIO)); // why: guarantee >=60% visible
    const nextLevel = Math.min(level + 1, MAX_LEVEL);

    // remaining gap allowed at this depth so total gap never exceeds MAX_LEFT_GAP
    const usedGap = level * INDENT;
    const remaining = Math.max(0, MAX_LEFT_GAP - usedGap);
    const repliesIndent =
        level < MAX_LEVEL ? Math.min(INDENT, remaining) : 0;
    const showRepliesBorder = repliesIndent > 0;

    const handleReply = ({ text, image }) => {
        if (text?.trim() || image) {
            onReply(comment.comment_id, text, image);
            setShowReplyInput(false);
            setShowReplies(true);
        }
    };

    const getReactionDisplay = (reactionId) => {
        if (!reactionId) return { label: "Like", emoji: "" };
        return reactions.find((r) => r.id === reactionId) || { label: "Like", emoji: "" };
    };

    const handleReport = () => {
        setShowActionSheet(false);
        setShowReportModal(true);
    };

    const submitReport = async (data) => {
        await CommentsService.addNewReportComments(
            data.commentId,
            data.reason,
            data?.reason,
            data?.details,
            data?.post_code
        );
    };

    const handleCopy = () => {
        if (comment.text) Clipboard.setString(comment.text);
    };

    const toggleReply = () => {
        setShowReplyInput((v) => !v);
        if (comment.replies?.length > 0) setShowReplies(true);
    };

    return (
        <Pressable
            onPress={() => setShowReplies(!showReplies)}
            onLongPress={() => setShowActionSheet(true)}
            delayLongPress={300}
        >
            <View style={styles.card}>
                <Text style={styles.author}>{comment.username}</Text>
                {Boolean(comment.text) && <Text style={styles.text}>{comment.text}</Text>}

                {comment?.image_url && (
                    <TouchableOpacity activeOpacity={0.9} onPress={() => setImageModalVisible(true)}>
                        <Image source={{ uri: comment.image_url }} style={styles.commentImage} resizeMode="cover" />
                    </TouchableOpacity>
                )}

                <View style={styles.actions}>
                    <Pressable
                        onPress={() =>
                            onReact(comment, comment?.userReaction ? comment.userReaction : "like")
                        }
                    >
                        {(() => {
                            const reactionDisplay = getReactionDisplay(comment.userReaction);
                            return (
                                <Text
                                    style={[
                                        styles.actionBtn,
                                        comment.userReaction && { color: "#007BFF", fontWeight: "bold" },
                                    ]}
                                >
                                    {reactionDisplay.emoji
                                        ? `${reactionDisplay.emoji} ${reactionDisplay.label}`
                                        : "Like"}
                                    {comment?.totalReactions > 0 ? ` ${comment.totalReactions}` : ""}
                                </Text>
                            );
                        })()}
                    </Pressable>

                    <Pressable onPress={toggleReply}>
                        <Text style={styles.actionBtn}>
                            {showReplyInput
                                ? "Hide Reply"
                                : `${comment.replies?.length > 0 ? comment.replies.length + " Replies" : "Reply"}`}
                        </Text>
                    </Pressable>
                </View>


            </View>
            {showReplyInput && <CommentInput onSend={handleReply} />}
            {showReplies && comment.replies?.length > 0 && (
                <View
                    style={[
                        styles.replies,
                        {
                            marginLeft: repliesIndent,                 // indent with clamp
                            borderLeftWidth: showRepliesBorder ? 1 : 0,
                        },
                    ]}
                >
                    {comment.replies.map((reply) => (
                        <CommentCard
                            key={reply.comment_id}
                            comment={reply}
                            onLike={onLike}
                            onReply={onReply}
                            onReact={onReact}
                            onAttach={onAttach}
                            onDelete={onDelete}
                            level={nextLevel}
                        />
                    ))}
                </View>
            )}

            <CommentActionSheet
                visible={showActionSheet}
                onClose={() => setShowActionSheet(false)}
                onReport={handleReport}
                onCopy={handleCopy}
                showDelete={comment.user_id === user?.id}
                onDelete={() => {
                    setShowActionSheet(false);
                    onDelete?.(comment);
                }}
                onReact={(reactionType) => {
                    setShowActionSheet(false);
                    onReact?.(comment, reactionType);
                }}
            />

            <ReportModal
                visible={showReportModal}
                onClose={() => setShowReportModal(false)}
                onSubmit={submitReport}
                comment={comment}
            />

            <ImageModal
                show={imageModalVisible}
                closeModal={() => setImageModalVisible(false)}
                file={comment.image_url}
                text={comment.text || ""}
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
    author: { fontWeight: "bold", fontSize: 14, marginBottom: 4, color: "#333" },
    text: { fontSize: 14, color: "#444", marginBottom: 8 },
    actions: { flexDirection: "row", justifyContent: "flex-start", gap: 15 },
    actionBtn: { fontSize: 13, color: "#007BFF" },
    replies: {
        marginTop: 10,
        borderLeftColor: "#eee",
        // paddingLeft: 10,
    },
    commentImage: {
        width: "70%",
        height: 180,
        borderRadius: 8,
        marginTop: 6,
    },
});
