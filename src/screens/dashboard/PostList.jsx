import React, { useState, useEffect } from "react";
import {
    View,
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
import { useSelector } from "react-redux";
import CustomDropDown from "../../components/CustomDropDown"; // assuming you have this component

const PostList = ({ navigation }) => {
    const user = useSelector(state => state.user.userInfo);

    const [loading, setLoading] = useState(false);
    const [posts, setPosts] = useState([]);
    const [filteredPosts, setFilteredPosts] = useState([]);
    const [filter, setFilter] = useState(""); // "Liked" or "Disliked"
    const [answerMap, setAnswerMap] = useState({});

    // Fetch all posts
    const getAllPosts = async () => {
        setLoading(true);
        try {
            const res = await PostService.getAllPosts();
            const postsWithUserReactions = (res?.data?.posts || []).map((post) => ({
                ...post,
                likedByUser: post.liked_by_you ?? false,
                dislikedByUser: post.disliked_by_you ?? false,
            }));
            setPosts(postsWithUserReactions);
            setFilteredPosts(postsWithUserReactions); // default: show all
        } catch (error) {
            console.error("Failed to fetch posts:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getAllPosts();
    }, []);

    // Filter posts when filter changes
    useEffect(() => {
        if (filter === "Liked") {
            setFilteredPosts(posts.filter(post => post.likedByUser));
        } else if (filter === "Disliked") {
            setFilteredPosts(posts.filter(post => post.dislikedByUser));
        } else {
            setFilteredPosts(posts);
        }
    }, [filter, posts]);

    // Handle Yes/No reactions
    const handleAnswer = async (postCode, type) => {
        try {
            const res = await PostService.reactPost(postCode, type);
            if (res.status === 200) {
                await getAllPosts();
            }
        } catch (error) {
            console.error("Failed to react to post", error);
        }
    };

    // Navigate to single post screen
    const onPressPostCard = (post) => {
        navigation.navigate("SinglePost", { post });
    };

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <Pressable onPress={() => navigation.goBack()}>
                    <BackIcon />
                </Pressable>
                <Text style={styles.headerText}>All Posts</Text>
            </View>

            {/* Filter Dropdown */}
            {/* <View style={styles.filterContainer}>
                <CustomDropDown
                    label="Filter"
                    placeholder="Select Filter"
                    value={filter}
                    dropDownItems={["", "Liked", "Disliked"]}
                    onSelect={setFilter}
                />
            </View> */}

            {/* Posts */}
            {loading ? (
                <ActivityIndicator size="large" color="#007bff" style={{ marginTop: 20 }} />
            ) : filteredPosts.length === 0 ? (
                <Text style={styles.emptyText}>No posts found</Text>
            ) : (
                <FlatList
                    data={filteredPosts}
                    keyExtractor={(item) => item.post_code.toString()}
                    renderItem={({ item }) => (
                        <PostCard
                            currentPost={item}
                            answer={answerMap[item.post_code]}
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
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    headerText: { fontSize: 18, fontWeight: '600', color: '#111' },
    filterContainer: {
        paddingHorizontal: 12,
        paddingVertical: 8,
        backgroundColor: "#f2f2f2",
    },
    list: { padding: 12 },
    emptyText: {
        textAlign: "center",
        marginTop: 20,
        color: "#777",
        fontSize: 16,
    },
});

export default PostList;
