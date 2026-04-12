import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import colors from "../styles/colors";

const PostCard = ({ currentPost, answer, handleAnswer, onPress, isLiked, isDisliked }) => {
    const {
        content,
        created_at,
        post_code,
        like_count,
        dislike_count,
        liked_by_you,
        disliked_by_you,
    } = currentPost;

    const formattedDate = new Date(created_at).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
    });


    // ✅ Format count - hide if 0
    const formatCount = (count) => {
        return count > 0 ? ` (${count})` : "";
    };

    return (
        <Pressable style={styles.postScreen} onPress={onPress}>
            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.meta}>
                    {formattedDate}
                </Text>
            </View>

            {/* Content */}
            <Text style={styles.postText}>{content}</Text>

            {/* Yes/No Area with counts */}
            <View style={styles.centerArea}>
                <View style={styles.row}>
                    <Pressable
                        style={[
                            styles.choiceButton,
                            isLiked && styles.selectedYes,
                        ]}
                        onPress={() => handleAnswer(currentPost.post_code, "like")}
                    >
                        <Text
                            style={[
                                styles.choiceText,
                                isLiked && styles.choiceTextSelected,
                            ]}
                        >
                            👍 YES{formatCount(like_count)}
                        </Text>
                    </Pressable>

                    <Pressable
                        style={[
                            styles.choiceButton,
                            isDisliked && styles.selectedNo,
                        ]}
                        onPress={() => handleAnswer(currentPost.post_code, "dislike")}
                    >
                        <Text
                            style={[
                                styles.choiceText,
                                isDisliked && styles.choiceTextSelected,
                            ]}
                        >
                            👎 NO{formatCount(dislike_count)}
                        </Text>
                    </Pressable>
                </View>
            </View>
        </Pressable>
    );
};

const styles = StyleSheet.create({
    postScreen: {
        padding: 20,
        backgroundColor: "#fff",
        borderRadius: 20,
        margin: 12,
        shadowColor: "#000",
        shadowOpacity: 0.08,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 4 },
        elevation: 3,
    },
    header: {
        marginBottom: 8,
        alignItems: "center",
    },
    meta: {
        fontSize: 12,
        color: "#777",
    },
    postText: {
        fontSize: 20,
        fontWeight: "500",
        color: "#333",
        textAlign: "center",
        marginTop: 10,
    },
    centerArea: { alignItems: "center", marginTop: 15 },
    row: {
        flexDirection: "row",
        justifyContent: "center",
        gap: 40,
        marginVertical: 20,
    },
    choiceButton: {
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 10,
        borderWidth: 1.5,
        borderColor: colors.box_border_color,
        minWidth: 120,
        alignItems: "center",
        backgroundColor: "transparent", // ✅ No background by default
    },
    choiceText: { fontSize: 16, color: "#444" },
    selectedYes: {
        backgroundColor: "#d4edda",
        borderColor: "#28a745"
    },
    selectedNo: {
        backgroundColor: "#f8d7da",
        borderColor: "#7030A0"
    },
    choiceTextSelected: { fontWeight: "600" },
});

export default PostCard;