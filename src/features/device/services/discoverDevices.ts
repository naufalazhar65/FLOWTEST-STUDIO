import type { Device } from "../types/Device";

const DEVICE_API_URL =
    "http://localhost:8787/api/devices";

interface DeviceResponse {
    devices: Device[];
}

export async function discoverDevices(): Promise<Device[]> {
    const response =
        await fetch(
            DEVICE_API_URL,
        );

    if (
        !response.ok
    ) {
        throw new Error(
            `Device discovery failed with status ${response.status}.`,
        );
    }

    const data =
        await response.json() as DeviceResponse;

    if (
        !Array.isArray(
            data.devices,
        )
    ) {
        throw new Error(
            "Device discovery returned an invalid response.",
        );
    }

    return data.devices;
}
