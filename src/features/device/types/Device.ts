export type DevicePlatform =
    | "android"
    | "ios";

export type DeviceStatus =
    | "connected"
    | "offline"
    | "busy";

export interface Device {
    id: string;

    name: string;

    platform: DevicePlatform;

    version: string;

    udid: string;

    status: DeviceStatus;

    emulator: boolean;
}