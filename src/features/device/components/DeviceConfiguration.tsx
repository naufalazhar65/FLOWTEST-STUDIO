import {
    useEffect,
    useState,
} from "react";

import {
    Apple,
    RotateCcw,
    Save,
} from "lucide-react";

import {
    colors,
    radius,
    spacing,
    typography,
} from "../../../themes";

import {
    useAppiumConfigStore,
} from "../../execution/store/useAppiumConfigStore";

import {
    useDeviceStore,
} from "../store/useDeviceStore";

export function DeviceConfiguration() {
    const config =
        useAppiumConfigStore(
            (state) => state.config,
        );

    const updateDevice =
        useAppiumConfigStore(
            (state) =>
                state.updateDevice,
        );

    const updateConfig =
        useAppiumConfigStore(
            (state) =>
                state.updateConfig,
        );

    const selectedDeviceId =
        useDeviceStore(
            (state) =>
                state.selectedDeviceId,
        );

    const devices =
        useDeviceStore(
            (state) => state.devices,
        );

    const selectedDevice =
        devices.find(
            (device) =>
                device.id ===
                selectedDeviceId,
        );

    const platform =
        config.platformName ===
            "Android"
            ? "android"
            : "ios";

    const deviceConfig =
        config[platform];

    const [
        deviceName,
        setDeviceName,
    ] = useState(
        deviceConfig.deviceName,
    );

    const [
        platformVersion,
        setPlatformVersion,
    ] = useState(
        deviceConfig.platformVersion,
    );

    const [
        udid,
        setUdid,
    ] = useState(
        deviceConfig.udid,
    );

    const [
        saved,
        setSaved,
    ] = useState(false);

    useEffect(() => {
        setDeviceName(
            deviceConfig.deviceName,
        );

        setPlatformVersion(
            deviceConfig.platformVersion,
        );

        setUdid(
            deviceConfig.udid,
        );

        setSaved(false);
    }, [
        platform,
        deviceConfig.deviceName,
        deviceConfig.platformVersion,
        deviceConfig.udid,
    ]);

    const handleSave = () => {
        updateDevice(
            platform,
            {
                deviceName,
                platformVersion,
                udid,
            },
        );

        setSaved(true);

        window.setTimeout(() => {
            setSaved(false);
        }, 1800);
    };

    const handleReset = () => {
        const defaults =
            platform === "android"
                ? {
                    deviceName:
                        "Android Emulator",
                    platformVersion: "",
                    udid: "",
                }
                : {
                    deviceName:
                        "iPhone 17 Pro",
                    platformVersion: "",
                    udid: "",
                };

        setDeviceName(
            defaults.deviceName,
        );

        setPlatformVersion(
            defaults.platformVersion,
        );

        setUdid(
            defaults.udid,
        );

        updateDevice(
            platform,
            defaults,
        );

        setSaved(false);
    };

    const inputStyle = {
        width: "100%",

        height: 40,

        boxSizing:
            "border-box" as const,

        padding: "0 12px",

        background: "#0D1117",

        border:
            `1px solid ${colors.border}`,

        borderRadius:
            radius.md,

        color: colors.text,

        outline: "none",

        fontSize: 13,
    };

    const labelStyle = {
        display: "block",

        marginBottom: 8,

        ...typography.caption,

        color: colors.textSecondary,

        fontWeight: 500,
    };

    return (
        <div
            style={{
                padding:
                    spacing.lg,

                background:
                    colors.panel,

                border:
                    `1px solid ${colors.border}`,

                borderRadius:
                    radius.lg,

                boxSizing:
                    "border-box",
            }}
        >
            {/* Header */}
            <div
                style={{
                    display: "flex",

                    alignItems:
                        "flex-start",

                    justifyContent:
                        "space-between",

                    gap: spacing.lg,

                    marginBottom:
                        spacing.xl,
                }}
            >
                <div>
                    <div
                        style={{
                            fontSize: 18,

                            lineHeight: 1.3,

                            fontWeight: 650,

                            color:
                                colors.text,
                        }}
                    >
                        Device Configuration
                    </div>

                    <div
                        style={{
                            marginTop: 6,

                            ...typography.caption,

                            color:
                                colors.textSecondary,
                        }}
                    >
                        Configure the target
                        device used by
                        Appium.
                    </div>
                </div>

                <button
                    type="button"
                    onClick={
                        handleReset
                    }
                    style={{
                        display:
                            "inline-flex",

                        alignItems:
                            "center",

                        gap: 8,

                        height: 36,

                        padding:
                            "0 12px",

                        border:
                            `1px solid ${colors.border}`,

                        borderRadius:
                            radius.md,

                        background:
                            colors.panelHover,

                        color:
                            colors.text,

                        cursor:
                            "pointer",

                        fontSize: 12,

                        fontWeight: 600,

                        whiteSpace:
                            "nowrap",
                    }}
                >
                    <RotateCcw
                        size={14}
                    />

                    Reset to Default
                </button>
            </div>

            {/* Selected device */}
            {selectedDevice && (
                <div
                    style={{
                        display:
                            "flex",

                        alignItems:
                            "center",

                        gap: 8,

                        marginBottom:
                            spacing.lg,

                        padding:
                            "9px 12px",

                        background:
                            colors.panelHover,

                        border:
                            `1px solid ${colors.border}`,

                        borderRadius:
                            radius.md,

                        color:
                            colors.textSecondary,

                        fontSize: 12,
                    }}
                >
                    Selected device:

                    <strong
                        style={{
                            color:
                                colors.text,
                        }}
                    >
                        {
                            selectedDevice.name
                        }
                    </strong>
                </div>
            )}

            {/* Configuration fields */}
            <div
                style={{
                    display:
                        "grid",

                    gridTemplateColumns:
                        "minmax(0, 1fr) minmax(0, 1fr)",

                    gap:
                        `${spacing.lg}px ${spacing.lg}px`,
                }}
            >
                <label>
                    <span
                        style={
                            labelStyle
                        }
                    >
                        Platform
                    </span>

                    <div
                        style={{
                            position:
                                "relative",
                        }}
                    >
                        <select
                            value={
                                config.platformName
                            }
                            onChange={(
                                event,
                            ) => {
                                const value =
                                    event
                                        .target
                                        .value as
                                    | "Android"
                                    | "iOS";

                                updateConfig({
                                    platformName:
                                        value,
                                });
                            }}
                            style={{
                                ...inputStyle,

                                appearance:
                                    "none",

                                paddingLeft:
                                    38,

                                paddingRight:
                                    32,

                                cursor:
                                    "pointer",
                            }}
                        >
                            <option value="Android">
                                Android
                            </option>

                            <option value="iOS">
                                iOS
                            </option>
                        </select>

                        <div
                            style={{
                                position:
                                    "absolute",

                                left: 12,

                                top: "50%",

                                transform:
                                    "translateY(-50%)",

                                pointerEvents:
                                    "none",

                                display:
                                    "flex",

                                alignItems:
                                    "center",
                            }}
                        >
                            {config.platformName ===
                                "iOS" ? (
                                <Apple
                                    size={15}
                                    color={
                                        colors.text
                                    }
                                />
                            ) : (
                                <span
                                    style={{
                                        fontSize:
                                            14,
                                        color:
                                            colors.success,
                                    }}
                                >
                                    ▣
                                </span>
                            )}
                        </div>

                        <div
                            style={{
                                position:
                                    "absolute",

                                right: 12,

                                top: "50%",

                                transform:
                                    "translateY(-50%)",

                                pointerEvents:
                                    "none",

                                color:
                                    colors.textSecondary,

                                fontSize: 11,
                            }}
                        >
                            ▾
                        </div>
                    </div>
                </label>

                <label>
                    <span
                        style={
                            labelStyle
                        }
                    >
                        Device Name
                    </span>

                    <input
                        value={
                            deviceName
                        }
                        onChange={(
                            event,
                        ) =>
                            setDeviceName(
                                event
                                    .target
                                    .value,
                            )
                        }
                        placeholder={
                            config.platformName ===
                                "iOS"
                                ? "iPhone 17 Pro"
                                : "Android Emulator"
                        }
                        style={
                            inputStyle
                        }
                    />
                </label>

                <label>
                    <span
                        style={
                            labelStyle
                        }
                    >
                        Platform Version
                    </span>

                    <input
                        value={
                            platformVersion
                        }
                        onChange={(
                            event,
                        ) =>
                            setPlatformVersion(
                                event
                                    .target
                                    .value,
                            )
                        }
                        placeholder="26.4"
                        style={
                            inputStyle
                        }
                    />
                </label>

                <label>
                    <span
                        style={
                            labelStyle
                        }
                    >
                        UDID
                    </span>

                    <input
                        value={udid}
                        onChange={(
                            event,
                        ) =>
                            setUdid(
                                event
                                    .target
                                    .value,
                            )
                        }
                        placeholder="Device UDID"
                        style={
                            inputStyle
                        }
                    />
                </label>
            </div>

            {/* Footer */}
            <div
                style={{
                    display:
                        "flex",

                    alignItems:
                        "center",

                    justifyContent:
                        "space-between",

                    gap: spacing.lg,

                    marginTop:
                        spacing.xl,

                    paddingTop:
                        spacing.lg,

                    borderTop:
                        `1px solid ${colors.border}`,
                }}
            >
                <div
                    style={{
                        display:
                            "flex",

                        alignItems:
                            "center",

                        gap: 8,

                        color:
                            colors.textSecondary,

                        fontSize: 11,
                    }}
                >
                    <span
                        style={{
                            width: 18,

                            height: 18,

                            display:
                                "inline-flex",

                            alignItems:
                                "center",

                            justifyContent:
                                "center",

                            border:
                                `1px solid ${colors.border}`,

                            borderRadius:
                                "50%",

                            color:
                                colors.textSecondary,

                            fontSize: 11,

                            fontWeight: 700,
                        }}
                    >
                        i
                    </span>

                    Configuration will be
                    used when creating a
                    new Appium session.
                </div>

                <button
                    type="button"
                    onClick={
                        handleSave
                    }
                    style={{
                        display:
                            "inline-flex",

                        alignItems:
                            "center",

                        justifyContent:
                            "center",

                        gap: 8,

                        minWidth: 170,

                        height: 38,

                        padding:
                            "0 16px",

                        border: 0,

                        borderRadius:
                            radius.md,

                        background:
                            colors.accent,

                        color:
                            colors.background,

                        cursor:
                            "pointer",

                        fontSize: 12,

                        fontWeight: 650,

                        boxShadow:
                            "0 4px 12px rgba(47, 129, 247, 0.2)",
                    }}
                >
                    <Save
                        size={14}
                    />
    
                    {saved
                        ? "Saved"
                        : "Save Configuration"}
                </button>
            </div>
        </div>
    );
}