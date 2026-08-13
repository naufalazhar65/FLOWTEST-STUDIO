import type {
    ReactNode,
} from "react";

import {
    spacing,
} from "../../themes";

interface Props {
    children: ReactNode;
}

export function DialogBody({
    children,
}: Props) {
    return (
        <div
            style={{
                padding:
                    spacing.xl,

                display: "flex",

                flexDirection:
                    "column",

                gap: spacing.lg,

                minHeight: 0,

                overflowY: "auto",
            }}
        >
            {children}
        </div>
    );
}