import {
    useRef,
    type CSSProperties,
    type ReactNode,
} from "react";

import {
    animation,
    colors,
    radius,
    spacing,
    typography,
} from "../../themes";

interface SidebarButtonProps {
    icon: ReactNode;

    label: string;

    subtitle?: string;

    color?: string;

    onClick?: () => void;

    disabled?: boolean;
}

export function SidebarButton({
    icon,
    label,
    subtitle = "Click to add component",
    color = colors.accentHover,
    onClick,
    disabled,
}: SidebarButtonProps) {
    const iconRef =
        useRef<HTMLDivElement>(null);

    return (
        <button
            type="button"
            onClick={onClick}
            disabled={disabled}
            style={buttonStyle(disabled)}
            onMouseEnter={(event) => {
                if (disabled) {
                    return;
                }

                const glow =
                    `${color}28`;

                event.currentTarget.style.background =
                    colors.panelHover;

                event.currentTarget.style.borderColor =
                    `${color}66`;

                event.currentTarget.style.transform =
                    "translateY(-1px)";

                event.currentTarget.style.boxShadow =
                    `0 4px 14px ${glow}`;

                if (iconRef.current) {
                    iconRef.current.style.transform =
                        "scale(1.04)";

                    iconRef.current.style.boxShadow =
                        `0 0 8px ${glow}`;
                }
            }}
            onMouseLeave={(event) => {
                if (disabled) {
                    return;
                }

                event.currentTarget.style.background =
                    colors.background;

                event.currentTarget.style.borderColor =
                    colors.border;

                event.currentTarget.style.transform =
                    "translateY(0)";

                event.currentTarget.style.boxShadow =
                    "none";

                if (iconRef.current) {
                    iconRef.current.style.transform =
                        "scale(1)";

                    iconRef.current.style.boxShadow =
                        "none";
                }
            }}
        >
            <div
                ref={iconRef}
                style={iconContainer(color)}
            >
                {icon}
            </div>

            <div style={content}>
                <div style={title}>
                    {label}
                </div>

                <div style={subtitleStyle}>
                    {subtitle}
                </div>
            </div>
        </button>
    );
}

function buttonStyle(
    disabled?: boolean,
): CSSProperties {
    return {
        width: "100%",

        display: "flex",

        alignItems: "center",

        gap: spacing.md,

        padding:
            `${spacing.sm + 2}px ${spacing.md}px`,

        marginBottom: spacing.sm,

        borderRadius: radius.md,

        border:
            `1px solid ${colors.border}`,

        background: disabled
            ? colors.panel
            : colors.background,

        color: disabled
            ? colors.textMuted
            : colors.text,

        cursor: disabled
            ? "not-allowed"
            : "pointer",

        transition:
            `background ${animation.fast}, border-color ${animation.fast}, transform ${animation.fast}, box-shadow ${animation.fast}`,

        textAlign: "left",

        boxSizing: "border-box",

        userSelect: "none",

        opacity: disabled
            ? 0.55
            : 1,

        outline: "none",
    };
}

function iconContainer(
    color: string,
): CSSProperties {
    return {
        width: 38,

        height: 38,

        borderRadius: radius.sm,

        background: `${color}18`,

        border:
            `1px solid ${color}45`,

        display: "flex",

        alignItems: "center",

        justifyContent: "center",

        flexShrink: 0,

        color,

        transition:
            `transform ${animation.fast}, box-shadow ${animation.fast}`,
    };
}

const content: CSSProperties = {
    flex: 1,

    minWidth: 0,

    display: "flex",

    flexDirection: "column",

    justifyContent: "center",

    overflow: "hidden",
};

const title: CSSProperties = {
    color: colors.text,

    fontSize:
        typography.body.fontSize,

    fontWeight:
        typography.subtitle.fontWeight,

    lineHeight: 1.25,

    display: "-webkit-box",

    WebkitBoxOrient: "vertical",

    WebkitLineClamp: 1,

    overflow: "hidden",

    textOverflow: "ellipsis",

    wordBreak: "break-word",
};

const subtitleStyle: CSSProperties = {
    marginTop: spacing.xs,

    color:
        colors.textSecondary,

    fontSize:
        typography.tiny.fontSize,

    fontWeight:
        typography.tiny.fontWeight,

    lineHeight: 1.3,

    display: "-webkit-box",

    WebkitBoxOrient: "vertical",

    WebkitLineClamp: 1,

    overflow: "hidden",

    textOverflow: "ellipsis",

    wordBreak: "break-word",
};