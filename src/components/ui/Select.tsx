import type {
    SelectHTMLAttributes,
} from "react";

import {
    animation,
    colors,
    radius,
    spacing,
    typography,
} from "../../themes";

type Props =
    SelectHTMLAttributes<HTMLSelectElement>;

export function Select({
    style,
    disabled,
    ...props
}: Props) {
    return (
        <select
            {...props}
            disabled={disabled}
            style={{
                width: "100%",

                height: 42,

                boxSizing:
                    "border-box",

                padding:
                    `0 ${spacing.md}px`,

                background:
                    disabled
                        ? colors.panel
                        : colors.background,

                border:
                    `1px solid ${colors.border}`,

                borderRadius:
                    radius.md,

                color:
                    disabled
                        ? colors.textSecondary
                        : colors.text,

                fontSize:
                    typography.body
                        .fontSize,

                fontWeight:
                    typography.body
                        .fontWeight,

                outline: "none",

                cursor:
                    disabled
                        ? "not-allowed"
                        : "pointer",

                opacity:
                    disabled
                        ? 0.6
                        : 1,

                transition:
                    `border-color ${animation.fast}, box-shadow ${animation.fast}`,

                ...style,
            }}
            onFocus={(event) => {
                event.currentTarget.style
                    .borderColor =
                    colors.focus;

                event.currentTarget.style
                    .boxShadow =
                    `0 0 0 2px ${colors.selection}`;

                props.onFocus?.(event);
            }}
            onBlur={(event) => {
                event.currentTarget.style
                    .borderColor =
                    colors.border;

                event.currentTarget.style
                    .boxShadow =
                    "none";

                props.onBlur?.(event);
            }}
        />
    );
}