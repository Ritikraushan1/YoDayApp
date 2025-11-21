// components/SideMenu.js

import React, { useRef, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Animated,
    Dimensions,
    TouchableOpacity,
    TouchableWithoutFeedback,
    Image,
} from 'react-native';
import DeviceInfo from 'react-native-device-info';
import { IconMap } from '../assets/icon/MenuIcons';
import { useNavigation } from '@react-navigation/native';
import AlertModal from './AlertModal';
import { useSelector } from 'react-redux';

const version = DeviceInfo.getVersion();
const buildNumber = DeviceInfo.getBuildNumber();

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const SideMenu = ({ visible, onClose, onSelectOption }) => {
    const user = useSelector(state => state.user.userInfo);
    const navigation = useNavigation()
    const drawerAnim = useRef(new Animated.Value(-screenWidth)).current;

    useEffect(() => {
        if (visible) {
            Animated.timing(drawerAnim, {
                toValue: 0,
                duration: 300,
                useNativeDriver: true,
            }).start();
        } else {
            Animated.timing(drawerAnim, {
                toValue: -screenWidth,
                duration: 300,
                useNativeDriver: true,
            }).start();
        }
    }, [visible]);

    if (!visible) return null;

    const onPressMenu = (item) => {
        navigation.navigate(item);
        onClose()
    }

    return (
        <TouchableWithoutFeedback onPress={onClose}>
            <View style={styles.overlay}>
                <Animated.View style={[styles.drawer, { transform: [{ translateX: drawerAnim }] }]}>

                    {/* 🔹 Profile Section */}
                    <View style={styles.profileSection}>
                        {user?.avatar ? (
                            <Image
                                source={{ uri: user.avatar }}
                                style={styles.profileImage}
                            />
                        ) : (
                            <View style={styles.avatarFallback}>
                                <Text style={styles.initials}>
                                    {user?.name ? user.name.slice(0, 2).toUpperCase() : "NA"}
                                </Text>
                            </View>
                        )}
                        <View style={styles.textContainer}>
                            <Text style={styles.profileName}>{user?.name}</Text>
                            <Text style={styles.profileLocation} numberOfLines={2}>{user?.description}</Text>
                        </View>
                    </View>


                    {/* 🔹 Menu Items */}
                    <View style={styles.menu}>
                        {menuOptions.map((item, index) => {
                            const IconComponent = IconMap[item.label]; // pick by label
                            return (
                                <TouchableOpacity
                                    key={index}
                                    style={styles.menuItem}
                                    onPress={() => onPressMenu(item.route)}
                                >
                                    {IconComponent && <IconComponent size={20} color="#fff" style={styles.menuIcon} />}
                                    <Text style={styles.menuText}>{item.label}</Text>
                                </TouchableOpacity>
                            );
                        })}
                    </View>

                    {/* 🔹 Footer */}
                    <View style={styles.footer}>
                        <Text style={styles.footerText}>YoDay © v{version} ({buildNumber})</Text>
                    </View>
                </Animated.View>
            </View>
        </TouchableWithoutFeedback>
    );
};

export default SideMenu;

const menuOptions = [
    // { key: 'Liked Posts', label: 'Liked Posts', icon: 'home' },
    // { key: 'Previous Posts', label: 'Previous Posts', icon: 'users' },
    { key: 'Help & Support', label: 'Help & Support', icon: 'bar-chart-2', route: 'Help' },
    { key: 'Terms & Conditions', label: 'Terms & Conditions', icon: 'clock', route: 'Terms' },
    // { key: 'About Us', label: 'About Us', icon: 'user-plus', route: 'About' },
    { key: 'Contact Us', label: 'Contact Us', icon: 'message-circle', route: 'Contact' },
    // { key: 'Program', label: 'Approach Anxiety Program', icon: 'activity' },
    // { key: 'Leaderboard', label: 'Leaderboard', icon: 'award' },
    { key: 'Settings', label: 'Settings', icon: 'settings', route: 'Settings' },
    // { key: 'Help', label: 'Help', icon: 'help-circle' },
    // { key: 'Logout', label: 'Logout', icon: 'log-out', route: 'Settings' },
];

const styles = StyleSheet.create({
    overlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: screenWidth,
        height: screenHeight,
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
        zIndex: 100,
    },
    drawer: {
        position: 'absolute',
        left: 0,
        top: 0,
        bottom: 0,
        height: screenHeight,
        width: screenWidth * 0.75,
        backgroundColor: '#4267B2', // Dark background for modern look
        padding: 20,
        justifyContent: 'space-between',
    },
    profileSection: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 30,
        paddingBottom: 30,
        borderBottomWidth: 0.5,
        borderBottomColor: '#fff'
    },
    profileImage: {
        width: 55,
        height: 55,
        borderRadius: 30,
        marginRight: 12,
    },
    profileName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#fff',
    },
    profileLocation: {
        fontSize: 14,
        color: '#aaa',
    },
    menu: {
        flex: 1,
        gap: 10,

    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        gap: 12,
        borderBottomWidth: 0.5,
        borderBottomColor: '#fff'
    },
    menuIcon: {
        marginRight: 15,
    },
    menuText: {
        fontSize: 16,
        color: '#fff',
    },
    footer: {
        borderTopWidth: 1,
        borderTopColor: '#444',
        paddingTop: 15,
    },
    footerText: {
        fontSize: 12,
        color: '#888',
    },
    profileImage: {
        width: 55,
        height: 55,
        borderRadius: 30,
        marginRight: 12,
        borderWidth: 2,
        borderColor: "#fff",
    },
    avatarFallback: {
        width: 55,
        height: 55,
        borderRadius: 30,
        backgroundColor: "#fff",
        alignItems: "center",
        justifyContent: "center",
        marginRight: 12,
        borderWidth: 2,
        borderColor: "#fff",
    },
    initials: {
        fontWeight: "bold",
        fontSize: 18,
        color: "#4267B2",
    },
    textContainer: {
        flexShrink: 1,
        width: screenWidth * 0.75 - 55 - 40, // drawerWidth - avatarWidth - paddings
    }


});
