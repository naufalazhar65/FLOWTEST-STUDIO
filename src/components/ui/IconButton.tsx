import type {
    ButtonHTMLAttributes,
    ReactNode,
} from "react";

import {
    animation,
    colors,
    radius,
} from "../../themes";

interface Props
    extends ButtonHTMLAttributes<HTMLButtonElement> {
    icon: ReactNode;

    active?: boolean;
}

export function IconButton({
    icon,
    active = false,
    disabled,
    ...props
}: Props) {
    return (
        <button
            {...props}
            disabled={disabled}
            style={{
                width: 34,
                height: 34,

                display: "flex",
                alignItems: "center",
                justifyContent: "center",

                borderRadius: radius.md,

                border: `1px solid ${colors.border}`,

                background: active
                    ? colors.accent
                    : colors.panel,

                color: active
                    ? "#FFF"
                    : colors.textSecondary,

                cursor: disabled
                    ? "not-allowed"
                    : "pointer",

                transition: animation.fast,

                opacity: disabled ? .5 : 1,
            }}
        >
            {icon}
        </button>
    );
}