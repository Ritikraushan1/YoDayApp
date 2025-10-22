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

const { width: screenWidth } = Dimensions.get('window');

const Header = ({ username = '', avatar = null, searchText = '', onChangeSearch, onClickOnSearch }) => {
    const [searchVisible, setSearchVisible] = useState(false);
    const [drawerVisible, setDrawerVisible] = useState(false);
    const drawerAnim = useRef(new Animated.Value(-screenWidth)).current;

    const getInitials = () => username.slice(0, 2).toUpperCase();

    const openDrawer = () => {
        setDrawerVisible(true);
        Animated.timing(drawerAnim, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
        }).start();
    };

    const handleMenuOption = (option) => {
        console.log(`${option} selected`);
        setDrawerVisible(false);
    };

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
                <TouchableOpacity onPress={openDrawer}>
                    <Image source={require('../assets/logo.png')} style={styles.avatar} />
                </TouchableOpacity>

                {/* Username */}
                <Text style={styles.username}>{username}</Text>

                <View style={{ flex: 1 }} />

                {/* Search input */}
                {searchVisible && (
                    <TextInput
                        value={searchText}
                        onChangeText={onChangeSearch}
                        placeholder="Search..."
                        placeholderTextColor="#eee"
                        style={styles.searchInput}
                        autoFocus
                    />
                )}

                {/* Search icon */}
                <TouchableOpacity onPress={() => onClickOnSearch()}>
                    <SearchIcon color="#fff" />
                </TouchableOpacity>
            </View>

            {/* Drawer menu */}
            <SideMenu
                visible={drawerVisible}
                onClose={() => setDrawerVisible(false)}
                onSelectOption={handleMenuOption}
            />
        </View>
    );
};

export default Header;

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
        // borderWidth: 2,
        // borderColor: '#fff',
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
