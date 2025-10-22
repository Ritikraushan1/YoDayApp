import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    userInfo: null, // stores user profile data
    isLoggedIn: false,
    loading: false,
    error: null,
};

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setUserInfo: (state, action) => {
            state.userInfo = action.payload;
            state.isLoggedIn = true;
            state.error = null;
        },
        updateUserInfo: (state, action) => {
            state.userInfo = { ...state.userInfo, ...action.payload };
        },
        clearUserInfo: (state) => {
            state.userInfo = null;
            state.isLoggedIn = false;
            state.error = null;
        },
        setLoading: (state, action) => {
            state.loading = action.payload;
        },
        setError: (state, action) => {
            state.error = action.payload;
        },
    },
});

export const { setUserInfo, updateUserInfo, clearUserInfo, setLoading, setError } = userSlice.actions;

export default userSlice.reducer;
