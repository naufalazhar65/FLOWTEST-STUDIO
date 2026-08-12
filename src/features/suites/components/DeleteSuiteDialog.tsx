import {
    AlertTriangle,
    X,
} from "lucide-react";

import type { TestSuite } from "../types/TestSuite";

import {
    colors,
    radius,
} from "../../../themes";

interface Props {
    suite: TestSuite;
    open: boolean;
    onClose(): void;
    onConfirm(): void;
}

export function DeleteSuiteDialog({
    suite,
    open,
    onClose,
    onConfirm,
}: Props) {
    if (!open) {
        return null;
    }

    return (
        <div
            role="presentation"
            onMouseDown={(event) => {
                if (
                    event.target ===
                    event.currentTarget
                ) {
                    onClose();
                }
            }}
            style={{
                position: "fixed",
                inset: 0,
                zIndex: 1100,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: 20,
                background:
                    "rgba(0, 0, 0, 0.58)",
                backdropFilter: "blur(4px)",
            }}
        >
            <div
                role="dialog"
                aria-modal="true"
                aria-labelledby="delete-suite-title"
                style={{
                    width: "100%",
                    maxWidth: 420,
                    border:
                        `1px solid ${colors.border}`,
                    borderRadius: radius.lg,
                    background: colors.panel,
                    boxShadow:
                        "0 24px 70px rgba(0,0,0,.45)",
                    overflow: "hidden",
                }}
            >
                <header
                    style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        padding: "15px 16px",
                        borderBottom:
                            `1px solid ${colors.border}`,
                    }}
                >
                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 9,
                        }}
                    >
                        <div
                            style={{
                                width: 28,
                                height: 28,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                borderRadius: 7,
                                background:
                                    "rgba(248,81,73,.10)",
                                color: "#F85149",
                            }}
                        >
                            <AlertTriangle size={15} />
                        </div>

                        <div>
                            <div
                                id="delete-suite-title"
                                style={{
                                    color: colors.text,
                                    fontSize: 13,
                                    fontWeight: 650,
                                }}
                            >
                                Delete Test Suite?
                            </div>

                            <div
                                style={{
                                    marginTop: 2,
                                    color:
                                        colors.textMuted,
                                    fontSize: 10,
                                }}
                            >
                                This action cannot be undone.
                            </div>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        aria-label="Close"
                        style={{
                            width: 28,
                            height: 28,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            border:
                                "1px solid transparent",
                            borderRadius: 6,
                            background: "transparent",
                            color: colors.textMuted,
                            cursor: "pointer",
                        }}
                    >
                        <X size={16} />
                    </button>
                </header>

                <div style={{ padding: 18 }}>
                    <div
                        style={{
                            color:
                                colors.textSecondary,
                            fontSize: 11,
                            lineHeight: 1.6,
                        }}
                    >
                        You are about to delete
                        <strong
                            style={{
                                color: colors.text,
                            }}
                        >
                            {" "}
                            "{suite.name}"
                        </strong>
                        .
                    </div>

                    <div
                        style={{
                            marginTop: 10,
                            padding: "9px 10px",
                            border:
                                "1px solid rgba(248,81,73,.22)",
                            borderRadius: radius.md,
                            background:
                                "rgba(248,81,73,.07)",
                            color:
                                colors.textMuted,
                            fontSize: 10,
                            lineHeight: 1.5,
                        }}
                    >
                        This will remove the suite,
                        its test case list, and its
                        stored run history. Your
                        underlying Flow Projects will
                        not be deleted.
                    </div>
                </div>

                <footer
                    style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "flex-end",
                        gap: 8,
                        padding: "12px 16px",
                        borderTop:
                            `1px solid ${colors.border}`,
                        background:
                            colors.background,
                    }}
                >
                    <button
                        type="button"
                        onClick={onClose}
                        style={{
                            height: 32,
                            padding: "0 11px",
                            border:
                                `1px solid ${colors.border}`,
                            borderRadius: radius.md,
                            background:
                                colors.panel,
                            color:
                                colors.textSecondary,
                            cursor: "pointer",
                            fontSize: 11,
                            fontWeight: 600,
                        }}
                    >
                        Cancel
                    </button>

                    <button
                        type="button"
                        onClick={onConfirm}
                        style={{
                            height: 32,
                            padding: "0 12px",
                            border:
                                "1px solid transparent",
                            borderRadius: radius.md,
                            background: "#F85149",
                            color: "#FFFFFF",
                            cursor: "pointer",
                            fontSize: 11,
                            fontWeight: 650,
                        }}
                    >
                        Delete Suite
                    </button>
                </footer>
            </div>
        </div>
    );
}