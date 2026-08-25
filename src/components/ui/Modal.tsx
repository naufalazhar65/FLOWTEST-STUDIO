import type {
    CSSProperties,
    ReactNode,
} from "react";

import {
    animation,
    colors,
    radius,
    shadow,
    spacing,
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

                justifyContent:
                    "center",

                padding:
                    spacing.lg,

                boxSizing:
                    "border-box",

                background:
                    colors.overlay,

                backdropFilter:
                    "blur(8px)",

                animation:
                    `modal-overlay-in ${animation.fast}`,
            }}
        >
            <div
                onClick={(event) =>
                    event.stopPropagation()
                }
                style={{
                    width: "100%",

                    maxWidth:
                        width,

                    maxHeight:
                        "calc(100vh - 48px)",

                    display:
                        "flex",

                    flexDirection:
                        "column",

                    minHeight: 0,

                    background:
                        colors.panel,

                    border:
                        `1px solid ${colors.border}`,

                    borderRadius:
                        radius.xl,

                    boxShadow:
                        shadow.floating,

                    overflow:
                        "hidden",

                    ...style,
                }}
            >
                {children}
            </div>
        </div>
    );
}