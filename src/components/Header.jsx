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
} from 'react-native';
import SearchIcon from '../assets/icon/SearchIcon';
import SideMenu from './SideMenu';

const { width: screenWidth } = Dimensions.get('window');

const Header = ({
    username = '',
    avatar = null,
    searchText = '',
    onChangeSearch,
    onClickOnSearch,
    onRetry = () => { },      // callback when retry is pressed
    noInternet = false,      // ✅ now comes from props
}) => {
    const [searchVisible, setSearchVisible] = useState(false);
    const [drawerVisible, setDrawerVisible] = useState(false);
    const drawerAnim = useRef(new Animated.Value(-screenWidth)).current;

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
            {/* Header row */}
            <View style={styles.container}>
                {/* Avatar / Logo */}
                <TouchableOpacity onPress={openDrawer}>
                    <Image source={require('../assets/logo.png')} style={styles.avatar} />
                </TouchableOpacity>

                {/* Username */}
                <Text style={styles.username}>YoDay</Text>

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
                <TouchableOpacity onPress={onClickOnSearch}>
                    <SearchIcon color="#fff" />
                </TouchableOpacity>
            </View>

            {/* 🚫 No Internet Banner */}
            {noInternet && (
                <View style={styles.noInternetRow}>
                    <Text style={styles.noInternetText}>No Internet Connection</Text>
                    <TouchableOpacity
                        style={styles.retryButton}
                        onPress={onRetry}
                    >
                        <Text style={styles.retryText}>Retry</Text>
                    </TouchableOpacity>
                </View>
            )}

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
        backgroundColor: '#7030A0',
        zIndex: 10,
        elevation: 4,
    },
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 14,
        paddingVertical: 12,
        minHeight: 56,
    },
    avatar: {
        width: 42,
        height: 42,
        borderRadius: 21,
        marginRight: 10,
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
    /* 🚫 No Internet Styles */
    noInternetRow: {
        backgroundColor: '#E74C3C',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 14,
        paddingVertical: 8,
    },
    noInternetText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '500',
    },
    retryButton: {
        backgroundColor: '#fff',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 6,
    },
    retryText: {
        color: '#E74C3C',
        fontWeight: '600',
        fontSize: 14,
    },
});
