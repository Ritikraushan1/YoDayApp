import { configureStore } from '@reduxjs/toolkit';
import { combineReducers } from 'redux';
import userReducer from './slices/userSlice';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { persistStore, persistReducer } from 'redux-persist';

// 1️⃣ Configure persist
const persistConfig = {
    key: 'root',            // storage key
    storage: AsyncStorage,  // use AsyncStorage in React Native
    whitelist: ['user'],    // which slice(s) to persist
};

// 2️⃣ Combine reducers (in case you have more slices)
const rootReducer = combineReducers({
    user: userReducer,
});

// 3️⃣ Wrap reducer with persistReducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// 4️⃣ Create store
export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false, // required for redux-persist
        }),
});

export const persistor = persistStore(store);

export default store;
