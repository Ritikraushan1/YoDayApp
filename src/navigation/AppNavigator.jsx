import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from '../screens/auth_screens/login';
import UpdateProfileScreen from '../screens/auth_screens/update_profile';
import Init from '../screens/auth_screens/init';
import Posts from '../screens/dashboard/posts';
import SearchPostsScreen from '../screens/dashboard/SearchPosts';


const Stack = createNativeStackNavigator();

const AppNavigator = () => {
    return (
        <Stack.Navigator initialRouteName="InIt">
            <Stack.Screen
                name="InIt"
                component={Init}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="Login"
                component={LoginScreen}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="UpdateProfile"
                component={UpdateProfileScreen}
                options={{ title: 'Update Profile', headerShown: false }}
            />
            <Stack.Screen
                name="Posts"
                component={Posts}
                options={{ title: 'Feed', headerShown: false }}
            />
            <Stack.Screen
                name="SearchPosts"
                component={SearchPostsScreen}
                options={{ title: 'Search Posts', headerShown: false }}
            />
        </Stack.Navigator>
    );
};

export default AppNavigator;
