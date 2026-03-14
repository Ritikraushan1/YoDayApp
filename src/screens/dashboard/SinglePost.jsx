import React, { useState } from "react";
import {
    View,
    Text,
    Pressable,
    StyleSheet,
    Dimensions,
    ScrollView,
    RefreshControl,
    Platform,
    PermissionsAndroid,
    Alert,
    Linking
} from "react-native";
import { PERMISSIONS, RESULTS, request, check } from 'react-native-permissions';
import { launchImageLibrary } from "react-native-image-picker";
import Header from "../../components/Header";
import CommentCard from "../../components/CommentCard";
import { useSelector } from "react-redux";
import { PostService } from "../../api/PostService";
import { CommentsService } from "../../api/CommentService";
import CommentInput from "../../components/CommentInput";
import SimpleHeader from "../../components/SimpleHeader";
import { UploadService } from "../../api/UploadService";
import AlertModal from "../../components/AlertModal";

const { height } = Dimensions.get("window");

const SinglePosts = ({ navigation, route }) => {
    const user = useSelector((state) => state.user.userInfo);
    const [searchText, setSearchText] = useState("");
    const [comments, setComments] = useState([]);
    const [refreshing, setRefreshing] = useState(false);
    const [showComments, setShowComments] = useState(false);
    const [currentPost, setCurrentPost] = useState(route.params.post);
    const [customAlert, setCustomAlert] = useState({
        visible: false,
        message: "",
        onOk: null,
        onCancel: null,
        showCancel: true,
    });

    const answer = currentPost
        ? currentPost.likedByUser
            ? "yes"
            : currentPost.dislikedByUser
                ? "no"
                : null
        : null;

    const getCommentsForPost = async () => {
        if (!currentPost?.post_code) return;
        try {
            const res = await CommentsService.getAllCommentsForPosts(currentPost.post_code);
            setComments(res?.data?.comments || []);
        } catch (err) {
            console.error("Failed to load comments", err);
        }
    };
    const handleLike = async (comment) => {
        await handleReact(comment, "like");
    };


    const handleReply = async (id, replyText, image) => {
        const res = await CommentsService.addNewReplyToComments(currentPost?.post_code, replyText, id, image);
        console.log("res after getting comments", res);
        await getCommentsForPost()

    };

    const handleAttachCommentImage = async () => {
        try {
            let permissionResult;

            if (Platform.OS === "android") {
                permissionResult = await check(PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE);
                if (permissionResult !== RESULTS.GRANTED) {
                    permissionResult = await request(PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE);
                    if (permissionResult !== RESULTS.GRANTED) return;
                }
            } else if (Platform.OS === "ios") {
                const permission = PERMISSIONS.IOS.PHOTO_LIBRARY;
                permissionResult = await check(permission);

                if (permissionResult === RESULTS.DENIED) {
                    permissionResult = await request(permission);
                }

                if (permissionResult === RESULTS.BLOCKED || permissionResult === RESULTS.UNAVAILABLE) {
                    Alert.alert(
                        "Permission Needed",
                        "This feature requires access to your photo library to attach images. Please enable it in Settings.",
                        [
                            { text: "Cancel", style: "cancel" },
                            {
                                text: "Open Settings",
                                onPress: () => Linking.openSettings(),
                            },
                        ]
                    );
                    return;
                }
                if (permissionResult !== RESULTS.GRANTED) return;
            }

            // ✅ Open image picker
            launchImageLibrary(
                { mediaType: 'photo', maxWidth: 800, maxHeight: 800, quality: 0.8 },
                async (response) => {
                    if (response.didCancel) return;
                    if (response.errorCode) {
                        console.error("ImagePicker Error: ", response.errorMessage);
                        return;
                    }
                    const image = response.assets[0];
                    const url = await UploadService.uploadImageAndGetUrl(image);
                    setNewCommentImage(url); // Save uploaded image URL
                }
            );
        } catch (err) {
            console.warn(err);
        }
    };

    const deleteComments = async (comment) => {
        try {
            const res = await CommentsService.deleteComments(comment?.comment_id);

            if (res?.status === 200) {
                // ✅ Remove the deleted comment and its replies locally
                setComments((prevComments) =>
                    prevComments
                        .filter((c) => c.comment_id !== comment.comment_id) // remove top-level comment
                        .map((c) => ({
                            ...c,
                            replies: c.replies?.filter(
                                (r) => r.comment_id !== comment.comment_id && r.parent_id !== comment.comment_id
                            ), // remove replies that belong to the deleted comment
                        }))
                );

                // ✅ Optionally re-fetch from server for guaranteed consistency
                await getCommentsForPost();
            }
        } catch (err) {
            console.error("Failed to delete comment:", err);
        }
    };

    const onDeleteComment = (comment) => {
        setCustomAlert({
            visible: true,
            message: "Are you sure want to delete comment?",
            onOk: async () => {
                setCustomAlert({ visible: false });
                await deleteComments(comment)
            },
            onCancel: () => {
                setCustomAlert({ visible: false });
            }
        })
    }

    // 🔹 Handle Reactions (like, love, haha, etc.)
    const handleReact = async (comment, reactionType) => {
        try {
            // Check current reaction
            const currentReaction = comment.userReaction;

            // Update local UI instantly (optimistic update)
            setComments(prevComments =>
                prevComments.map(c =>
                    c.comment_id === comment.comment_id
                        ? {
                            ...c,
                            userReaction:
                                currentReaction === reactionType ? null : reactionType,
                            totalReactions:
                                currentReaction === reactionType
                                    ? Math.max(0, (c.totalReactions ?? 1) - 1)
                                    : (c.totalReactions ?? 0) + (currentReaction ? 0 : 1),
                        }
                        : c
                )
            );

            let res;
            // If user clicked same reaction again → remove it
            if (currentReaction === reactionType) {
                res = await CommentsService.deleteReactionToComment(comment.comment_id);
            } else {
                // Add / Update reaction
                res = await CommentsService.addReactionToComment(comment.comment_id, reactionType);
            }

            // Optionally refresh comments to ensure backend sync
            await getCommentsForPost();
        } catch (error) {
            console.error("Error handling reaction:", error);
        }
    };


    const handleSendComment = async (text, image) => {
        if (!text && !image) return;
        try {
            const res = await CommentsService.addNewComments(
                currentPost.post_code,
                text,
                image
            );
            if (res?.status === 200) {
                setComments((prev) => [
                    ...prev,
                    {
                        comment_id: res.data.comment.comment_id,
                        username: user.name,
                        text,
                        image_url: res.data.comment.image_url,
                        replies: [],
                        likedByUser: false,
                        like_count: 0,
                    },
                ]);
            }
        } catch (err) {
            console.error("Failed to post comment", err);
        }
    };

    const handleAnswer = async (postCode, type) => {
        try {
            let nextState = null;

            setCurrentPost((prev) => {
                if (!prev) return prev;
                const updated = { ...prev };

                if (type === "like") {
                    if (prev.likedByUser) {
                        updated.likedByUser = false;
                        updated.like_count = Math.max(0, (prev.like_count ?? 0) - 1);
                    } else {
                        updated.likedByUser = true;
                        updated.like_count = (prev.like_count ?? 0) + 1;
                        if (prev.dislikedByUser) {
                            updated.dislikedByUser = false;
                            updated.dislike_count = Math.max(0, (prev.dislike_count ?? 0) - 1);
                        }
                    }
                } else if (type === "dislike") {
                    if (prev.dislikedByUser) {
                        updated.dislikedByUser = false;
                        updated.dislike_count = Math.max(0, (prev.dislike_count ?? 0) - 1);
                    } else {
                        updated.dislikedByUser = true;
                        updated.dislike_count = (prev.dislike_count ?? 0) + 1;
                        if (prev.likedByUser) {
                            updated.likedByUser = false;
                            updated.like_count = Math.max(0, (prev.like_count ?? 0) - 1);
                        }
                    }
                }

                nextState =
                    updated.likedByUser || updated.dislikedByUser ? "reacted" : "none";
                return updated;
            });

            await PostService.reactPost(postCode, type);

            // ⚙️ Handle transitions
            if (nextState === "none") {
                // user removed reaction → back to initial
                setShowComments(false);
            }
            // else keep current showComments as-is
        } catch (err) {
            console.error("Failed to react to post", err);
        }
    };

    const handleRefresh = async () => {
        setRefreshing(true);
        try {
            await getCommentsForPost();
        } finally {
            setRefreshing(false);
        }
    };

    const formatPostDate = (dateString) => {
        const postDate = new Date(dateString);
        const today = new Date();
        const yesterday = new Date();
        yesterday.setDate(today.getDate() - 1);

        if (
            postDate.getDate() === today.getDate() &&
            postDate.getMonth() === today.getMonth() &&
            postDate.getFullYear() === today.getFullYear()
        )
            return "Today";
        if (
            postDate.getDate() === yesterday.getDate() &&
            postDate.getMonth() === yesterday.getMonth() &&
            postDate.getFullYear() === yesterday.getFullYear()
        )
            return "Yesterday";

        return postDate.toLocaleDateString("en-US", { day: "2-digit", month: "short" });
    };

    return (
        <View style={{ flex: 1, backgroundColor: "transparent" }}>
            <SimpleHeader onBack={() => navigation.goBack()} title="Previous Posts" />

            <ScrollView
                contentContainerStyle={{ flexGrow: 1, backgroundColor: "white" }}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={handleRefresh}
                        tintColor="#28a745"
                        title="Refreshing..."
                        titleColor="#28a745"
                    />
                }
            >
                {!showComments ? (
                    // 🟢 FULL POST MODE
                    <View style={styles.fullPostScreen}>
                        <View style={styles.topRightContainer}>
                            <Text style={styles.postDate}>
                                {formatPostDate(currentPost?.created_at)}
                            </Text>
                        </View>

                        <View style={styles.centerContent}>
                            <Text style={styles.postText}>{currentPost?.content}</Text>

                            <View style={styles.centerArea}>
                                <View style={styles.row}>
                                    <Pressable
                                        style={[styles.choiceButton, answer === "yes" && styles.selectedYes]}
                                        onPress={() => handleAnswer(currentPost?.post_code, "like")}
                                    >
                                        <Text
                                            style={[
                                                styles.choiceText,
                                                answer === "yes" && styles.choiceTextSelected,
                                            ]}
                                        >
                                            Yes
                                        </Text>
                                        <Text style={styles.countText}>{currentPost?.like_count ?? 0}</Text>
                                    </Pressable>

                                    <Pressable
                                        style={[styles.choiceButton, answer === "no" && styles.selectedNo]}
                                        onPress={() => handleAnswer(currentPost?.post_code, "dislike")}
                                    >
                                        <Text
                                            style={[
                                                styles.choiceText,
                                                answer === "no" && styles.choiceTextSelected,
                                            ]}
                                        >
                                            No
                                        </Text>
                                        <Text style={styles.countText}>
                                            {currentPost?.dislike_count ?? 0}
                                        </Text>
                                    </Pressable>
                                </View>

                                {answer && (
                                    <Pressable
                                        style={styles.commentButton}
                                        onPress={async () => {
                                            await getCommentsForPost();
                                            setShowComments(true);
                                        }}
                                    >
                                        <Text style={styles.commentText}>Comments</Text>
                                    </Pressable>
                                )}
                            </View>
                        </View>


                    </View>
                ) : (
                    // 🟣 COMMENT MODE
                    <ScrollView contentContainerStyle={{ paddingBottom: 30 }}>
                        <View style={styles.postScreen}>
                            <Text style={styles.postText}>{currentPost.content}</Text>

                            <View style={styles.centerArea}>
                                <View style={styles.row}>
                                    <Pressable
                                        style={[styles.choiceButton, answer === "yes" && styles.selectedYes]}
                                        onPress={() => handleAnswer(currentPost.post_code, "like")}
                                    >
                                        <Text
                                            style={[
                                                styles.choiceText,
                                                answer === "yes" && styles.choiceTextSelected,
                                            ]}
                                        >
                                            Yes
                                        </Text>
                                        <Text style={styles.countText}>{currentPost?.like_count ?? 0}</Text>
                                    </Pressable>

                                    <Pressable
                                        style={[styles.choiceButton, answer === "no" && styles.selectedNo]}
                                        onPress={() => handleAnswer(currentPost.post_code, "dislike")}
                                    >
                                        <Text
                                            style={[
                                                styles.choiceText,
                                                answer === "no" && styles.choiceTextSelected,
                                            ]}
                                        >
                                            No
                                        </Text>
                                        <Text style={styles.countText}>
                                            {currentPost?.dislike_count ?? 0}
                                        </Text>
                                    </Pressable>
                                </View>

                                <Pressable
                                    style={styles.commentButton}
                                    onPress={() => setShowComments(false)}
                                >
                                    <Text style={styles.commentText}>Hide Comments</Text>
                                </Pressable>
                            </View>
                        </View>

                        <View style={styles.commentSection}>
                            {comments.length === 0 && (
                                <Text style={styles.noCommentsText}>
                                    No comments yet. Be the first to comment!
                                </Text>
                            )}

                            {comments.map((c) => (
                                <CommentCard
                                    key={c.comment_id}
                                    comment={c}
                                    onLike={handleLike}
                                    onReply={handleReply}
                                    onReact={handleReact}
                                    onDelete={onDeleteComment}
                                    onAttach={handleAttachCommentImage}
                                    level={0}
                                />
                            ))}

                            <CommentInput
                                onSend={({ text, image }) => handleSendComment(text, image)}
                            />
                        </View>
                    </ScrollView>
                )}
            </ScrollView>
            <AlertModal
                visible={customAlert.visible}
                alertText={customAlert.message}
                showCancel={customAlert.showCancel}
                showOk={true}
                onOk={() => {
                    if (customAlert.onOk) customAlert.onOk();
                    setCustomAlert(prev => ({ ...prev, visible: false }));
                }}
                onCancel={() => {
                    if (customAlert.onCancel) customAlert.onCancel();
                    setCustomAlert(prev => ({ ...prev, visible: false }));
                }}
                okText="OK"
                cancelText="Cancel"
            />
        </View>
    );
};

