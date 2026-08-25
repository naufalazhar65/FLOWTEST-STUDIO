export interface DeviceProfile {
    platformName:
        | "Android"
        | "iOS";

    deviceName: string;

    platformVersion: string;

    udid: string;
}