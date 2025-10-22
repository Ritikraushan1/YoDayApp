import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from '../screens/auth_screens/login';
import UpdateProfileScreen from '../screens/auth_screens/update_profile';
import Init from '../screens/auth_screens/init';
import Posts from '../screens/dashboard/posts';
import SearchPostsScreen from '../screens/dashboard/SearchPosts';
import SinglePosts from '../screens/dashboard/SinglePost';
import Help from '../screens/settings/Help';
import Terms from '../screens/settings/Terms';
import About from '../screens/settings/About';
import Contact from '../screens/settings/Contact';
import Settings from '../screens/settings/Settings';
import submit_mobile from '../screens/auth_screens/submit_mobile';
import SubmitMobileScreen from '../screens/auth_screens/submit_mobile';
import SubmitOtpScreen from '../screens/auth_screens/submitOTP';
import PostList from '../screens/dashboard/PostList';


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
                name="SubmitMobile"
                component={SubmitMobileScreen}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="SubmitOTP"
                component={SubmitOtpScreen}
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
            <Stack.Screen
                name="PostList"
                component={PostList}
                options={{ title: 'Search Posts', headerShown: false }}
            />
            <Stack.Screen
                name="SinglePost"
                component={SinglePosts}
                options={{ title: 'Search Posts', headerShown: false }}
            />
            <Stack.Screen
                name="Help"
                component={Help}
                options={{ title: 'Help & Support', headerShown: false }}
            />
            <Stack.Screen
                name="Terms"
                component={Terms}
                options={{ title: 'Terms & Conditions', headerShown: false }}
            />
            <Stack.Screen
                name="About"
                component={About}
                options={{ title: 'About Us', headerShown: false }}
            />
            <Stack.Screen
                name="Contact"
                component={Contact}
                options={{ title: 'Contact Us', headerShown: false }}
            />
            <Stack.Screen
                name="Settings"
                component={Settings}
                options={{ title: 'Settings', headerShown: false }}
            />
        </Stack.Navigator>
    );
};

export default AppNavigator;
