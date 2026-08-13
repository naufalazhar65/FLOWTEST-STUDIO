import type {
    ReactNode,
} from "react";

import {
    colors,
    spacing,
    typography,
} from "../../themes";

interface Props {
    children: ReactNode;
}

export function SectionTitle({
    children,
}: Props) {
    return (
        <div
            style={{
                marginBottom:
                    spacing.md,

                color:
                    colors.text,

                fontSize:
                    typography.subtitle
                        .fontSize,

                fontWeight:
                    typography.title
                        .fontWeight,

                lineHeight: 1.4,

                letterSpacing:
                    0.2,
            }}
        >
            {children}
        </div>
    );
}