import { DeviceCard } from "./DeviceCard";

import { useDeviceStore } from "../store/useDeviceStore";

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

    return (
        <div
            style={{
                display: "flex",

                flexDirection: "column",

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
                        selectDevice(
                            device.id,
                        )
                    }
                />
            ))}
        </div>
    );
}