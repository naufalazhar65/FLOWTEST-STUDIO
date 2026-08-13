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
    style,
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

                flexShrink: 0,

                borderRadius:
                    radius.md,

                border:
                    `1px solid ${
                        active
                            ? colors.accent
                            : colors.border
                    }`,

                background: active
                    ? colors.accent
                    : colors.panel,

                color: active
                    ? colors.text
                    : colors.textSecondary,

                cursor: disabled
                    ? "not-allowed"
                    : "pointer",

                opacity: disabled
                    ? 0.5
                    : 1,

                transition:
                    `background ${animation.fast}, ` +
                    `border-color ${animation.fast}, ` +
                    `color ${animation.fast}, ` +
                    `transform ${animation.fast}`,

                userSelect: "none",

                ...style,
            }}
            onMouseEnter={(event) => {
                if (disabled) {
                    return;
                }

                event.currentTarget.style.background =
                    active
                        ? colors.accentHover
                        : colors.panelHover;

                event.currentTarget.style.borderColor =
                    active
                        ? colors.accentHover
                        : colors.borderLight;

                event.currentTarget.style.color =
                    colors.text;

                event.currentTarget.style.transform =
                    "translateY(-1px)";
            }}
            onMouseLeave={(event) => {
                if (disabled) {
                    return;
                }

                event.currentTarget.style.background =
                    active
                        ? colors.accent
                        : colors.panel;

                event.currentTarget.style.borderColor =
                    active
                        ? colors.accent
                        : colors.border;

                event.currentTarget.style.color =
                    active
                        ? colors.text
                        : colors.textSecondary;

                event.currentTarget.style.transform =
                    "translateY(0)";
            }}
        >
            {icon}
        </button>
    );
}