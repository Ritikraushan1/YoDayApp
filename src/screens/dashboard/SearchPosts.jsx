import React, { useState } from "react";
import {
    View,
    TextInput,
    FlatList,
    StyleSheet,
    ActivityIndicator,
    SafeAreaView,
    Text,
} from "react-native";
import PostCard from "../../components/PostCard";

const SearchPostsScreen = () => {
    const [query, setQuery] = useState("");
    const [loading, setLoading] = useState(false);
    const [results, setResults] = useState([]);
    const [answerMap, setAnswerMap] = useState({}); // store answers for posts

    const handleSearch = async () => {
        if (!query.trim()) return;
        setLoading(true);
        try {
            // replace with your API call
            // const response = await fetch(
            //     `https://your-api.com/search?query=${query}`
            // );
            const posts = [
                { id: "1", content: "I had a nice day" },
                { id: "2", content: "Learning React Native is fun!" },
                { id: "3", content: "Tomorrow I will travel to Delhi" },
                { id: "4", content: "Learning React Native is fun!" },
                { id: "5", content: "Tomorrow I will travel to Delhi" },
            ];
            // const data = await response.json();
            setResults(posts);
        } catch (error) {
            console.error("Search error:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleAnswer = (postId, answer) => {
        setAnswerMap((prev) => ({ ...prev, [postId]: answer }));
        // optionally send to API
    };

    return (
        <SafeAreaView style={styles.container}>
            {/* Header with Search Input */}
            <View style={styles.header}>
                <TextInput
                    style={styles.searchInput}
                    placeholder="Search posts..."
                    value={query}
                    onChangeText={setQuery}
                    onSubmitEditing={handleSearch}
                    returnKeyType="search"
                />
            </View>

            {/* Results */}
            {loading ? (
                <ActivityIndicator size="large" color="#007bff" style={{ marginTop: 20 }} />
            ) : results.length === 0 ? (
                <Text style={styles.emptyText}>No posts found</Text>
            ) : (
                <FlatList
                    data={results}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({ item }) => (
                        <PostCard
                            currentPost={item}
                            answer={answerMap[item.id]}
                            handleAnswer={handleAnswer}
                        />
                    )}
                    contentContainerStyle={styles.list}
                />
            )}
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#fff" },
    header: {
        padding: 12,
        borderBottomWidth: 1,
        borderBottomColor: "#ddd",
        backgroundColor: "#f9f9f9",
    },
    searchInput: {
        backgroundColor: "#fff",
        paddingVertical: 10,
        paddingHorizontal: 15,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: "#ccc",
        fontSize: 16,
    },
    list: { padding: 12 },
    emptyText: {
        textAlign: "center",
        marginTop: 20,
        color: "#777",
        fontSize: 16,
    },
});

export default SearchPostsScreen;
