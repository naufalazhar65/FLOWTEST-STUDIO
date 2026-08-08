import type {
    CSSProperties,
    ReactNode,
} from "react";

import {
    colors,
    radius,
    shadow,
} from "../../themes";

interface ModalProps {
    open: boolean;

    children: ReactNode;

    width?: number;

    onClose?: () => void;

    style?: CSSProperties;
}

export function Modal({
    open,
    children,
    width = 560,
    onClose,
    style,
}: ModalProps) {
    if (!open) {
        return null;
    }

    return (
        <div
            onClick={onClose}
            style={{
                position: "fixed",
                inset: 0,

                zIndex: 9999,

                display: "flex",
                alignItems: "center",
                justifyContent: "center",

                background: "rgba(0,0,0,.55)",

                backdropFilter: "blur(8px)",
            }}
        >
            <div
                onClick={(e) =>
                    e.stopPropagation()
                }
                style={{
                    width,

                    background:
                        colors.panel,

                    border: `1px solid ${colors.border}`,

                    borderRadius:
                        radius.xl,

                    boxShadow:
                        shadow.floating,

                    overflow: "hidden",

                    ...style,
                }}
            >
                {children}
            </div>
        </div>
    );
}