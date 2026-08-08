import type {
    ReactNode,
} from "react";

import { colors } from "../../themes";

interface Props {
    children: ReactNode;
}

export function DialogFooter({
    children,
}: Props) {
    return (
        <div
            style={{
                padding: 20,

                display: "flex",

                justifyContent:
                    "flex-end",

                gap: 12,

                borderTop: `1px solid ${colors.border}`,
            }}
        >
            {children}
        </div>
    );
}