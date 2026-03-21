import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    Pressable,
    StyleSheet,
    Dimensions,
    ScrollView,
    Platform,
    PermissionsAndroid,
    Alert,
    TextInput,
    BackHandler,
    RefreshControl,
    KeyboardAvoidingView,
    Linking
} from "react-native";
import { useNavigationState } from "@react-navigation/native";
import Header from "../../components/Header";
import CommentCard from "../../components/CommentCard";
import AlertModal from "../../components/AlertModal";
import { PostService } from "../../api/PostService";
import { useSelector } from "react-redux";
import { CommentsService } from "../../api/CommentService";
import { useFocusEffect } from "@react-navigation/native";
import DesignedLoader from "../../components/DesignedLoader";
import { launchImageLibrary } from "react-native-image-picker";
import { UploadService } from "../../api/UploadService";
import { PERMISSIONS, RESULTS, request, check } from 'react-native-permissions';
import CommentInput from "../../components/CommentInput";
import NetInfo from "@react-native-community/netinfo";
import colors from "../../styles/colors";


const { height } = Dimensions.get("window");

const Posts = ({ navigation }) => {
    const user = useSelector(state => state.user.userInfo);
    const isNavigationReady = useNavigationState(state => !!state);
    console.log("user", user);
    const [isLoading, setIsLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const [searchText, setSearchText] = useState("");
    const [likedPosts, setLikedPosts] = useState({});
    const [currentIndex, setCurrentIndex] = useState(0);
    const [showComments, setShowComments] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [currentPost, setCurrentPost] = useState(null);
    const [likeCount, setLikeCount] = useState(0);
    const [dislikeCount, setDislikedCount] = useState(0);
    const [newComment, setNewComment] = useState("");
    const [newCommentImage, setNewCommentImage] = useState(null);
    const [customAlert, setCustomAlert] = useState({
        visible: false,
        message: "",
        onOk: null,
        onCancel: null,
        showCancel: true,
    });
    const [comments, setComments] = useState([]);
    const [posts, setPosts] = useState([]);
    const [isConnected, setIsConnected] = useState(true);

    useEffect(() => {
        const unsubscribe = NetInfo.addEventListener(state => {
            console.log("internet connected", state.isConnected);

            setIsConnected(state.isConnected && state.isInternetReachable !== false);
        });
        return () => unsubscribe();
    }, []);
    useEffect(() => {
        if (!user) {
            const timeout = setTimeout(() => {
                navigation.replace("Login");
            }, 100);
            return () => clearTimeout(timeout);
        } else {
            getAllPosts();
        }
    }, [user]);

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



    useEffect(() => {
        if (posts.length > 0 && currentIndex < posts.length) {
            const updatedPost = posts[currentIndex];
            setCurrentPost(updatedPost);
            setLikeCount(updatedPost.like_count ?? 0);
            setDislikedCount(updatedPost.dislike_count ?? 0);
        } else {
            setCurrentPost(null);
            setLikeCount(0);
            setDislikedCount(0);
        }
    }, [posts, currentIndex]);

    useFocusEffect(
        React.useCallback(() => {
            const onBackPress = () => handleBackNavigation();

            const subscription = BackHandler.addEventListener("hardwareBackPress", onBackPress);

            return () => subscription.remove(); // ✅ Use remove() from subscription
        }, [showComments])
    );



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

        // Format as "23-Sep"
        const options = { day: "2-digit", month: "short" };
        return postDate.toLocaleDateString("en-US", options);
    };

    const handleBackNavigation = () => {
        if (showComments) {
            setShowComments(false);
            return true; // prevent default back action
        } else {
            setCustomAlert({
                visible: true,
                message: "Are you sure you want to exit?",
                showCancel: true,
                onOk: () => BackHandler.exitApp(),
                onCancel: () => setCustomAlert(prev => ({ ...prev, visible: false })),
            });
            return true; // prevent default back action
        }
    };




    const getAllPosts = async () => {
        setIsLoading(true);
        try {
            const res = await PostService.getAllPosts();
            const postsWithUserReactions = (res?.data?.posts || []).map((post) => ({
                ...post,
                likedByUser: post.liked_by_you ?? false,
                dislikedByUser: post.disliked_by_you ?? false,
            }));
            setPosts(postsWithUserReactions);
            setCurrentIndex(0); // reset to first post
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false); // hide loader
        }
    };
    const getCommentsForPost = async () => {
        if (!currentPost?.post_code) return;
        try {
            const res = await CommentsService.getAllCommentsForPosts(currentPost.post_code);
            setComments(res?.data?.comments || []);
        } catch (err) {
            console.error("Failed to load comments:", err);
            setComments([]);
        }
    };

    const handleRefresh = async () => {
        setRefreshing(true);
        try {
            await getAllPosts(); // re-fetch posts
        } catch (err) {
            console.error("Failed to refresh posts", err);
        } finally {
            setRefreshing(false);
        }
    };


    const handleSendComment = async (text, image) => {

        try {
            const res = await CommentsService.addNewComments(currentPost.post_code, text, image);
            console.log("res after adding comments", res.data);

            if (res?.status === 200) {
                setComments((prev) => [
                    ...prev,
                    {
                        id: res.data.comment.comment_id,
                        username: user.name,
                        text: text,
                        image_url: image,
                        replies: [],
                    },
                ]);
                setNewComment(""); // clear input
            }
        } catch (err) {
            console.error("Failed to post comment", err);
        }
    };

    const handleAnswer = async (postCode, type) => {
        try {
            const res = await PostService.reactPost(postCode, type);

            if (res.status === 200) {
                setPosts((prevPosts) => {
                    const updatedPosts = prevPosts.map((post) => {
                        if (post.post_code !== postCode) return post;

                        const updatedPost = { ...post };

                        if (type === "like") {
                            if (post.likedByUser) {
                                // undo like
                                updatedPost.likedByUser = false;
                                updatedPost.like_count = Math.max(0, (post.like_count ?? 0) - 1);
                            } else {
                                // add like (and remove dislike if present)
                                updatedPost.likedByUser = true;
                                updatedPost.like_count = (post.like_count ?? 0) + 1;
                                if (post.dislikedByUser) {
                                    updatedPost.dislikedByUser = false;
                                    updatedPost.dislike_count = Math.max(0, (post.dislike_count ?? 0) - 1);
                                }
                            }
                        } else if (type === "dislike") {
                            if (post.dislikedByUser) {
                                // undo dislike
                                updatedPost.dislikedByUser = false;
                                updatedPost.dislike_count = Math.max(0, (post.dislike_count ?? 0) - 1);
                            } else {
                                // add dislike (and remove like if present)
                                updatedPost.dislikedByUser = true;
                                updatedPost.dislike_count = (post.dislike_count ?? 0) + 1;
                                if (post.likedByUser) {
                                    updatedPost.likedByUser = false;
                                    updatedPost.like_count = Math.max(0, (post.like_count ?? 0) - 1);
                                }
                            }
                        }

                        return updatedPost;
                    });

                    // Re-sync currentPost with updatedPosts
                    const updatedCurrent = updatedPosts.find(p => p.post_code === currentPost?.post_code) || null;
                    setCurrentPost(updatedCurrent);

                    // If the user just removed their reaction (no likedByUser & no dislikedByUser) while comments were visible,
                    // hide comments and clear comments list (this returns to initial mode)
                    if (showComments && updatedCurrent && !updatedCurrent.likedByUser && !updatedCurrent.dislikedByUser) {
                        setShowComments(false);
                        setComments([]);
                    }

                    // If the user just added a reaction and comments are not visible, keep comments hidden
                    // (Comments button will be visible from render when answer exists)
                    // If the user toggles reaction while not viewing comments, nothing else needed.

                    // Also update like/dislike counts shown in UI
                    if (updatedCurrent) {
                        setLikeCount(updatedCurrent.like_count ?? 0);
                        setDislikedCount(updatedCurrent.dislike_count ?? 0);
                    }

                    return updatedPosts;
                });
            }
        } catch (error) {
            console.error("Failed to react to post", error);
        }
    };

    const handlePreviousPost = () => {
        navigation.navigate("PostList");
        if (currentIndex < posts.length - 1) {

            setCurrentIndex((prev) => prev + 1);
        } else {
            // Show custom alert modal instead of native alert
            setCustomAlert({
                visible: true,
                message: "No more previous posts left",
                showCancel: false,
                onOk: () => setCustomAlert(prev => ({ ...prev, visible: false })),
                onCancel: null,
            });
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
                    if (permissionResult !== RESULTS.GRANTED) {
                        alert("Storage access is required to attach images.");
                        return;
                    }
                }
            } else if (Platform.OS === "ios") {
                const permission = PERMISSIONS.IOS.PHOTO_LIBRARY;
                permissionResult = await check(permission);

                if (permissionResult === RESULTS.DENIED) {
                    permissionResult = await request(permission);
                }

                if (permissionResult === RESULTS.BLOCKED || permissionResult === RESULTS.UNAVAILABLE) {
                    // Show alert explaining why access is needed ONLY if truly blocked
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

    const handleSearchClick = () => {
        navigation.navigate("SearchPosts")
    }
    const handleRetryConnection = async () => {
        const state = await NetInfo.fetch();
        setIsConnected(state.isConnected && state.isInternetReachable !== false);

        if (state.isConnected) {
            getAllPosts(); // ✅ Retry fetching posts if back online
        }
    };

    const answer = currentPost
        ? currentPost.likedByUser
            ? "yes"
            : currentPost.dislikedByUser
                ? "no"
                : null
        : null;

    return (
        <KeyboardAvoidingView style={{ flex: 1 }}
            behavior={Platform.OS === "ios" ? "padding" : 'height'}>
            <View style={{ flex: 1, backgroundColor: "transparent", height: '100%' }} >
                {/* Header */}


                <Header
                    username={user?.name}
                    avatar={user?.avatar}
                    searchText={searchText}
                    onChangeSearch={(text) => setSearchText(text)}
                    onClickOnSearch={handleSearchClick}
                    noInternet={!isConnected}          // ✅ Pass as prop
                    onRetry={handleRetryConnection}
                />
                {/* <DesignedLoader visible={isLoading} text="Loading posts..." /> */}
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
                    {/* Main Content */}
                    {(!showComments) ? (
                        // When comments are hidden → post takes full space
                        <View style={styles.fullPostScreen}>
                            {/* Post Date at Top-Right */}
                            <View style={styles.topRightContainer}>
                                <Text style={styles.postDate}>{formatPostDate(currentPost?.created_at)}</Text>
                            </View>

                            {/* Main Content (Centered) */}
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
                                                {answer && <Text style={styles.countText}>{likeCount}</Text>}
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
                                                {answer && <Text style={styles.countText}>{dislikeCount}</Text>}
                                            </View>
                                        </Pressable>
                                    </View>

                                    {answer && (
                                        <Pressable style={styles.commentButton} onPress={async () => {
                                            setShowComments(true);
                                            await getCommentsForPost();  // ✅ Fetch comments here
                                        }}>
                                            <Text style={styles.commentText}>Comments</Text>
                                        </Pressable>
                                    )}
                                </View>
                            </View>

                            {/* Bottom Buttons */}
                            {/* Bottom Button - Full Width */}
                            <View style={{ paddingHorizontal: 12, marginTop: 20 }}>
                                <Pressable
                                    style={[
                                        styles.bottomButton,
                                        { width: '100%' }, // make it full width
                                        currentIndex >= posts.length - 1 && styles.bottomButtonDisabled,
                                    ]}
                                    onPress={handlePreviousPost}
                                    disabled={currentIndex >= posts.length - 1}
                                >
                                    <Text
                                        style={[
                                            styles.bottomButtonText,
                                            currentIndex >= posts.length - 1 && styles.bottomButtonTextDisabled,
                                        ]}
                                    >
                                        Previous posts
                                    </Text>
                                </Pressable>
                            </View>

                        </View>
                    ) : (
                        // When comments are shown → scrollable layout with comments
                        <ScrollView contentContainerStyle={{ paddingBottom: 30 }}>
                            <View style={styles.postScreen}>
                                <Text style={styles.postText}>{currentPost.content}</Text>

                                <View style={styles.centerArea}>
                                    <View style={styles.row}>
                                        <Pressable
                                            style={[styles.choiceButton, answer === "yes" && styles.selectedYes]}
                                            onPress={() => handleAnswer(currentPost.post_code, "like")}
                                        >
                                            <Text style={[styles.choiceText, answer === "yes" && styles.choiceTextSelected]}>Yes</Text>
                                            {answer && (
                                                <Text style={styles.countText}>
                                                    {likeCount}
                                                </Text>
                                            )}
                                        </Pressable>

                                        <Pressable
                                            style={[styles.choiceButton, answer === "no" && styles.selectedNo]}
                                            onPress={() => handleAnswer(currentPost.post_code, "dislike")}
                                        >
                                            <Text style={[styles.choiceText, answer === "no" && styles.choiceTextSelected]}>No</Text>
                                            {answer && (
                                                <Text style={styles.countText}>
                                                    {dislikeCount}
                                                </Text>
                                            )}
                                        </Pressable>
                                    </View>

                                    <Pressable style={styles.commentButton} onPress={() => {
                                        setComments([]);
                                        setShowComments(false)
                                    }}>
                                        <Text style={styles.commentText}>Hide Comments</Text>
                                    </Pressable>
                                </View>
                            </View>

                            {/* Comments Section */}
                            <View style={styles.commentSection}>
                                {/* Show placeholder if no comments */}
                                {comments.length === 0 ? (
                                    <Text style={styles.noCommentsText}>No comments yet. Be the first to comment!</Text>
                                ) : (
                                    comments.map((c) => (
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
                                    ))
                                )}
                                {/* New comment input */}
                                <CommentInput
                                    onSend={({ text, image }) => {
                                        setNewComment(text);
                                        setNewCommentImage(image);
                                        handleSendComment(text, image);
                                    }}
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
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#F8F9FA" },

    fullPostScreen: {
        flex: 1,
        justifyContent: "space-between", // top date, center content, bottom buttons
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
    attachIcon: {
        marginLeft: 8,
        padding: 6,
    },
    sendIcon: {
        marginLeft: 8,
        padding: 6,
    },
    noCommentsText: {
        textAlign: "center",
        color: "#888",
        marginVertical: 10,
        fontSize: 16,
    },


    centerArea: { alignItems: "center", marginTop: 15 },
    row: { flexDirection: "row", justifyContent: "center", gap: 40, marginVertical: 20 },
    choiceButton: {
        paddingVertical: 10,
        paddingHorizontal: 28,
        borderRadius: 10,
        borderWidth: 1.5,
        borderColor: colors.box_border_color,
    },
    choiceText: { fontSize: 18, color: "#444" },
    choiceContent: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8, // space between text and count
    },
    countText: {
        fontSize: 16,
        fontWeight: "500",
        color: "#333",
    },
    bottomButtonsContainer: {
        flexDirection: "row",
        // justifyContent: "space-between",
        marginTop: 20,
        paddingHorizontal: 20,
    },


    selectedYes: { backgroundColor: "#d4edda", borderColor: "#28a745" },
    selectedNo: { backgroundColor: "#f8d7da", borderColor: "#7030A0" },
    choiceTextSelected: { fontWeight: "600" },
    commentButton: {
        backgroundColor: "#E9ECEF",
        paddingVertical: 12,
        paddingHorizontal: 40,
        borderRadius: 10,
        marginTop: 10,
    },
    commentText: { fontSize: 16, fontWeight: "500", color: "#333" },
    bottomButton: {
        backgroundColor: "#E9ECEF",
        paddingVertical: 14,
        borderRadius: 12,
        alignItems: "center",
        marginTop: 20,
        paddingHorizontal: 10
    },
    bottomButtonText: { fontSize: 16, fontWeight: "500", color: "#333" },
    buttonPressed: { opacity: 0.7 },
    commentSection: { marginTop: 10, paddingHorizontal: 12 },
    bottomButtonDisabled: {
        backgroundColor: "#E0E0E0", // gray background for disabled
    },
    bottomButtonTextDisabled: {
        color: "#888", // gray text for disabled
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
    bottomButtonsContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 20,
        paddingHorizontal: 20,
    },
});

export default Posts;