import React from 'react';
import Svg, { Circle, Line } from 'react-native-svg';

const SearchIcon = ({ size = 24, color = '#000' }) => (
    <Svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
    >
        {/* Magnifying glass circle */}
        <Circle
            cx="11"
            cy="11"
            r="7"
            stroke={color}
            strokeWidth="2"
        />
        {/* Handle */}
        <Line
            x1="16.5"
            y1="16.5"
            x2="21"
            y2="21"
            stroke={color}
            strokeWidth="2"
            strokeLinecap="round"
        />
    </Svg>
);

export default SearchIcon;
