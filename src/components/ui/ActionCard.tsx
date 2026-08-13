import type {
    CSSProperties,
    ReactNode,
} from "react";

import {
    animation,
    colors,
    radius,
    shadow,
    spacing,
    typography,
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

                flexDirection:
                    "column",

                gap: spacing.lg,

                padding: spacing.xl,

                background:
                    `linear-gradient(
                        145deg,
                        ${colors.panel},
                        ${colors.background}
                    )`,

                border:
                    `1px solid ${colors.border}`,

                borderRadius:
                    radius.lg,

                boxShadow:
                    shadow.card,

                cursor: "pointer",

                transition:
                    `transform ${animation.fast}, border-color ${animation.fast}, box-shadow ${animation.fast}`,

                userSelect: "none",

                overflow: "hidden",

                ...style,
            }}
            onMouseEnter={(event) => {
                event.currentTarget.style
                    .transform =
                    "translateY(-3px)";

                event.currentTarget.style
                    .borderColor =
                    colors.accent;

                event.currentTarget.style
                    .boxShadow =
                    shadow.floating;
            }}
            onMouseLeave={(event) => {
                event.currentTarget.style
                    .transform =
                    "translateY(0)";

                event.currentTarget.style
                    .borderColor =
                    colors.border;

                event.currentTarget.style
                    .boxShadow =
                    shadow.card;
            }}
        >
            {/* Subtle accent glow */}
            <div
                style={{
                    position:
                        "absolute",

                    top: -80,

                    right: -80,

                    width: 180,

                    height: 180,

                    borderRadius:
                        radius.full,

                    background:
                        "rgba(47, 129, 247, 0.06)",

                    filter:
                        "blur(45px)",

                    pointerEvents:
                        "none",
                }}
            />

            {/* Icon */}
            <div
                style={{
                    position:
                        "relative",

                    width: 54,

                    height: 54,

                    flexShrink: 0,

                    display: "grid",

                    placeItems:
                        "center",

                    borderRadius:
                        radius.lg,

                    background:
                        colors.selection,

                    border:
                        `1px solid ${colors.focus}2E`,

                    color:
                        colors.accentHover,

                    boxShadow:
                        "inset 0 1px rgba(255,255,255,0.04)",
                }}
            >
                {icon}
            </div>

            {/* Content */}
            <div
                style={{
                    position:
                        "relative",
                }}
            >
                <div
                    style={{
                        color:
                            colors.text,

                        fontSize: 18,

                        fontWeight:
                            typography.title
                                .fontWeight,

                        lineHeight: 1.35,

                        letterSpacing:
                            "-0.01em",
                    }}
                >
                    {title}
                </div>

                <div
                    style={{
                        marginTop:
                            spacing.sm,

                        color:
                            colors.textSecondary,

                        fontSize:
                            typography.body
                                .fontSize,

                        fontWeight:
                            typography.body
                                .fontWeight,

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

                        marginTop:
                            "auto",

                        display:
                            "flex",

                        justifyContent:
                            "flex-end",
                    }}
                >
                    <div
                        style={{
                            padding:
                                `${spacing.xs + 1}px ${spacing.sm + 1}px`,

                            borderRadius:
                                radius.sm,

                            background:
                                colors.background,

                            border:
                                `1px solid ${colors.border}`,

                            color:
                                colors.textSecondary,

                            fontSize:
                                typography.tiny
                                    .fontSize,

                            fontWeight:
                                typography.caption
                                    .fontWeight,

                            lineHeight: 1.2,

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