export default SinglePosts;

const styles = StyleSheet.create({
    fullPostScreen: {
        flex: 1,
        justifyContent: "space-between",
        backgroundColor: "#fff",
        borderRadius: 28,
        margin: 12,
        paddingHorizontal: 20,
        paddingVertical: 10,
        shadowColor: "#000",
        shadowOpacity: 0.08,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 4 },
        elevation: 3,
        position: "relative",
    },
    centerContent: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 20,
    },
    postScreen: {
        padding: 20,
        backgroundColor: "#fff",
        borderRadius: 28,
        margin: 12,
        shadowColor: "#000",
        shadowOpacity: 0.08,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 4 },
        elevation: 3,
    },
    postText: {
        fontSize: 22,
        fontWeight: "500",
        color: "#333",
        textAlign: "center",
        marginTop: 10,
    },
    centerArea: { alignItems: "center", marginTop: 15 },
    row: { flexDirection: "row", justifyContent: "center", gap: 40, marginVertical: 20 },
    choiceButton: {
        paddingVertical: 10,
        paddingHorizontal: 28,
        borderRadius: 10,
        borderWidth: 1.5,
        borderColor: "#ccc",
    },
    choiceText: { fontSize: 18, color: "#444" },
    countText: { fontSize: 16, fontWeight: "500", color: "#333" },
    selectedYes: { backgroundColor: "#d4edda", borderColor: "#28a745" },
    selectedNo: { backgroundColor: "#f8d7da", borderColor: "#dc3545" },
    choiceTextSelected: { fontWeight: "600" },
    commentButton: {
        backgroundColor: "#E9ECEF",
        paddingVertical: 12,
        paddingHorizontal: 40,
        borderRadius: 10,
        marginTop: 10,
    },
    commentText: { fontSize: 16, fontWeight: "500", color: "#333" },
    commentSection: { marginTop: 10, paddingHorizontal: 12 },
    noCommentsText: {
        textAlign: "center",
        color: "#888",
        marginVertical: 10,
        fontSize: 16,
    },
    postDate: { fontSize: 14, color: "#888", fontWeight: "500" },
    topRightContainer: { position: "absolute", top: 20, right: 30, zIndex: 10 },
});