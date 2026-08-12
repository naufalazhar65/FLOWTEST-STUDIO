import { DeviceCard } from "./DeviceCard";

import { useDeviceStore } from "../store/useDeviceStore";

import {
    useAppiumConfigStore,
} from "../../execution/store/useAppiumConfigStore";

export function DeviceList() {
    const devices =
        useDeviceStore(
            (state) => state.devices,
        );

    const selectedDeviceId =
        useDeviceStore(
            (state) =>
                state.selectedDeviceId,
        );

    const selectDevice =
        useDeviceStore(
            (state) =>
                state.selectDevice,
        );

    const updateConfig =
        useAppiumConfigStore(
            (state) =>
                state.updateConfig,
        );

    const updateDevice =
        useAppiumConfigStore(
            (state) =>
                state.updateDevice,
        );

    const handleSelectDevice = (
        device: (typeof devices)[number],
    ) => {
        const platform =
            device.platform ===
            "android"
                ? "Android"
                : "iOS";

        selectDevice(device.id);

        updateConfig({
            platformName:
                platform,
        });

        updateDevice(
            device.platform,
            {
                deviceName:
                    device.name,

                platformVersion:
                    device.version ===
                    "Unknown"
                        ? ""
                        : device.version,

                udid: device.udid,
            },
        );
    };

    return (
        <div
            style={{
                display: "flex",

                flexDirection:
                    "column",

                gap: 12,
            }}
        >
            {devices.map((device) => (
                <DeviceCard
                    key={device.id}
                    device={device}
                    selected={
                        device.id ===
                        selectedDeviceId
                    }
                    onClick={() =>
                        handleSelectDevice(
                            device,
                        )
                    }
                />
            ))}
        </div>
    );
}