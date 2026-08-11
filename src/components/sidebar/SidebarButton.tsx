import {
    useRef,
    type CSSProperties,
    type ReactNode,
} from "react";

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
    color = "#58A6FF",
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
            style={buttonStyle(
                disabled,
            )}
            onMouseEnter={(e) => {
                if (disabled) return;

                const glow =
                    `${color}35`;

                e.currentTarget.style.background =
                    "#161B22";

                e.currentTarget.style.borderColor =
                    `${color}88`;

                e.currentTarget.style.transform =
                    "translateY(-1px)";

                e.currentTarget.style.boxShadow =
                    `0 4px 14px ${glow}`;

                if (iconRef.current) {
                    iconRef.current.style.transform =
                        "scale(1.05)";

                    iconRef.current.style.boxShadow =
                        `0 0 8px ${glow}`;
                }
            }}
            onMouseLeave={(e) => {
                if (disabled) return;

                e.currentTarget.style.background =
                    "#11161D";

                e.currentTarget.style.borderColor =
                    "#30363D";

                e.currentTarget.style.transform =
                    "translateY(0)";

                e.currentTarget.style.boxShadow =
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
                style={iconContainer(
                    color,
                )}
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

        gap: 14,

        padding:
            "12px",

        marginBottom: 10,

        borderRadius: 12,

        border:
            "1px solid #30363D",

        background: disabled
            ? "#161B22"
            : "#11161D",

        color: disabled
            ? "#555"
            : "#FFFFFF",

        cursor: disabled
            ? "not-allowed"
            : "pointer",

        transition:
            "all .16s ease",

        textAlign: "left",

        boxSizing:
            "border-box",
    };
}

function iconContainer(
    color: string,
): CSSProperties {
    return {
        width: 42,

        height: 42,

        borderRadius: 10,

        background: `${color}20`,

        border: `1px solid ${color}66`,

        display: "flex",

        alignItems: "center",

        justifyContent: "center",

        flexShrink: 0,

        color,

        transition:
            "transform .18s ease, box-shadow .18s ease",
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
    color: "#E6EDF3",

    fontSize: 14,

    fontWeight: 600,

    lineHeight: 1.25,

    display: "-webkit-box",

    WebkitBoxOrient: "vertical",

    WebkitLineClamp: 2,

    overflow: "hidden",

    wordBreak: "break-word",
};

const subtitleStyle: CSSProperties = {
    marginTop: 5,

    color: "#8B949E",

    fontSize: 12,

    lineHeight: 1.35,

    display: "-webkit-box",

    WebkitBoxOrient: "vertical",

    WebkitLineClamp: 2,

    overflow: "hidden",

    wordBreak: "break-word",
};