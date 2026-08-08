import { create } from "zustand";

import type { Device } from "../types/Device";

interface DeviceStore {
    devices: Device[];

    selectedDeviceId: string | null;

    setDevices(
        devices: Device[],
    ): void;

    selectDevice(
        id: string | null,
    ): void;

    clear(): void;
}

export const useDeviceStore =
    create<DeviceStore>((set) => ({
        devices: [],

        selectedDeviceId: null,

        setDevices(devices) {
            set({
                devices,
            });
        },

        selectDevice(id) {
            set({
                selectedDeviceId: id,
            });
        },

        clear() {
            set({
                devices: [],

                selectedDeviceId: null,
            });
        },
    }));