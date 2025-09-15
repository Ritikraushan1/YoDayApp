import * as React from 'react';
import Svg, { Path } from 'react-native-svg';

const PhoneIcon = ({ size = 24, color = '#fff' }) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <Path
            d="M6.62 10.79a15.053 15.053 0 0 0 6.59 6.59l2.2-2.2a1 1 0 0 1 1.11-.21c1.21.48 2.53.74 3.88.74a1 1 0 0 1 1 1v3.5a1 1 0 0 1-1 1C10.29 22 2 13.71 2 4.5a1 1 0 0 1 1-1H6.5a1 1 0 0 1 1 1c0 1.35.26 2.67.74 3.88a1 1 0 0 1-.21 1.11l-2.41 2.3Z"
            fill={color}
        />
    </Svg>
);

export default PhoneIcon;
