import type {
    CSSProperties,
    InputHTMLAttributes,
} from "react";

import {
    animation,
    colors,
    radius,
    spacing,
    typography,
} from "../../themes";

interface Props
    extends InputHTMLAttributes<HTMLInputElement> {
    label?: string;

    helperText?: string;

    error?: string;

    fullWidth?: boolean;

    containerStyle?: CSSProperties;
}

export function Input({
    label,
    helperText,
    error,
    fullWidth = true,
    containerStyle,
    style,
    onFocus,
    onBlur,
    ...props
}: Props) {
    return (
        <div
            style={{
                display: "flex",

                flexDirection:
                    "column",

                gap: spacing.sm,

                width: fullWidth
                    ? "100%"
                    : undefined,

                ...containerStyle,
            }}
        >
            {label && (
                <label
                    style={{
                        color:
                            colors.text,

                        fontSize:
                            typography.body
                                .fontSize,

                        fontWeight:
                            typography.subtitle
                                .fontWeight,

                        lineHeight: 1.4,
                    }}
                >
                    {label}
                </label>
            )}

            <input
                {...props}
                style={{
                    width: "100%",

                    height: 42,

                    boxSizing:
                        "border-box",

                    padding:
                        `0 ${spacing.md}px`,

                    background:
                        colors.background,

                    border:
                        `1px solid ${
                            error
                                ? colors.danger
                                : colors.border
                        }`,

                    borderRadius:
                        radius.md,

                    color:
                        colors.text,

                    fontSize:
                        typography.body
                            .fontSize,

                    fontWeight:
                        typography.body
                            .fontWeight,

                    lineHeight: 1,

                    outline: "none",

                    transition:
                        `border-color ${animation.fast}, box-shadow ${animation.fast}`,

                    ...style,
                }}
                onFocus={(event) => {
                    event.currentTarget.style
                        .borderColor =
                        error
                            ? colors.danger
                            : colors.focus;

                    event.currentTarget.style
                        .boxShadow =
                        `0 0 0 2px ${
                            error
                                ? `${colors.danger}33`
                                : colors.selection
                        }`;

                    onFocus?.(event);
                }}
                onBlur={(event) => {
                    event.currentTarget.style
                        .borderColor =
                        error
                            ? colors.danger
                            : colors.border;

                    event.currentTarget.style
                        .boxShadow =
                        "none";

                    onBlur?.(event);
                }}
            />

            {error ? (
                <span
                    style={{
                        color:
                            colors.danger,

                        fontSize:
                            typography.caption
                                .fontSize,

                        fontWeight:
                            typography.caption
                                .fontWeight,

                        lineHeight: 1.4,
                    }}
                >
                    {error}
                </span>
            ) : (
                helperText && (
                    <span
                        style={{
                            color:
                                colors.textSecondary,

                            fontSize:
                                typography.caption
                                    .fontSize,

                            fontWeight:
                                typography.body
                                    .fontWeight,

                            lineHeight: 1.4,
                        }}
                    >
                        {helperText}
                    </span>
                )
            )}
        </div>
    );
}