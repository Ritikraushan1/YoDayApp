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
import { useDispatch, useSelector } from "react-redux";
import { setSearchResults, updatePostReaction } from "../../redux/slices/postsSlice";

const SearchPostsScreen = ({ navigation }) => {
    const [query, setQuery] = useState("");
    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch();
    const results = useSelector((state) => state.posts.searchResults);

    // 🔎 Fetch posts by query
    const getSearchedPosts = async (searchText) => {
        if (!searchText.trim()) {
            dispatch(setSearchResults([]));
            return;
        }
        setLoading(true);
        try {
            const res = await PostService.getPostBySearchQuery(searchText);

            const postsWithReactions = (res?.data?.posts || []).map(post => ({
                ...post,
                likedByUser: post.liked_by_you ?? false,
                dislikedByUser: post.disliked_by_you ?? false,
            }));

            dispatch(setSearchResults(postsWithReactions));
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
                dispatch(setSearchResults([]));
            }
        }, 500); // wait 500ms after user stops typing

        return () => clearTimeout(delayDebounce); // cleanup
    }, [query]);

    const handleAnswer = async (postCode, type) => {
        try {
            const targetPost = results.find(p => p.post_code === postCode);
            if (!targetPost) return;

            // ✅ Decide API
            if (type === "like") {
                if (targetPost.likedByUser) {
                    await PostService.removeReactionOnPost(postCode, "like");
                } else {
                    await PostService.reactPost(postCode, "like");
                }
            } else if (type === "dislike") {
                if (targetPost.dislikedByUser) {
                    await PostService.removeReactionOnPost(postCode, "dislike");
                } else {
                    await PostService.reactPost(postCode, "dislike");
                }
            }

            // ✅ Dispatch to Redux (handles optimistic update globally)
            dispatch(updatePostReaction({
                postCode,
                type,
                isLiked: type === "like" && !targetPost.likedByUser,
                isDisliked: type === "dislike" && !targetPost.dislikedByUser
            }));

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
                            answer={
                                item.likedByUser
                                    ? "yes"
                                    : item.dislikedByUser
                                        ? "no"
                                        : null
                            }
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