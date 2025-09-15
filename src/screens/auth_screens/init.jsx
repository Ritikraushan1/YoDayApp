import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect } from 'react';
import { saveUserSession } from '../../api/UserService';
import { setUserInfo } from '../../redux/slices/userSlice';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { UserService } from '../../api/UserService'; // make sure this path is correct
import { AuthService } from '../../api/AuthService';

const Init = ({ navigation }) => {

    const handleRefreshToken = async (storedUser, navigation, dispatch) => {
        try {
            const { id, token, profile } = storedUser;

            const res = await UserService.getRefreshToken(token);
            console.log("Refresh response:", res.data);

            if (res.data.login_again) {
                // Token invalid → force login
                navigation.replace("Login");
            } else {
                // Token refreshed → update AsyncStorage & session
                const newToken = res.data.token;
                const newExpiry = Date.now() + 5 * 24 * 60 * 60 * 1000; // 5 days from now

                const updatedUser = { id, token: newToken, expiry: newExpiry, profile };
                await AsyncStorage.setItem("yodayuser", JSON.stringify(updatedUser));

                // Save session (optional redux or API call)
                saveUserSession(id, newToken, profile);

                // Update redux store
                dispatch(setUserInfo(profile));

                // Continue navigation (example)
                navigation.replace(profile?.name ? "Posts" : "UpdateProfile", {
                    id,
                    token: newToken,
                });
            }
        } catch (err) {
            console.log("Error refreshing token:", err);
            navigation.replace("Login"); // fallback
        }
    };
    useEffect(() => {
        const checkUserSession = async () => {
            try {
                const storedUserStr = await AsyncStorage.getItem("yodayuser");

                if (!storedUserStr) {
                    // No user session → go to login
                    navigation.replace("Login");
                    return;
                }

                const storedUser = JSON.parse(storedUserStr);
                const now = Date.now();

                const user = await UserService.getUserInformation();

                if (!storedUser.expiry) {
                    navigation.replace("Login");
                }

                if (now >= storedUser.expiry) {
                    // Token expired → force login
                    navigation.replace("Login");
                } else if (storedUser.expiry - now <= 24 * 60 * 60 * 1000) {
                    // Token near expiry → refresh
                    await handleRefreshToken(storedUser, navigation, dispatch);
                } else {
                    // Token valid → continue
                    navigation.replace(user.profile?.name ? "Posts" : "UpdateProfile", {
                        id: storedUser.id,
                        token: storedUser.token,
                    });
                }
            } catch (err) {
                console.log("Error in Init check:", err);
                navigation.replace("Login");
            }
        };

        checkUserSession();
    }, [navigation]);

    return (
        <View style={styles.container}>
            <ActivityIndicator size="large" color="#007AFF" />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default Init;
