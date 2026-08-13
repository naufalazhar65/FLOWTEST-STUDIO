import type {
    ReactNode,
} from "react";

import { AlertTriangle } from "lucide-react";

import {
    colors,
    radius,
    spacing,
    typography,
} from "../../themes";

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
                    padding: spacing.xl,
                }}
            >
                {/* Header */}
                <div
                    style={{
                        display: "flex",

                        alignItems:
                            "flex-start",

                        gap: spacing.md,
                    }}
                >
                    {/* Warning Icon */}
                    <div
                        style={{
                            width: 42,

                            height: 42,

                            flexShrink: 0,

                            display: "grid",

                            placeItems:
                                "center",

                            borderRadius:
                                radius.md,

                            background:
                                "rgba(210, 153, 34, 0.10)",

                            border:
                                "1px solid rgba(210, 153, 34, 0.20)",

                            color:
                                colors.warning,
                        }}
                    >
                        <AlertTriangle
                            size={20}
                            strokeWidth={2}
                        />
                    </div>

                    {/* Content */}
                    <div
                        style={{
                            flex: 1,

                            minWidth: 0,
                        }}
                    >
                        <div
                            style={{
                                color:
                                    colors.text,

                                fontSize: 18,

                                fontWeight: 700,

                                lineHeight: 1.35,
                            }}
                        >
                            {title}
                        </div>

                        <div
                            style={{
                                marginTop:
                                    spacing.sm,

                                color:
                                    colors.textSecondary,

                                fontSize:
                                    typography.body
                                        .fontSize,

                                fontWeight:
                                    typography.body
                                        .fontWeight,

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

                        alignItems:
                            "center",

                        gap: spacing.sm,

                        marginTop:
                            spacing.xl,
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