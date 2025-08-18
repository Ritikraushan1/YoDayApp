import * as React from 'react';
import Svg, { Path } from 'react-native-svg';

const FacebookIcon = ({ size = 24, color = '#fff' }) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <Path
            d="M22 12.073C22 6.505 17.523 2 12 2S2 6.505 2 12.073c0 5.018 3.657 9.167 8.438 9.878v-6.987h-2.54v-2.89h2.54V9.845c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562v1.875h2.773l-.443 2.89h-2.33v6.987C18.343 21.24 22 17.09 22 12.073Z"
            fill={color}
        />
    </Svg>
);

export default FacebookIcon;
