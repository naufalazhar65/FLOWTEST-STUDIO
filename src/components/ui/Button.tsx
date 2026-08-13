import type {
    ButtonHTMLAttributes,
    ReactNode,
} from "react";

import {
    animation,
    colors,
    radius,
    typography,
} from "../../themes";

type ButtonVariant =
    | "primary"
    | "secondary"
    | "danger"
    | "ghost";

type ButtonSize =
    | "sm"
    | "md"
    | "lg";

interface Props
    extends ButtonHTMLAttributes<HTMLButtonElement> {
    children: ReactNode;

    variant?: ButtonVariant;

    size?: ButtonSize;

    fullWidth?: boolean;
}

const SIZE = {
    sm: {
        height: 34,
        padding: "0 12px",
        fontSize: 13,
        minWidth: 80,
    },

    md: {
        height: 40,
        padding: "0 16px",
        fontSize: 14,
        minWidth: 96,
    },

    lg: {
        height: 46,
        padding: "0 22px",
        fontSize: 15,
        minWidth: 120,
    },
} satisfies Record<
    ButtonSize,
    {
        height: number;
        padding: string;
        fontSize: number;
        minWidth: number;
    }
>;

const VARIANT = {
    primary: {
        background: colors.accent,
        border: colors.accent,
        color: colors.text,

        hoverBackground:
            colors.accentHover,
        hoverBorder:
            colors.accentHover,
    },

    secondary: {
        background: colors.panel,
        border: colors.border,
        color: colors.text,

        hoverBackground:
            colors.panelHover,
        hoverBorder:
            colors.borderLight,
    },

    danger: {
        background: colors.danger,
        border: colors.danger,
        color: colors.text,

        hoverBackground:
            colors.danger,
        hoverBorder:
            colors.danger,
    },

    ghost: {
        background: "transparent",
        border: "transparent",
        color: colors.text,

        hoverBackground:
            colors.panelHover,
        hoverBorder:
            "transparent",
    },
} satisfies Record<
    ButtonVariant,
    {
        background: string;
        border: string;
        color: string;
        hoverBackground: string;
        hoverBorder: string;
    }
>;

export function Button({
    children,

    variant = "secondary",

    size = "md",

    fullWidth = false,

    disabled = false,

    style,

    ...props
}: Props) {
    const appearance =
        VARIANT[variant];

    const dimension =
        SIZE[size];

    return (
        <button
            {...props}
            disabled={disabled}
            style={{
                display: "inline-flex",

                alignItems: "center",

                justifyContent: "center",

                gap: 8,

                width: fullWidth
                    ? "100%"
                    : undefined,

                minWidth:
                    dimension.minWidth,

                height:
                    dimension.height,

                padding:
                    dimension.padding,

                borderRadius:
                    radius.md,

                border: `1px solid ${
                    disabled
                        ? colors.border
                        : appearance.border
                }`,

                background: disabled
                    ? colors.panel
                    : appearance.background,

                color: disabled
                    ? colors.textSecondary
                    : appearance.color,

                fontSize:
                    dimension.fontSize,

                fontWeight:
                    typography.subtitle
                        .fontWeight,

                lineHeight: 1,

                whiteSpace: "nowrap",

                cursor: disabled
                    ? "not-allowed"
                    : "pointer",

                opacity: disabled
                    ? 0.6
                    : 1,

                transition:
                    `background ${animation.fast}, ` +
                    `border-color ${animation.fast}, ` +
                    `transform ${animation.fast}`,

                userSelect: "none",

                ...style,
            }}
            onMouseEnter={(event) => {
                if (disabled) {
                    return;
                }

                event.currentTarget.style.background =
                    appearance.hoverBackground;

                event.currentTarget.style.borderColor =
                    appearance.hoverBorder;

                event.currentTarget.style.transform =
                    "translateY(-1px)";
            }}
            onMouseLeave={(event) => {
                if (disabled) {
                    return;
                }

                event.currentTarget.style.background =
                    appearance.background;

                event.currentTarget.style.borderColor =
                    appearance.border;

                event.currentTarget.style.transform =
                    "translateY(0)";
            }}
        >
            {children}
        </button>
    );
}