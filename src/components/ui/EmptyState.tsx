import type {
    ReactNode,
} from "react";

import {
    colors,
    spacing,
    typography,
} from "../../themes";

interface Props {
    icon?: ReactNode;

    title: string;

    description?: string;
}

export function EmptyState({
    icon,
    title,
    description,
}: Props) {
    return (
        <div
            style={{
                height: "100%",

                display: "flex",

                flexDirection: "column",

                justifyContent: "center",

                alignItems: "center",

                gap: spacing.md,

                color:
                    colors.textSecondary,

                textAlign: "center",

                padding: spacing.xxl,
            }}
        >
            {icon && (
                <div
                    style={{
                        display: "flex",

                        alignItems: "center",

                        justifyContent: "center",

                        color:
                            colors.textSecondary,

                        opacity: 0.85,
                    }}
                >
                    {icon}
                </div>
            )}

            <div
                style={{
                    color: colors.text,

                    fontSize:
                        typography.subtitle
                            .fontSize,

                    fontWeight:
                        typography.subtitle
                            .fontWeight,

                    lineHeight: 1.4,
                }}
            >
                {title}
            </div>

            {description && (
                <div
                    style={{
                        maxWidth: 360,

                        color:
                            colors.textSecondary,

                        fontSize:
                            typography.body
                                .fontSize,

                        fontWeight:
                            typography.body
                                .fontWeight,

                        lineHeight: 1.5,
                    }}
                >
                    {description}
                </div>
            )}
        </div>
    );
}