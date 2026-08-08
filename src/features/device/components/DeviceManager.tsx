import { useEffect } from "react";

import { DeviceList } from "./DeviceList";

import { mockDevices } from "../services/mockDevices";
import { useDeviceStore } from "../store/useDeviceStore";

export function DeviceManager() {
    const setDevices =
        useDeviceStore(
            (state) =>
                state.setDevices,
        );

    useEffect(() => {
        setDevices(mockDevices);
    }, [setDevices]);

    return (
        <div
            style={{
                padding: 16,
            }}
        >
            <DeviceList />
        </div>
    );
}