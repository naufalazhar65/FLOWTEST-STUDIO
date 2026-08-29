import {
    useCallback,
    useEffect,
    useState,
} from "react";

import {
    Circle,
    RefreshCw,
    Unplug,
} from "lucide-react";

import { DeviceList } from "./DeviceList";

import { useDeviceStore } from "../store/useDeviceStore";

import {
    useAppiumConfigStore,
} from "../../execution/store/useAppiumConfigStore";

import {
    useExecutionStore,
} from "../../execution/store/useExecutionStore";

import {
    appiumConnectionService,
} from "../../execution/services/appium/AppiumConnectionService";

import {
    appiumClient,
} from "../../execution/services/appium/AppiumClient";

import {
    appiumSession,
} from "../../execution/services/appium/AppiumSession";

import {
    colors,
    radius,
    spacing,
    typography,
} from "../../../themes";

import {
    DeviceConfiguration,
} from "./DeviceConfiguration";

import {
    discoverDevices,
} from "../services/discoverDevices";

export function DeviceManager() {
    const setDevices =
        useDeviceStore(
            (state) =>
                state.setDevices,
        );

    const [
        isRefreshingDevices,
        setIsRefreshingDevices,
    ] = useState(false);

    const config =
        useAppiumConfigStore(
            (state) =>
                state.config,
        );

    const appiumConnection =
        useExecutionStore(
            (state) =>
                state.appiumConnection,
        );

    const environment =
        useExecutionStore(
            (state) =>
                state.environment,
        );

    const [
        connecting,
        setConnecting,
    ] = useState(false);

    const loadDevices =
        useCallback(
            async () => {
                setIsRefreshingDevices(
                    true,
                );

                try {
                    const devices =
                        await discoverDevices();

                    setDevices(
                        devices,
                    );
                } catch (error) {
                    console.error(
                        "Failed to discover devices:",
                        error,
                    );

                    setDevices(
                        [],
                    );
                } finally {
                    setIsRefreshingDevices(
                        false,
                    );
                }
            },
            [
                setDevices,
            ],
        );

    useEffect(() => {
        const initialLoad = window.setTimeout(
            () => {
                void loadDevices();
            },
            0,
        );

        return () => {
            window.clearTimeout(
                initialLoad,
            );
        };
    }, [
        loadDevices,
    ]);

    useEffect(() => {
        appiumConnectionService.start();

        return () => {
            appiumConnectionService.stop();
        };
    }, []);

    const handleConnect =
        async () => {
            if (
                appiumConnection !==
                "connected"
            ) {
                return;
            }

            if (
                appiumSession.hasSession()
            ) {
                return;
            }

            try {
                setConnecting(true);

                await appiumClient
                    .connectDevice();
            } catch (error) {
                console.error(
                    "Failed to connect device:",
                    error,
                );
            } finally {
                setConnecting(false);
            }
        };

    const handleDisconnect =
        async () => {
            try {
                setConnecting(true);

                await appiumClient
                    .deleteSession();
            } catch (error) {
                console.error(
                    "Failed to disconnect device:",
                    error,
                );
            } finally {
                setConnecting(false);
            }
        };

    const handleRefreshSession =
        async () => {
            if (
                !appiumSession.hasSession()
            ) {
                return;
            }

            try {
                setConnecting(true);

                await appiumClient
                    .refreshSession();
            } catch (error) {
                console.error(
                    "Failed to refresh session:",
                    error,
                );

                appiumSession.clear();

                useExecutionStore
                    .getState()
                    .setEnvironment({
                        platform: null,
                        osVersion: null,
                        device: null,
                        automation: null,
                        sessionId: null,
                    });
            } finally {
                setConnecting(false);
            }
        };

    const hasSession =
        appiumSession.hasSession();

    const connected =
        appiumConnection ===
        "connected";

    return (
        <div
            style={{
                flex: 1,
                minHeight: 0,
                overflowY: "auto",
                overflowX: "hidden",
                padding: 16,
                boxSizing: "border-box",
            }}
        >
            {/* Appium server */}
            <div
                style={{
                    padding: "16px 20px",
                    marginBottom: 14,
                    background:
                        colors.panel,
                    border:
                        `1px solid ${colors.border}`,
                    borderRadius:
                        radius.lg,
                }}
            >
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent:
                            "space-between",
                        gap: spacing.md,
                    }}
                >
                    <div>
                        <div
                            style={{
                                ...typography.subtitle,
                                color: colors.text,
                            }}
                        >
                            Appium Server
                        </div>

                        <div
                            style={{
                                ...typography.caption,
                                color:
                                    colors.textSecondary,
                                marginTop: 3,
                            }}
                        >
                            {config.serverUrl}
                        </div>
                    </div>

                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 7,
                            color: connected
                                ? colors.success
                                : colors.textMuted,
                            fontSize: 12,
                            fontWeight: 600,
                        }}
                    >
                        <Circle
                            size={8}
                            fill="currentColor"
                            strokeWidth={0}
                        />
                        {connected
                            ? "Connected"
                            : appiumConnection ===
                                "checking"
                                ? "Checking"
                                : "Offline"}
                    </div>
                </div>
            </div>

            {/* Main devices workspace */}
            <div
                style={{
                    display: "grid",
                    gridTemplateColumns:
                        "minmax(0, 1fr) 360px",
                    gap: 16,
                    alignItems: "start",
                }}
            >
                {/* Left column */}
                <div
                    style={{
                        minWidth: 0,
                        display: "flex",
                        flexDirection: "column",
                        gap: 14,
                    }}
                >
                    <section
                        style={{
                            padding: 12,
                            background:
                                colors.panel,
                            border:
                                `1px solid ${colors.border}`,
                            borderRadius:
                                radius.lg,
                        }}
                    >
                        <div
                            style={{
                                padding:
                                    "2px 4px 12px",
                                display: "flex",
                                alignItems:
                                    "center",
                                justifyContent:
                                    "space-between",
                            }}
                        >
                            <div
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 10,
                                }}
                            >
                                <div
                                    style={{
                                        ...typography.subtitle,
                                        color: colors.text,
                                    }}
                                >
                                    Available Devices
                                </div>

                                <button
                                    type="button"
                                    onClick={() => {
                                        void loadDevices();
                                    }}
                                    disabled={
                                        isRefreshingDevices
                                    }
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        gap: 6,
                                        padding: "6px 9px",
                                        border:
                                            `1px solid ${colors.border}`,
                                        borderRadius:
                                            radius.md,
                                        background:
                                            colors.panelHover,
                                        color:
                                            colors.textSecondary,
                                        cursor:
                                            isRefreshingDevices
                                                ? "not-allowed"
                                                : "pointer",
                                        opacity:
                                            isRefreshingDevices
                                                ? 0.55
                                                : 1,
                                        fontSize: 11,
                                        fontWeight: 600,
                                    }}
                                    title="Refresh available devices"
                                >
                                    <RefreshCw
                                        size={13}
                                        style={{
                                            animation:
                                                isRefreshingDevices
                                                    ? "spin 1s linear infinite"
                                                    : undefined,
                                        }}
                                    />

                                    {isRefreshingDevices
                                        ? "Refreshing..."
                                        : "Refresh"}
                                </button>
                            </div>

                            <div
                                style={{
                                    ...typography.caption,
                                    color:
                                        colors.textMuted,
                                }}
                            >
                                {config.platformName}
                            </div>
                        </div>

                        <DeviceList />
                    </section>

                    <DeviceConfiguration />
                </div>

                {/* Right column */}
                <aside
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 14,
                        position: "sticky",
                        top: 0,
                    }}
                >
                    <button
                        type="button"
                        onClick={
                            hasSession
                                ? handleDisconnect
                                : handleConnect
                        }
                        disabled={
                            connecting ||
                            (!hasSession &&
                                !connected)
                        }
                        style={{
                            width: "100%",
                            minHeight: 46,
                            display: "flex",
                            alignItems: "center",
                            justifyContent:
                                "center",
                            gap: 8,
                            padding: "10px 14px",
                            border:
                                hasSession
                                    ? "1px solid #F85149"
                                    : "1px solid transparent",
                            borderRadius:
                                radius.md,
                            background:
                                hasSession
                                    ? "rgba(248,81,73,.08)"
                                    : colors.accent,
                            color:
                                hasSession
                                    ? "#FF7B72"
                                    : colors.background,
                            cursor:
                                connecting ||
                                    (!hasSession &&
                                        !connected)
                                    ? "not-allowed"
                                    : "pointer",
                            opacity:
                                connecting ||
                                    (!hasSession &&
                                        !connected)
                                    ? 0.55
                                    : 1,
                            fontSize: 13,
                            fontWeight: 600,
                        }}
                    >
                        <Unplug size={16} />
                        {connecting
                            ? hasSession
                                ? "Disconnecting..."
                                : "Connecting..."
                            : hasSession
                                ? "Disconnect Device"
                                : "Connect Device"}
                    </button>

                    <section
                        style={{
                            padding: 18,
                            background:
                                colors.panel,
                            border:
                                `1px solid ${colors.border}`,
                            borderRadius:
                                radius.lg,
                        }}
                    >
                        <div
                            style={{
                                display: "flex",
                                alignItems:
                                    "center",
                                justifyContent:
                                    "space-between",
                                gap: 12,
                                paddingBottom: 14,
                                borderBottom:
                                    `1px solid ${colors.border}`,
                            }}
                        >
                            <div
                                style={{
                                    ...typography.subtitle,
                                    color:
                                        colors.text,
                                }}
                            >
                                Active Session
                            </div>

                            <span
                                style={{
                                    padding:
                                        "5px 9px",
                                    borderRadius: 8,
                                    background:
                                        hasSession
                                            ? "rgba(46,160,67,.12)"
                                            : "rgba(139,148,158,.10)",
                                    border:
                                        `1px solid ${hasSession ? "rgba(46,160,67,.35)" : colors.border}`,
                                    color:
                                        hasSession
                                            ? colors.success
                                            : colors.textMuted,
                                    fontSize: 11,
                                    fontWeight: 600,
                                }}
                            >
                                {hasSession
                                    ? "Active"
                                    : "Inactive"}
                            </span>
                        </div>

                        <SessionRow
                            label="Platform"
                            value={
                                environment.platform ??
                                "-"
                            }
                        />

                        <SessionRow
                            label="Device"
                            value={
                                environment.device ??
                                "-"
                            }
                        />

                        <SessionRow
                            label="Version"
                            value={
                                environment.osVersion ??
                                "-"
                            }
                        />

                        <SessionRow
                            label="Automation"
                            value={
                                environment.automation ??
                                "-"
                            }
                            accent={
                                environment.automation !==
                                null
                            }
                        />

                        <SessionRow
                            label="Session ID"
                            value={
                                environment.sessionId ??
                                "-"
                            }
                            mono
                            last
                        />

                        <SessionRow
                            label="Server"
                            value={
                                config.serverUrl
                            }
                            last
                        />
                    </section>

                    <section
                        style={{
                            padding: 18,
                            background:
                                colors.panel,
                            border:
                                `1px solid ${colors.border}`,
                            borderRadius:
                                radius.lg,
                        }}
                    >
                        <div
                            style={{
                                ...typography.subtitle,
                                color:
                                    colors.text,
                                marginBottom: 12,
                            }}
                        >
                            Session Actions
                        </div>

                        {hasSession ? (
                            <button
                                type="button"
                                onClick={
                                    handleRefreshSession
                                }
                                style={{
                                    width: "100%",
                                    minHeight: 40,
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    gap: 8,
                                    padding: "9px 12px",
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
                                }}
                            >
                                <RefreshCw
                                    size={14}
                                />
                                Refresh Session Info
                            </button>
                        ) : (
                            <div
                                style={{
                                    padding: "10px 12px",
                                    border:
                                        `1px solid ${colors.border}`,
                                    borderRadius:
                                        radius.md,
                                    color:
                                        colors.textSecondary,
                                    fontSize: 12,
                                    lineHeight: 1.5,
                                }}
                            >
                                Connect a device to create an
                                Appium session.
                            </div>
                        )}
                    </section>
                </aside>
            </div>
        </div>
    );
}

interface SessionRowProps {
    label: string;
    value: string;
    accent?: boolean;
    mono?: boolean;
    last?: boolean;
}

function SessionRow({
    label,
    value,
    accent = false,
    mono = false,
    last = false,
}: SessionRowProps) {
    return (
        <div
            style={{
                display: "grid",
                gridTemplateColumns:
                    "96px minmax(0, 1fr)",
                gap: 12,
                alignItems: "center",
                minHeight: 44,
                borderBottom: last
                    ? "none"
                    : `1px solid ${colors.border}`,
                fontSize: 12,
            }}
        >
            <span
                style={{
                    color: colors.textMuted,
                }}
            >
                {label}
            </span>

            <span
                title={value}
                style={{
                    minWidth: 0,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                    color: accent
                        ? "#BC8CFF"
                        : colors.text,
                    fontFamily: mono
                        ? "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace"
                        : undefined,
                }}
            >
                {value}
            </span>
        </div>
    );
}