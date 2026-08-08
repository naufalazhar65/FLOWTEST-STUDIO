import type {
    ReactNode,
} from "react";

import {
    colors,
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

                gap: 10,

                color: colors.textSecondary,

                textAlign: "center",

                padding: 32,
            }}
        >
            {icon}

            <div
                style={{
                    color: colors.text,

                    fontWeight: 600,
                }}
            >
                {title}
            </div>

            {description && (
                <div
                    style={{
                        fontSize: 13,
                    }}
                >
                    {description}
                </div>
            )}
        </div>
    );
}