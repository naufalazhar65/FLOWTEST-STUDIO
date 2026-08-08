import type { ReactNode } from "react";

import { AlertTriangle } from "lucide-react";

import { colors } from "../../themes";

import { Button } from "./Button";
import { Modal } from "./Modal";

interface Props {
    open: boolean;

    title: string;

    message: ReactNode;

    confirmLabel?: string;

    cancelLabel?: string;

    secondaryLabel?: string;

    onConfirm(): void;

    onCancel(): void;

    onSecondary?(): void;
}

export function ConfirmDialog({
    open,
    title,
    message,
    confirmLabel = "Confirm",
    cancelLabel = "Cancel",
    secondaryLabel,
    onConfirm,
    onCancel,
    onSecondary,
}: Props) {
    return (
        <Modal
            open={open}
            onClose={onCancel}
            width={460}
        >
            <div
                style={{
                    padding: 24,
                }}
            >
                {/* Header */}
                <div
                    style={{
                        display: "flex",
                        alignItems: "flex-start",
                        gap: 14,
                    }}
                >
                    {/* Warning Icon */}
                    <div
                        style={{
                            width: 40,
                            height: 40,

                            flexShrink: 0,

                            display: "grid",
                            placeItems: "center",

                            borderRadius: 10,

                            background:
                                "rgba(245, 158, 11, 0.10)",

                            border:
                                "1px solid rgba(245, 158, 11, 0.20)",

                            color: "#F59E0B",
                        }}
                    >
                        <AlertTriangle
                            size={20}
                        />
                    </div>

                    {/* Content */}
                    <div
                        style={{
                            flex: 1,
                        }}
                    >
                        <div
                            style={{
                                color:
                                    colors.text,

                                fontSize: 18,

                                fontWeight: 700,
                            }}
                        >
                            {title}
                        </div>

                        <div
                            style={{
                                marginTop: 8,

                                color:
                                    colors.textSecondary,

                                fontSize: 13,

                                lineHeight: 1.6,
                            }}
                        >
                            {message}
                        </div>
                    </div>
                </div>

                {/* Actions */}
                <div
                    style={{
                        display: "flex",

                        justifyContent:
                            "flex-end",

                        alignItems: "center",

                        gap: 8,

                        marginTop: 28,
                    }}
                >
                    <Button
                        variant="secondary"
                        onClick={onCancel}
                    >
                        {cancelLabel}
                    </Button>

                    {secondaryLabel &&
                        onSecondary && (
                            <Button
                                variant="secondary"
                                onClick={
                                    onSecondary
                                }
                            >
                                {
                                    secondaryLabel
                                }
                            </Button>
                        )}

                    <Button
                        variant="primary"
                        onClick={onConfirm}
                    >
                        {confirmLabel}
                    </Button>
                </div>
            </div>
        </Modal>
    );
}