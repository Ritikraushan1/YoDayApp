import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    Pressable,
    StyleSheet,
    Dimensions,
    ScrollView,
    TextInput,
    RefreshControl,
} from "react-native";
import Header from "../../components/Header";
import CommentCard from "../../components/CommentCard";
import { useSelector } from "react-redux";
import { PostService } from "../../api/PostService";
import { CommentsService } from "../../api/CommentService";
import CommentInput from "../../components/CommentInput";

const { height } = Dimensions.get("window");

const SinglePosts = ({ navigation, route }) => {
    const user = useSelector(state => state.user.userInfo);
    const [searchText, setSearchText] = useState("");
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState("");
    const [showComments, setShowComments] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [newCommentImage, setNewCommentImage] = useState(null);

    const { post } = route.params;
    const [currentPost, setCurrentPost] = useState(post);

    useEffect(() => {
        getCommentsForPost();
    }, [showComments]);

    const getCommentsForPost = async () => {
        try {
            const res = await CommentsService.getAllCommentsForPosts(currentPost?.post_code);
            setComments(res?.data?.comments || []);
        } catch (err) {
            console.error("Failed to load comments", err);
        }
    };

    const handleSendComment = async (text, image) => {
        console.log("in handle send comment",);


        try {
            const res = await CommentsService.addNewComments(currentPost?.post_code, text, image);
            console.log("res after adding comments", res.data);

            if (res?.status === 200) {
                setComments((prev) => [
                    ...prev,
                    {
                        id: Date.now().toString(),
                        username: user.name,
                        text: text,
                        image_url: image,
                        replies: [],
                    },
                ]);
                setNewComment(""); // clear input
                setNewCommentImage("")
            }
        } catch (err) {
            console.error("Failed to post comment", err);
        }
    };


    const handleAnswer = async (postCode, type) => {
        try {
            const res = await PostService.reactPost(postCode, type);
            if (res.status === 200) {
                setCurrentPost(prev => {
                    if (!prev) return prev;
                    let updatedPost = { ...prev };

                    if (type === "like") {
                        if (prev.liked_by_you) {
                            updatedPost.liked_by_you = false;
                            updatedPost.like_count = Math.max(0, prev.like_count - 1);
                        } else {
                            updatedPost.liked_by_you = true;
                            updatedPost.like_count = prev.like_count + 1;
                            if (prev.disliked_by_you) {
                                updatedPost.disliked_by_you = false;
                                updatedPost.dislike_count = Math.max(0, prev.dislike_count - 1);
                            }
                        }
                    } else if (type === "dislike") {
                        if (prev.disliked_by_you) {
                            updatedPost.disliked_by_you = false;
                            updatedPost.dislike_count = Math.max(0, prev.dislike_count - 1);
                        } else {
                            updatedPost.disliked_by_you = true;
                            updatedPost.dislike_count = prev.dislike_count + 1;
                            if (prev.liked_by_you) {
                                updatedPost.liked_by_you = false;
                                updatedPost.like_count = Math.max(0, prev.like_count - 1);
                            }
                        }
                    }
                    return updatedPost;
                });
            }
        } catch (error) {
            console.error("Failed to react to post", error);
        }
    };

    const formatPostDate = (dateString) => {
        const postDate = new Date(dateString);
        const today = new Date();
        const yesterday = new Date();
        yesterday.setDate(today.getDate() - 1);

        const isToday =
            postDate.getDate() === today.getDate() &&
            postDate.getMonth() === today.getMonth() &&
            postDate.getFullYear() === today.getFullYear();

        const isYesterday =
            postDate.getDate() === yesterday.getDate() &&
            postDate.getMonth() === yesterday.getMonth() &&
            postDate.getFullYear() === yesterday.getFullYear();

        if (isToday) return "Today";
        if (isYesterday) return "Yesterday";

        const options = { day: "2-digit", month: "short" };
        return postDate.toLocaleDateString("en-US", options);
    };

    const handleRefresh = async () => {
        setRefreshing(true);
        try {
            await getCommentsForPost();
        } finally {
            setRefreshing(false);
        }
    };

    const answer = currentPost
        ? currentPost.liked_by_you
            ? "yes"
            : currentPost.disliked_by_you
                ? "no"
                : null
        : null;

    return (
        <View style={{ flex: 1, backgroundColor: "transparent" }}>
            {/* Header */}
            <Header
                username={user?.name}
                avatar={user?.avatar}
                searchText={searchText}
                onChangeSearch={(text) => setSearchText(text)}
                onClickOnSearch={() => navigation.navigate("SearchPosts")}
            />

            <ScrollView
                contentContainerStyle={{ flexGrow: 1, backgroundColor: 'white' }}
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
                                        <View style={styles.choiceContent}>
                                            <Text style={[styles.choiceText, answer === "yes" && styles.choiceTextSelected]}>
                                                Yes
                                            </Text>
                                            <Text style={styles.countText}>{currentPost?.like_count}</Text>
                                        </View>
                                    </Pressable>

                                    <Pressable
                                        style={[styles.choiceButton, answer === "no" && styles.selectedNo]}
                                        onPress={() => handleAnswer(currentPost?.post_code, "dislike")}
                                    >
                                        <View style={styles.choiceContent}>
                                            <Text style={[styles.choiceText, answer === "no" && styles.choiceTextSelected]}>
                                                No
                                            </Text>
                                            <Text style={styles.countText}>{currentPost?.dislike_count}</Text>
                                        </View>
                                    </Pressable>
                                </View>

                                {answer && (
                                    <Pressable style={styles.commentButton} onPress={() => setShowComments(true)}>
                                        <Text style={styles.commentText}>Comments</Text>
                                    </Pressable>
                                )}
                            </View>
                        </View>
                    </View>
                ) : (
                    <ScrollView contentContainerStyle={{ paddingBottom: 30 }}>
                        <View style={styles.postScreen}>
                            <Text style={styles.postText}>{currentPost.content}</Text>

                            <View style={styles.centerArea}>
                                <View style={styles.row}>
                                    <Pressable
                                        style={[styles.choiceButton, answer === "yes" && styles.selectedYes]}
                                        onPress={() => handleAnswer(currentPost.post_code, "like")}
                                    >
                                        <Text style={[styles.choiceText, answer === "yes" && styles.choiceTextSelected]}>
                                            Yes
                                        </Text>
                                        <Text style={styles.countText}>{currentPost?.like_count}</Text>
                                    </Pressable>

                                    <Pressable
                                        style={[styles.choiceButton, answer === "no" && styles.selectedNo]}
                                        onPress={() => handleAnswer(currentPost.post_code, "dislike")}
                                    >
                                        <Text style={[styles.choiceText, answer === "no" && styles.choiceTextSelected]}>
                                            No
                                        </Text>
                                        <Text style={styles.countText}>{currentPost?.dislike_count}</Text>
                                    </Pressable>
                                </View>

                                <Pressable style={styles.commentButton} onPress={() => setShowComments(false)}>
                                    <Text style={styles.commentText}>Hide Comments</Text>
                                </Pressable>
                            </View>
                        </View>

                        <View style={styles.commentSection}>
                            {comments.length === 0 && (
                                <Text style={styles.noCommentsText}>No comments yet. Be the first to comment!</Text>
                            )}

                            {comments.map((c) => (
                                <CommentCard
                                    key={c.comment_id}
                                    comment={c}
                                    onLike={() => console.log("like", c.comment_id)}
                                    onReply={() => console.log("reply", c.comment_id)}
                                    onReact={() => console.log("react", c.comment_id)}
                                />
                            ))}

                            <CommentInput
                                onSend={({ text, image }) => {
                                    // if (!text.trim()) return;
                                    setNewComment(text);
                                    setNewCommentImage(image);
                                    handleSendComment(text, image);
                                }}
                            />
                        </View>
                    </ScrollView>
                )}
            </ScrollView>
        </View>
    );
};

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
    choiceContent: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
    },
    countText: {
        fontSize: 16,
        fontWeight: "500",
        color: "#333",
    },
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
    replyContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: 10,
        paddingHorizontal: 10,
        paddingVertical: 6,
        backgroundColor: "#F1F3F5",
        borderRadius: 12,
    },
    replyInput: {
        flex: 1,
        paddingHorizontal: 12,
        paddingVertical: 8,
        backgroundColor: "#fff",
        borderRadius: 8,
        fontSize: 16,
    },
    sendIcon: { marginLeft: 8, padding: 6 },
    noCommentsText: {
        textAlign: "center",
        color: "#888",
        marginVertical: 10,
        fontSize: 16,
    },
    postDate: {
        fontSize: 14,
        color: "#888",
        fontWeight: "500",
    },
    topRightContainer: {
        position: "absolute",
        top: 20,
        right: 30,
        zIndex: 10,
    },
});

export default SinglePosts;
