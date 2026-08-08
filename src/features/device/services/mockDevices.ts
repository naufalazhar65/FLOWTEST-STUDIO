import type { Device } from "../types/Device";

export const mockDevices: Device[] = [
    {
        id: "emulator-5554",

        name: "Pixel 8 Pro",

        platform: "android",

        version: "15",

        udid: "emulator-5554",

        status: "connected",

        emulator: true,
    },
    {
        id: "iphone-15",

        name: "iPhone 15 Pro",

        platform: "ios",

        version: "18",

        udid: "00008110-001A",

        status: "offline",

        emulator: false,
    },
];