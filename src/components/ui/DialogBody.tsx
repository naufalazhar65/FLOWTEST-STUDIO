import type {
    ReactNode,
} from "react";

interface Props {
    children: ReactNode;
}

export function DialogBody({
    children,
}: Props) {
    return (
        <div
            style={{
                padding: 24,

                display: "flex",

                flexDirection: "column",

                gap: 20,
            }}
        >
            {children}
        </div>
    );
}