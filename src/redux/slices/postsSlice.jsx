import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    posts: [], // List of posts from main feed
    searchResults: [], // List of posts from search
    loading: false,
    error: null,
};

const postsSlice = createSlice({
    name: 'posts',
    initialState,
    reducers: {
        setPosts: (state, action) => {
            state.posts = action.payload;
        },
        setSearchResults: (state, action) => {
            state.searchResults = action.payload;
        },
        updatePostReaction: (state, action) => {
            const { postCode, type, isLiked, isDisliked } = action.payload;

            const updateItem = (item) => {
                if (item.post_code !== postCode) return item;

                const updated = { ...item };
                
                // Logic to update counts and flags
                if (type === 'like') {
                    if (isLiked) {
                        // Add like
                        updated.likedByUser = true;
                        updated.like_count = (item.like_count ?? 0) + 1;
                        if (item.dislikedByUser) {
                            updated.dislikedByUser = false;
                            updated.dislike_count = Math.max(0, (item.dislike_count ?? 0) - 1);
                        }
                    } else {
                        // Remove like
                        updated.likedByUser = false;
                        updated.like_count = Math.max(0, (item.like_count ?? 0) - 1);
                    }
                } else if (type === 'dislike') {
                    if (isDisliked) {
                        // Add dislike
                        updated.dislikedByUser = true;
                        updated.dislike_count = (item.dislike_count ?? 0) + 1;
                        if (item.likedByUser) {
                            updated.likedByUser = false;
                            updated.like_count = Math.max(0, (item.like_count ?? 0) - 1);
                        }
                    } else {
                        // Remove dislike
                        updated.dislikedByUser = false;
                        updated.dislike_count = Math.max(0, (item.dislike_count ?? 0) - 1);
                    }
                }

                return updated;
            };

            state.posts = state.posts.map(updateItem);
            state.searchResults = state.searchResults.map(updateItem);
        },
        setLoading: (state, action) => {
            state.loading = action.payload;
        },
        setError: (state, action) => {
            state.error = action.payload;
        },
    },
});

export const { setPosts, setSearchResults, updatePostReaction, setLoading, setError } = postsSlice.actions;

export default postsSlice.reducer;
