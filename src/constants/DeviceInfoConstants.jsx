import { Platform } from 'react-native';
import DeviceInfo from "react-native-device-info";

export const DevicePlatform = Platform.OS
export const CurrentDeviceAppVersion = DeviceInfo.getVersion();
export const DeviceName = DeviceInfo.getDeviceName();
export const DeviceModel = DeviceInfo.getModel();
export const DeviceSystemVersion = DeviceInfo.getSystemVersion();