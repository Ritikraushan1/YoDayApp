import React, { useState, useEffect } from "react";
import {
    View,
    TextInput,
    FlatList,
    StyleSheet,
    ActivityIndicator,
    SafeAreaView,
    Text,
    Pressable,
} from "react-native";
import PostCard from "../../components/PostCard";
import { BackIcon } from "../../assets/icon/MenuIcons";
import { PostService } from "../../api/PostService";

const SearchPostsScreen = ({ navigation }) => {
    const [query, setQuery] = useState("");
    const [loading, setLoading] = useState(false);
    const [results, setResults] = useState([]);
    const [answerMap, setAnswerMap] = useState({});

    // 🔎 Fetch posts by query
    const getSearchedPosts = async (searchText) => {
        if (!searchText.trim()) {
            setResults([]);
            return;
        }
        setLoading(true);
        try {
            const res = await PostService.getPostBySearchQuery(searchText);
            setResults(res?.data?.posts || []);
        } catch (error) {
            console.error("Search error:", error);
        } finally {
            setLoading(false);
        }
    };

    // ⏳ Debounce: run search when user stops typing
    useEffect(() => {
        const delayDebounce = setTimeout(() => {
            if (query.trim()) {
                getSearchedPosts(query);
            } else {
                setResults([]);
            }
        }, 500); // wait 500ms after user stops typing

        return () => clearTimeout(delayDebounce); // cleanup
    }, [query]);

    const handleAnswer = async (postCode, type) => {
        try {
            const res = await PostService.reactPost(postCode, type);

            if (res.status === 200) {
                await getSearchedPosts(query)
            }
        } catch (error) {
            console.error("Failed to react to post", error);
        }
    };


    const onPressPostCard = (post) => {
        navigation.navigate("SinglePost", { post });
    };

    return (
        <SafeAreaView style={styles.container}>
            {/* Header with Search Input */}
            <View style={styles.header}>
                <Pressable onPress={() => navigation.goBack()}>
                    <BackIcon />
                </Pressable>
                <TextInput
                    style={styles.searchInput}
                    placeholder="Search posts..."
                    value={query}
                    onChangeText={setQuery}
                    returnKeyType="search"
                />
            </View>

            {/* Results */}
            {loading ? (
                <ActivityIndicator size="large" color="#007bff" style={{ marginTop: 20 }} />
            ) : results.length === 0 && query ? (
                <Text style={styles.emptyText}>No posts found</Text>
            ) : (
                <FlatList
                    data={results}
                    keyExtractor={(item) => item?.post_code?.toString()}
                    renderItem={({ item }) => (
                        <PostCard
                            currentPost={item}
                            answer={answerMap[item.id]}
                            handleAnswer={handleAnswer}
                            onPress={() => onPressPostCard(item)}
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
        flexDirection: "row",
        alignItems: "center",
    },
    searchInput: {
        backgroundColor: "#fff",
        paddingVertical: 10,
        paddingHorizontal: 15,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: "#ccc",
        fontSize: 16,
        width: "80%",
        marginLeft: "10%",
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
