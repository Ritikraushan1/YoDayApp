import React, { useState } from "react";
import {
    View,
    Text,
    Pressable,
    StyleSheet,
    Dimensions,
    ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Header from "../../components/Header";
import CommentCard from "../../components/CommentCard";

const { height } = Dimensions.get("window");

const SinglePosts = ({ navigation, route }) => {
    const [searchText, setSearchText] = useState("");
    const [likedPosts, setLikedPosts] = useState({});
    const [currentIndex, setCurrentIndex] = useState(0);
    const [showComments, setShowComments] = useState(false);
    const [comments, setComments] = useState([
        { id: "c1", author: "Alice", text: "Nice post!", replies: [] },
        { id: "c2", author: "Bob", text: "I agree with you", replies: [] },
    ]);

    const { post } = route.params;


    const posts = [
        { id: "1", content: "I had a nice day" },
        { id: "2", content: "Learning React Native is fun!" },
        { id: "3", content: "Tomorrow I will travel to Delhi" },
    ];

    const handleAnswer = (id, answer) => {
        setLikedPosts((prev) => ({
            ...prev,
            [id]: answer,
        }));
    };

    const handlePreviousPost = () => {
        if (currentIndex > 0) {
            setCurrentIndex((prev) => prev - 1);
        }
    };

    const handleLike = (id) => {
        console.log("Liked comment:", id);
    };

    const handleReply = (id, replyText) => {
        setComments((prev) =>
            prev.map((c) =>
                c.id === id
                    ? {
                        ...c,
                        replies: [
                            ...c.replies,
                            { id: Date.now().toString(), author: "You", text: replyText, replies: [] },
                        ],
                    }
                    : c
            )
        );
    };

    const handleReact = (id) => {
        console.log("Reacted on comment:", id);
    };
    const handleSearchClick = () => {
        navigation.navigate("SearchPosts")
    }

    const currentPost = post;
    const answer = likedPosts[post.id];

    return (
        <View style={{ flex: 1, backgroundColor: "transparent", height: '100%' }} >
            {/* Header */}
            <Header
                username="John Doe"
                avatar={null}
                searchText={searchText}
                onChangeSearch={(text) => setSearchText(text)}
                onClickOnSearch={handleSearchClick}
            />

            {/* Main Content */}
            {!showComments ? (
                // When comments are hidden → post takes full space
                <View style={styles.fullPostScreen}>
                    <Text style={styles.postText}>{currentPost.content}</Text>

                    <View style={styles.centerArea}>
                        <View style={styles.row}>
                            <Pressable
                                style={[styles.choiceButton, answer === "yes" && styles.selectedYes]}
                                onPress={() => handleAnswer(currentPost.id, "yes")}
                            >
                                <Text style={[styles.choiceText, answer === "yes" && styles.choiceTextSelected]}>Yes</Text>
                            </Pressable>

                            <Pressable
                                style={[styles.choiceButton, answer === "no" && styles.selectedNo]}
                                onPress={() => handleAnswer(currentPost.id, "no")}
                            >
                                <Text style={[styles.choiceText, answer === "no" && styles.choiceTextSelected]}>No</Text>
                            </Pressable>
                        </View>

                        {answer === "yes" && (
                            <Pressable style={styles.commentButton} onPress={() => setShowComments(true)}>
                                <Text style={styles.commentText}>Comments</Text>
                            </Pressable>
                        )}
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
                                    onPress={() => handleAnswer(currentPost.id, "yes")}
                                >
                                    <Text style={[styles.choiceText, answer === "yes" && styles.choiceTextSelected]}>Yes</Text>
                                </Pressable>

                                <Pressable
                                    style={[styles.choiceButton, answer === "no" && styles.selectedNo]}
                                    onPress={() => handleAnswer(currentPost.id, "no")}
                                >
                                    <Text style={[styles.choiceText, answer === "no" && styles.choiceTextSelected]}>No</Text>
                                </Pressable>
                            </View>

                            <Pressable style={styles.commentButton} onPress={() => setShowComments(false)}>
                                <Text style={styles.commentText}>Hide Comments</Text>
                            </Pressable>
                        </View>
                    </View>

                    {/* Comments Section */}
                    <View style={styles.commentSection}>
                        {comments.map((c) => (
                            <CommentCard
                                key={c.id}
                                comment={c}
                                onLike={handleLike}
                                onReply={handleReply}
                                onReact={handleReact}
                            />
                        ))}
                    </View>
                </ScrollView>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#F8F9FA" },

    fullPostScreen: {
        flex: 1,
        justifyContent: "space-between",
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
    bottomButton: {
        backgroundColor: "#E9ECEF",
        paddingVertical: 14,
        borderRadius: 12,
        alignItems: "center",
        marginTop: 20,
    },
    bottomButtonText: { fontSize: 16, fontWeight: "500", color: "#333" },
    buttonPressed: { opacity: 0.7 },
    commentSection: { marginTop: 10, paddingHorizontal: 12 },
});

export default SinglePosts;
