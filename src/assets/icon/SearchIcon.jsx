import React from 'react';
import Svg, { Path } from 'react-native-svg';

const SearchIcon = ({ size = 24, color = '#000' }) => (
    <Svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
    >
        <Path
            d="M11 19a8 8 0 100-16 8 8 0 000 16zm6.707-2.293l4.586 4.586-1.414 1.414-4.586-4.586 1.414-1.414z"
            fill={color}
        />
    </Svg>
);

export default SearchIcon;
