import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';

const Init = ({ navigation }) => {
    useEffect(() => {
        const checkSomething = async () => {
            // Simulate a loading delay or async check
            await new Promise(resolve => setTimeout(resolve, 1500));

            // Example condition: hardcoded for now
            const isLoggedIn = false; // Change this to true to test
            const res = await AsyncStorage.getItem('yodayuser');
            console.log("res when opening app", res);


            if (res !== null || res !== undefined) {
                navigation.replace('Posts'); // Replace so user can't go back
            } else {
                navigation.replace('Login');
            }
        };

        checkSomething();
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
