import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";

const PostCard = ({ currentPost, answer, handleAnswer, onPress }) => {
    return (
        <Pressable style={styles.postScreen} onPress={onPress}>
            <Text style={styles.postText}>{currentPost.content}</Text>
            <View style={styles.centerArea}>
                <View style={styles.row}>
                    <Pressable
                        style={[
                            styles.choiceButton,
                            answer === "yes" && styles.selectedYes,
                        ]}
                        onPress={() => handleAnswer(currentPost.id, "yes")}
                    >
                        <Text
                            style={[
                                styles.choiceText,
                                answer === "yes" && styles.choiceTextSelected,
                            ]}
                        >
                            Yes
                        </Text>
                    </Pressable>

                    <Pressable
                        style={[
                            styles.choiceButton,
                            answer === "no" && styles.selectedNo,
                        ]}
                        onPress={() => handleAnswer(currentPost.id, "no")}
                    >
                        <Text
                            style={[
                                styles.choiceText,
                                answer === "no" && styles.choiceTextSelected,
                            ]}
                        >
                            No
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
    row: {
        flexDirection: "row",
        justifyContent: "center",
        gap: 40,
        marginVertical: 20,
    },
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
});

export default PostCard;
