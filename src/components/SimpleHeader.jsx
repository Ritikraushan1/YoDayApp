import React, { useState, useRef } from 'react';
import {
    View,
    Text,
    Image,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Animated,
    Dimensions,
    StatusBar,
    Platform
} from 'react-native';
import SearchIcon from '../assets/icon/SearchIcon';
import SideMenu from './SideMenu';
import { BackIcon } from '../assets/icon/MenuIcons';

const { width: screenWidth } = Dimensions.get('window');

const SimpleHeader = ({ title, onBack }) => {


    return (
        <View style={styles.wrapper}>
            {/* Status bar control */}
            {/* <StatusBar
                barStyle="light-content"
                backgroundColor="#4267B2"
                translucent={false} // important: keep safe area working from App.jsx
            /> */}

            {/* Header row */}
            <View style={styles.container}>
                {/* Avatar */}
                <TouchableOpacity onPress={onBack}>
                    <BackIcon color='#fff' />
                </TouchableOpacity>

                {/* Username */}
                <Text style={styles.username}>{title}</Text>

            </View>
        </View>
    );
};

export default SimpleHeader;

const styles = StyleSheet.create({
    wrapper: {
        backgroundColor: '#4267B2',
        zIndex: 10,
        elevation: 4,
    },
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 14,
        paddingVertical: 12,
        minHeight: 56, // consistent toolbar height
    },
    avatar: {
        width: 42,
        height: 42,
        borderRadius: 21,
        marginRight: 10,
        borderWidth: 2,
        borderColor: '#fff',
    },
    avatarFallback: {
        width: 42,
        height: 42,
        borderRadius: 21,
        backgroundColor: '#FFF',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 10,
        borderWidth: 2,
        borderColor: '#fff',
    },
    initials: {
        fontWeight: 'bold',
        fontSize: 16,
        color: '#4267B2',
    },
    username: {
        fontSize: 18,
        fontWeight: '600',
        color: '#FFF',
        marginLeft: 12
    },
    searchInput: {
        flex: 1,
        borderBottomWidth: 1,
        borderColor: '#fff',
        marginRight: 8,
        paddingVertical: 4,
        paddingHorizontal: 6,
        fontSize: 14,
        color: '#fff',
    },
});
