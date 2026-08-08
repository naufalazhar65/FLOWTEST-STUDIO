import type { LucideIcon } from "lucide-react";

import {
    Smartphone,
    Apple,
    Layers3,
} from "lucide-react";

import {
    colors,
    radius,
} from "../../themes";

interface RadioOption {
    label: string;
    value: string;
    icon?: LucideIcon;
}

interface Props {
    label?: string;

    value: string;

    options: RadioOption[];

    onChange(value: string): void;
}

const defaultIcons: Record<
    string,
    LucideIcon
> = {
    android: Smartphone,
    ios: Apple,
    "cross-platform": Layers3,
};

export function RadioGroup({
    label,
    value,
    options,
    onChange,
}: Props) {
    return (
        <div
            style={{
                display: "flex",
                flexDirection: "column",
                gap: 10,
            }}
        >
            {label && (
                <div
                    style={{
                        color: colors.text,

                        fontSize: 13,

                        fontWeight: 600,

                        letterSpacing:
                            "0.02em",
                    }}
                >
                    {label}
                </div>
            )}

            <div
                style={{
                    display: "grid",

                    gridTemplateColumns:
                        "repeat(3, minmax(0, 1fr))",

                    gap: 10,
                }}
            >
                {options.map(
                    (option) => {
                        const selected =
                            option.value ===
                            value;

                        const Icon =
                            option.icon ??
                            defaultIcons[
                                option.value
                            ] ??
                            Smartphone;

                        return (
                            <button
                                key={
                                    option.value
                                }
                                type="button"
                                aria-pressed={
                                    selected
                                }
                                onClick={() =>
                                    onChange(
                                        option.value,
                                    )
                                }
                                style={{
                                    position:
                                        "relative",

                                    minHeight: 88,

                                    display:
                                        "flex",

                                    flexDirection:
                                        "column",

                                    alignItems:
                                        "flex-start",

                                    justifyContent:
                                        "space-between",

                                    gap: 12,

                                    padding:
                                        "14px",

                                    background:
                                        selected
                                            ? "rgba(59, 130, 246, 0.08)"
                                            : colors.panel,

                                    border:
                                        `1px solid ${
                                            selected
                                                ? colors.accent
                                                : colors.border
                                        }`,

                                    borderRadius:
                                        radius.md,

                                    color:
                                        colors.text,

                                    cursor:
                                        "pointer",

                                    textAlign:
                                        "left",

                                    transition:
                                        "transform .16s ease, background .16s ease, border-color .16s ease, box-shadow .16s ease",

                                    boxShadow:
                                        selected
                                            ? "0 0 0 1px rgba(59, 130, 246, 0.08), 0 8px 24px rgba(59, 130, 246, 0.08)"
                                            : "none",

                                    outline:
                                        "none",
                                }}
                                onMouseEnter={(
                                    event,
                                ) => {
                                    const target =
                                        event.currentTarget;

                                    if (
                                        !selected
                                    ) {
                                        target.style.background =
                                            colors.panelHover;

                                        target.style.borderColor =
                                            colors.borderLight;
                                    }

                                    target.style.transform =
                                        "translateY(-1px)";
                                }}
                                onMouseLeave={(
                                    event,
                                ) => {
                                    const target =
                                        event.currentTarget;

                                    if (
                                        !selected
                                    ) {
                                        target.style.background =
                                            colors.panel;

                                        target.style.borderColor =
                                            colors.border;
                                    }

                                    target.style.transform =
                                        "translateY(0)";
                                }}
                                onFocus={(
                                    event,
                                ) => {
                                    event.currentTarget.style.borderColor =
                                        colors.accent;
                                }}
                                onBlur={(
                                    event,
                                ) => {
                                    event.currentTarget.style.borderColor =
                                        selected
                                            ? colors.accent
                                            : colors.border;
                                }}
                            >
                                {/* Icon */}
                                <div
                                    style={{
                                        width: 34,
                                        height: 34,

                                        display:
                                            "grid",

                                        placeItems:
                                            "center",

                                        borderRadius:
                                            9,

                                        background:
                                            selected
                                                ? "rgba(59, 130, 246, 0.14)"
                                                : "rgba(139, 148, 158, 0.08)",

                                        color:
                                            selected
                                                ? colors.accent
                                                : colors.textSecondary,

                                        transition:
                                            "all .16s ease",
                                    }}
                                >
                                    <Icon
                                        size={19}
                                        strokeWidth={
                                            1.8
                                        }
                                    />
                                </div>

                                {/* Label */}
                                <span
                                    style={{
                                        fontSize:
                                            13,

                                        fontWeight:
                                            selected
                                                ? 600
                                                : 500,

                                        color:
                                            selected
                                                ? colors.text
                                                : colors.textSecondary,
                                    }}
                                >
                                    {
                                        option.label
                                    }
                                </span>

                                {/* Selected indicator */}
                                {selected && (
                                    <span
                                        style={{
                                            position:
                                                "absolute",

                                            top: 12,
                                            right: 12,

                                            width: 7,
                                            height: 7,

                                            borderRadius:
                                                "50%",

                                            background:
                                                colors.accent,

                                            boxShadow:
                                                "0 0 10px rgba(59, 130, 246, 0.45)",
                                        }}
                                    />
                                )}
                            </button>
                        );
                    },
                )}
            </div>
        </div>
    );
}