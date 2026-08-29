import { useEffect, useState } from "react";

import {
    colors,
    radius,
} from "../../../themes";

interface Props {
    open: boolean;
    locatorStrategy: string;
    locator: string;
    onCancel(): void;
    onConfirm(text: string): void;
}

export function AddInputDialog({
    open,
    locatorStrategy,
    locator,
    onCancel,
    onConfirm,
}: Props) {
    const [text, setText] =
        useState("");

    useEffect(() => {
        if (open) {
            setText("");
        }
    }, [open]);

    if (!open) {
        return null;
    }

    function handleSubmit(
        event: React.FormEvent,
    ) {
        event.preventDefault();

        if (!text.trim()) {
            return;
        }

        onConfirm(text);
    }

    return (
        <div
            style={{
                position: "fixed",
                inset: 0,
                zIndex: 1000,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background:
                    colors.overlay,
            }}
            onMouseDown={(event) => {
                if (
                    event.target ===
                    event.currentTarget
                ) {
                    onCancel();
                }
            }}
        >
            <form
                onSubmit={handleSubmit}
                style={{
                    width: 380,
                    maxWidth:
                        "calc(100vw - 32px)",
                    padding: 18,
                    border:
                        `1px solid ${colors.border}`,
                    borderRadius:
                        radius.md,
                    background:
                        colors.panel,
                    boxShadow:
                        "0 20px 50px rgba(0,0,0,.4)",
                }}
            >
                <div
                    style={{
                        color: colors.text,
                        fontSize: 15,
                        fontWeight: 600,
                        marginBottom: 4,
                    }}
                >
                    Add Input
                </div>

                <div
                    style={{
                        color:
                            colors.textSecondary,
                        fontSize: 11,
                        marginBottom: 16,
                    }}
                >
                    Create an Input node
                    using this locator.
                </div>

                <div
                    style={{
                        marginBottom: 14,
                    }}
                >
                    <div
                        style={{
                            marginBottom: 6,
                            color:
                                colors.textSecondary,
                            fontSize: 11,
                            fontWeight: 600,
                        }}
                    >
                        Locator
                    </div>

                    <div
                        style={{
                            padding:
                                "8px 10px",
                            borderRadius:
                                radius.xs,
                            background:
                                colors.background,
                            color: colors.text,
                            fontFamily:
                                "monospace",
                            fontSize: 11,
                            wordBreak:
                                "break-all",
                        }}
                    >
                        {locatorStrategy}=
                        {locator}
                    </div>
                </div>

                <div>
                    <label
                        htmlFor="add-input-text"
                        style={{
                            display:
                                "block",
                            marginBottom: 6,
                            color:
                                colors.textSecondary,
                            fontSize: 11,
                            fontWeight:
                                600,
                        }}
                    >
                        Text
                    </label>

                    <input
                        id="add-input-text"
                        autoFocus
                        value={text}
                        onChange={(event) =>
                            setText(
                                event.target
                                    .value,
                            )
                        }
                        placeholder="Enter text..."
                        style={{
                            width: "100%",
                            boxSizing:
                                "border-box",
                            padding:
                                "9px 10px",
                            border:
                                `1px solid ${colors.borderLight}`,
                            borderRadius:
                                radius.xs,
                            outline: "none",
                            background:
                                colors.background,
                            color:
                                colors.text,
                            fontSize: 12,
                        }}
                    />
                </div>

                <div
                    style={{
                        display:
                            "flex",
                        justifyContent:
                            "flex-end",
                        gap: 8,
                        marginTop: 18,
                    }}
                >
                    <button
                        type="button"
                        onClick={onCancel}
                        style={{
                            padding:
                                "8px 12px",
                            border:
                                `1px solid ${colors.borderLight}`,
                            borderRadius:
                                radius.xs,
                            background:
                                "transparent",
                            color:
                                colors.text,
                            cursor:
                                "pointer",
                            fontSize: 12,
                        }}
                    >
                        Cancel
                    </button>

                    <button
                        type="submit"
                        disabled={
                            !text.trim()
                        }
                        style={{
                            padding:
                                "8px 12px",
                            border:
                                `1px solid ${colors.accent}`,
                            borderRadius:
                                radius.xs,
                            background:
                                text.trim()
                                    ? colors.accent
                                    : colors.disabled,
                            color:
                                "#FFFFFF",
                            cursor:
                                text.trim()
                                    ? "pointer"
                                    : "default",
                            fontSize: 12,
                            fontWeight: 600,
                            opacity:
                                text.trim()
                                    ? 1
                                    : 0.6,
                        }}
                    >
                        Add Input
                    </button>
                </div>
            </form>
        </div>
    );
}