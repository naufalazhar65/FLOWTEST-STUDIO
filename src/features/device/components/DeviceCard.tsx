import {
    Smartphone,
    TabletSmartphone,
    Circle,
} from "lucide-react";

import type { Device } from "../types/Device";

import {
    colors,
    radius,
    shadow,
    spacing,
    typography,
} from "../../../themes";

interface Props {
    device: Device;

    selected?: boolean;

    onClick?(): void;
}

export function DeviceCard({
    device,
    selected = false,
    onClick,
}: Props) {
    const statusColor =
        device.status === "connected"
            ? colors.success
            : device.status === "busy"
                ? colors.warning
                : colors.textSecondary;

    return (
        <button
            type="button"
            onClick={onClick}
            style={{
                width: "100%",

                display: "flex",

                flexDirection: "column",

                gap: spacing.md,

                padding: spacing.lg,

                background: selected
                    ? colors.panelHover
                    : colors.panel,

                border: `1px solid ${selected
                        ? colors.accent
                        : colors.border
                    }`,

                borderRadius: radius.lg,

                boxShadow: shadow.card,

                cursor: "pointer",

                transition: "all .18s ease",

                textAlign: "left",
            }}
        >
            <div
                style={{
                    display: "flex",

                    justifyContent:
                        "space-between",

                    alignItems: "center",
                }}
            >
                <div
                    style={{
                        display: "flex",

                        alignItems: "center",

                        gap: spacing.md,
                    }}
                >
                    {device.platform ===
                        "android" ? (
                        <Smartphone
                            size={20}
                            color={
                                colors.success
                            }
                        />
                    ) : (
                        <TabletSmartphone
                            size={20}
                            color="#A855F7"
                        />
                    )}

                    <div>
                        <div
                            style={{
                                ...typography.subtitle,

                                color:
                                    colors.text,
                            }}
                        >
                            {device.name}
                        </div>

                        <div
                            style={{
                                ...typography.caption,

                                color:
                                    colors.textSecondary,
                            }}
                        >
                            {device.platform.toUpperCase()}{" "}
                            {device.version}
                        </div>
                    </div>
                </div>

                <Circle
                    size={10}
                    fill={statusColor}
                    color={statusColor}
                />
            </div>

            <div
                style={{
                    ...typography.caption,

                    color:
                        colors.textMuted,
                }}
            >
                {device.udid}
            </div>
        </button>
    );
}