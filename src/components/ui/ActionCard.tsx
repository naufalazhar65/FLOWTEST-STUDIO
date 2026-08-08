import type {
    CSSProperties,
    ReactNode,
} from "react";

import {
    colors,
    radius,
    shadow,
} from "../../themes";

interface Props {
    icon: ReactNode;

    title: string;

    description: string;

    shortcut?: string;

    onClick?: () => void;

    style?: CSSProperties;
}

export function ActionCard({
    icon,
    title,
    description,
    shortcut,
    onClick,
    style,
}: Props) {
    return (
        <div
            onClick={onClick}
            style={{
                position: "relative",

                width: 320,

                display: "flex",
                flexDirection: "column",

                gap: 18,

                padding: 24,

                background: `
                    linear-gradient(
                        145deg,
                        rgba(22, 27, 34, 0.96),
                        rgba(13, 17, 23, 0.96)
                    )
                `,

                border:
                    `1px solid ${colors.border}`,

                borderRadius:
                    radius.lg,

                boxShadow:
                    shadow.card,

                cursor: "pointer",

                transition:
                    "transform .18s ease, border-color .18s ease, box-shadow .18s ease",

                userSelect: "none",

                overflow: "hidden",

                ...style,
            }}
            onMouseEnter={(event) => {
                event.currentTarget.style.transform =
                    "translateY(-4px)";

                event.currentTarget.style.borderColor =
                    colors.accent;

                event.currentTarget.style.boxShadow =
                    shadow.floating;
            }}
            onMouseLeave={(event) => {
                event.currentTarget.style.transform =
                    "translateY(0)";

                event.currentTarget.style.borderColor =
                    colors.border;

                event.currentTarget.style.boxShadow =
                    shadow.card;
            }}
        >
            {/* Subtle accent glow */}
            <div
                style={{
                    position: "absolute",

                    top: -80,
                    right: -80,

                    width: 180,
                    height: 180,

                    borderRadius: "50%",

                    background:
                        "rgba(124, 92, 252, 0.06)",

                    filter:
                        "blur(45px)",

                    pointerEvents:
                        "none",
                }}
            />

            {/* Icon */}
            <div
                style={{
                    position: "relative",

                    width: 54,
                    height: 54,

                    display: "grid",
                    placeItems: "center",

                    borderRadius: 16,

                    background:
                        "rgba(124, 92, 252, 0.10)",

                    border:
                        "1px solid rgba(124, 92, 252, 0.18)",

                    color:
                        colors.accent,

                    boxShadow:
                        "inset 0 1px rgba(255,255,255,0.04)",
                }}
            >
                {icon}
            </div>

            {/* Content */}
            <div
                style={{
                    position: "relative",
                }}
            >
                <div
                    style={{
                        color: colors.text,

                        fontSize: 18,

                        fontWeight: 700,

                        letterSpacing:
                            "-0.01em",
                    }}
                >
                    {title}
                </div>

                <div
                    style={{
                        marginTop: 8,

                        color:
                            colors.textSecondary,

                        fontSize: 14,

                        lineHeight: 1.6,
                    }}
                >
                    {description}
                </div>
            </div>

            {/* Footer */}
            {shortcut && (
                <div
                    style={{
                        position:
                            "relative",

                        marginTop: "auto",

                        display: "flex",

                        justifyContent:
                            "flex-end",
                    }}
                >
                    <div
                        style={{
                            padding:
                                "5px 9px",

                            borderRadius: 7,

                            background:
                                colors.background,

                            border:
                                `1px solid ${colors.border}`,

                            color:
                                colors.textSecondary,

                            fontSize: 11,

                            fontWeight: 600,

                            letterSpacing:
                                "0.02em",

                            boxShadow:
                                "inset 0 1px rgba(255,255,255,0.03)",
                        }}
                    >
                        {shortcut}
                    </div>
                </div>
            )}
        </div>
    );
}