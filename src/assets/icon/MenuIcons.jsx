// MenuIcons.js
import React from "react";
import { Svg, Path, Polyline, Circle, Line } from "react-native-svg";

// 🏠 Home (Liked Posts)
export const HomeIcon = ({ size = 20, color = "#fff" }) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none"
        stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <Path d="M3 9L12 2l9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
        <Polyline points="9 22 9 12 15 12 15 22" />
    </Svg>
);

// 👥 Users (Previous Posts)
export const UsersIcon = ({ size = 20, color = "#fff" }) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none"
        stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <Path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <Circle cx="9" cy="7" r="4" />
        <Path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <Path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </Svg>
);

// 📊 Bar Chart (Help & Support)
export const BarChart2Icon = ({ size = 20, color = "#fff" }) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none"
        stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <Line x1="18" y1="20" x2="18" y2="10" />
        <Line x1="12" y1="20" x2="12" y2="4" />
        <Line x1="6" y1="20" x2="6" y2="14" />
    </Svg>
);

// ⏰ Clock (Terms & Conditions)
export const ClockIcon = ({ size = 20, color = "#fff" }) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none"
        stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <Circle cx="12" cy="12" r="10" />
        <Polyline points="12 6 12 12 16 14" />
    </Svg>
);

// ➕ User Plus (About Us)
export const UserPlusIcon = ({ size = 20, color = "#fff" }) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none"
        stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <Path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <Circle cx="8.5" cy="7" r="4" />
        <Line x1="20" y1="8" x2="20" y2="14" />
        <Line x1="23" y1="11" x2="17" y2="11" />
    </Svg>
);

// 💬 Message Circle (Contact Us)
export const MessageCircleIcon = ({ size = 20, color = "#fff" }) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none"
        stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <Path d="M21 11.5a8.38 8.38 0 0 1-1.9 5.4 8.5 8.5 0 0 1-6.6 3.1c-1.6 0-3.1-.4-4.4-1.2L3 20l1.2-3.6a8.48 8.48 0 0 1-1.2-4.9 
             8.5 8.5 0 0 1 3.1-6.6 8.38 8.38 0 0 1 5.4-1.9h.5a8.5 8.5 0 0 1 8.5 8.5z"/>
    </Svg>
);

// ⚙️ Settings
export const SettingsIcon = ({ size = 20, color = "#fff" }) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none"
        stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <Circle cx="12" cy="12" r="3" />
        <Path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06
             a2 2 0 0 1-2.83 2.83l-.06-.06
             a1.65 1.65 0 0 0-1.82-.33
             1.65 1.65 0 0 0-1 1.51V21
             a2 2 0 0 1-4 0v-.09
             a1.65 1.65 0 0 0-1-1.51
             1.65 1.65 0 0 0-1.82.33l-.06.06
             a2 2 0 0 1-2.83-2.83l.06-.06
             c.46-.46.61-1.14.33-1.82
             a1.65 1.65 0 0 0-1.51-1H3
             a2 2 0 0 1 0-4h.09
             c.7 0 1.32-.4 1.51-1
             a1.65 1.65 0 0 0-.33-1.82l-.06-.06
             a2 2 0 0 1 2.83-2.83l.06.06
             c.46.46 1.14.61 1.82.33h.09
             c.7 0 1.32-.4 1.51-1V3
             a2 2 0 0 1 4 0v.09
             c0 .7.4 1.32 1 1.51.68.28 1.36.13 1.82-.33l.06-.06
             a2 2 0 0 1 2.83 2.83l-.06.06
             c-.46.46-.61 1.14-.33 1.82v.09
             c0 .7.4 1.32 1 1.51.68.28 1.36.13 1.82-.33z"/>
    </Svg>
);

// 🚪 Log Out
export const LogOutIcon = ({ size = 20, color = "#fff" }) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none"
        stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <Path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
        <Polyline points="16 17 21 12 16 7" />
        <Line x1="21" y1="12" x2="9" y2="12" />
    </Svg>
);

// 🔹 Map Labels to Icons
export const IconMap = {
    "Liked Posts": HomeIcon,
    "Previous Posts": UsersIcon,
    "Help & Support": BarChart2Icon,
    "Terms & Conditions": ClockIcon,
    "About Us": UserPlusIcon,
    "Contact Us": MessageCircleIcon,
    "Settings": SettingsIcon,
    "Logout": LogOutIcon,
};
