import type { ReactNode } from "react";

interface Props {
    children: ReactNode;
}

export function SectionTitle({
    children,
}: Props) {
    return (
        <div
            style={{
                marginBottom: 14,

                color: "#F0F6FC",

                fontSize: 15,

                fontWeight: 700,

                letterSpacing: .2,
            }}
        >
            {children}
        </div>
    );
}