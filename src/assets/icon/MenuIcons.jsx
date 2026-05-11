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

export const BackIcon = ({ color = "#000" }) => (
    <Svg
        role="img"
        aria-label="Back"
        viewBox="0 0 24 24"
        width="24"
        height="24"
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
    >
        <Path d="M15 6l-6 6 6 6" />
        <Path d="M9 12h10" />
    </Svg>
);

export const CommunityIllustration = () => (
    <Svg width={180} height={180} viewBox="0 0 24 24" fill="none">
        <Circle cx="12" cy="12" r="10" stroke="#1f6f8b" strokeWidth={2} />
        <Path d="M8 14h8M9 10h6" stroke="#1f6f8b" strokeWidth={2} strokeLinecap="round" />
    </Svg>
);

export const LikedIcon = () => (
    <Svg
        role="img"
        aria-label="Liked posts"
        viewBox="0 0 24 24"
        width="24"
        height="24"
        fill="none"
        stroke="#fff"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
    >
        {/* <title>Liked posts</title> */}
        <Path d="M14 9V5a3 3 0 0 0-3-3L7 9v11h7a4 4 0 0 0 4-4v-5a2 2 0 0 0-2-2h-2z" />
        <Path d="M7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3" />
    </Svg>
);

export const PreviousIcon = () => (
    <Svg
        role="img"
        aria-label="Previous items"
        viewBox="0 0 24 24"
        width="24"
        height="24"
        fill="none"
        stroke="#fff"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
    >
        {/* <title>Previous items</title> */}
        <Circle cx="12" cy="12" r="9" />
        <Path d="M12 7v5l3 3" />
        <Path d="M8 3H4v4" />
        <Path d="M4 7a9 9 0 1 1 3 7" />
    </Svg>
);

export const HelpIcon = () => (
    <Svg
        role="img"
        aria-label="Help"
        viewBox="0 0 24 24"
        width="24"
        height="24"
        fill="none"
        stroke="#fff"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
    >
        {/* <title>Help</title> */}
        <Circle cx="12" cy="12" r="9" />
        <Path d="M9.5 9a2.5 2.5 0 1 1 5 0c0 1.2-1 1.8-1.8 2.3-.7.4-1.2.9-1.2 1.7V14" />
        <Circle cx="12" cy="17" r="1" />
    </Svg>
);

export const TermsIcon = () => (
    <Svg
        role="img"
        aria-label="Terms and conditions"
        viewBox="0 0 24 24"
        width="24"
        height="24"
        fill="none"
        stroke="#fff"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
    >
        {/* <title>Terms and conditions</title> */}
        <Path d="M7 3h8l4 4v14H7z" />
        <Path d="M15 3v4h4" />
        <Path d="M9 12h6" />
        <Path d="M9 9h3" />
        <Path d="M9 15l2 2 4-4" />
    </Svg>
);

export const AboutIcon = () => (
    <Svg
        role="img"
        aria-label="About us"
        viewBox="0 0 24 24"
        width="24"
        height="24"
        fill="none"
        stroke="#fff"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
    >
        {/* <title>About us</title> */}
        <Circle cx="12" cy="12" r="9" />
        <Path d="M12 16v-4" />
        <Circle cx="12" cy="8" r="1" />
    </Svg>
);

export const CameraIcon = () => (
    <Svg
        role="img"
        aria-label="Camera"
        viewBox="0 0 24 24"
        width="18"
        height="18"
        fill="none"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
    >
        {/* <title>Camera</title> */}
        <Path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
        <Circle cx="12" cy="13" r="4" />
    </Svg>
);

export const EditIcon = () => (
    <Svg
        role="img"
        aria-label="Edit"
        viewBox="0 0 24 24"
        width="18"
        height="18"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
    >
        {/* <title>Edit</title> */}
        <Path d="M12 20h9" />
        <Path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z" />
    </Svg>
);

export const UploadIcon = ({ size = 20, color = "#fff", strokeWidth = 2 }) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <Path
            d="M4 17v2a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3v-2"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
        />
        <Path
            d="M12 12V3"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
        />
        <Path
            d="M7.5 7.5 12 3l4.5 4.5"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </Svg>
);

export const PersonIcon = ({ size = 20, color = "#fff", strokeWidth = 2 }) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <Circle cx="12" cy="7" r="4" stroke={color} strokeWidth={strokeWidth} />
        <Path
            d="M4 21a8 8 0 0 1 16 0"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
        />
    </Svg>
);

export const CallIcon = ({ size = 20, color = "#fff", strokeWidth = 2 }) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <Path
            d="M22 16.92v2a2 2 0 0 1-2.18 2 19.8 19.8 0 0 1-8.64-3.07 19.4 19.4 0 0 1-6-6A19.8 19.8 0 0 1 2.92 4.2 2 2 0 0 1 4.9 2h2a2 2 0 0 1 2 1.72c.12.9.33 1.77.62 2.6a2 2 0 0 1-.45 2.11L8 9a16 16 0 0 0 7 7l.56-1.07a2 2 0 0 1 2.1-.45c.83.29 1.7.5 2.6.62A2 2 0 0 1 22 16.92Z"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </Svg>
);

export const CalendarIcon = ({ size = 20, color = "#fff", strokeWidth = 2 }) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <Rect
            x="3"
            y="5"
            width="18"
            height="16"
            rx="2"
            stroke={color}
            strokeWidth={strokeWidth}
        />
        <Path
            d="M16 3v4M8 3v4M3 10h18"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
        />
    </Svg>
);

export const TimeIcon = ({ size = 20, color = "#fff", strokeWidth = 2 }) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <Circle cx="12" cy="12" r="9" stroke={color} strokeWidth={strokeWidth} />
        <Path
            d="M12 7v5l4 2"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </Svg>
);

export const LocationIcon = ({ size = 20, color = "#fff", strokeWidth = 2 }) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <Path
            d="M12 22s7-6.2 7-12a7 7 0 1 0-14 0c0 5.8 7 12 7 12Z"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeLinejoin="round"
        />
        <Circle cx="12" cy="10" r="2.5" stroke={color} strokeWidth={strokeWidth} />
    </Svg>
);

export const RadioCheckedIcon = ({
    size = 18,
    color = "#fff",
    strokeWidth = 2,
    fillInner = "#fff",
}) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <Circle cx="12" cy="12" r="9" stroke={color} strokeWidth={strokeWidth} />
        <Circle cx="12" cy="12" r="5" fill={fillInner} />
    </Svg>
);

export const RadioUncheckedIcon = ({
    size = 18,
    color = "#fff",
    strokeWidth = 2,
}) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <Circle cx="12" cy="12" r="9" stroke={color} strokeWidth={strokeWidth} />
    </Svg>
);


// 🔹 Map Labels to Icons
export const IconMap = {
    "Liked Posts": LikedIcon,
    "Previous Posts": PreviousIcon,
    "Help & Support": HelpIcon,
    "Terms of Use Agreement": TermsIcon,
    "About Us": AboutIcon,
    "Contact Us": MessageCircleIcon,
    "Settings": SettingsIcon,
    "Logout": LogOutIcon,
};
