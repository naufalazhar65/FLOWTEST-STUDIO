import {
    Layers3,
    X,
} from "lucide-react";
import {
    useEffect,
    useState,
} from "react";

import { useSuiteStore } from "../store/useSuiteStore";

import {
    colors,
    radius,
} from "../../../themes";

interface Props {
    open: boolean;
    onClose(): void;
}

export function CreateSuiteDialog({
    open,
    onClose,
}: Props) {
    const addSuite =
        useSuiteStore(
            (state) => state.addSuite,
        );

    const selectSuite =
        useSuiteStore(
            (state) => state.selectSuite,
        );

    const [name, setName] = useState("");
    const [description, setDescription] =
        useState("");
    const [error, setError] = useState("");

    useEffect(() => {
        if (!open) {
            return;
        }

        setName("");
        setDescription("");
        setError("");
    }, [open]);

    useEffect(() => {
        if (!open) {
            return;
        }

        const handleKeyDown = (
            event: KeyboardEvent,
        ) => {
            if (event.key === "Escape") {
                onClose();
            }
        };

        window.addEventListener(
            "keydown",
            handleKeyDown,
        );

        return () => {
            window.removeEventListener(
                "keydown",
                handleKeyDown,
            );
        };
    }, [open, onClose]);

    if (!open) {
        return null;
    }

    const handleCreate = () => {
        const trimmedName = name.trim();

        if (!trimmedName) {
            setError(
                "Suite name is required.",
            );
            return;
        }

        const suites =
            useSuiteStore.getState()
                .suites;

        const exists = suites.some(
            (suite) =>
                suite.name
                    .trim()
                    .toLowerCase() ===
                trimmedName.toLowerCase(),
        );

        if (exists) {
            setError(
                "A suite with this name already exists.",
            );
            return;
        }

        const now = new Date().toISOString();

        const suite = {
            id: crypto.randomUUID(),
            name: trimmedName,
            description: description.trim(),
            testCases: [],
            createdAt: now,
            updatedAt: now,
        };

        addSuite(suite);
        selectSuite(suite.id);
        onClose();
    };

    const handleKeyDown = (
        event: React.KeyboardEvent,
    ) => {
        if (
            event.key === "Enter" &&
            (event.metaKey ||
                event.ctrlKey)
        ) {
            event.preventDefault();
            handleCreate();
        }
    };

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
                zIndex: 1000,
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
                aria-labelledby="create-suite-title"
                onKeyDown={handleKeyDown}
                style={{
                    width: "100%",
                    maxWidth: 480,
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
                        justifyContent:
                            "space-between",
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
                                justifyContent:
                                    "center",
                                borderRadius: 7,
                                background:
                                    colors.panelHover,
                                color: colors.accent,
                            }}
                        >
                            <Layers3 size={15} />
                        </div>

                        <div>
                            <div
                                id="create-suite-title"
                                style={{
                                    color:
                                        colors.text,
                                    fontSize: 13,
                                    fontWeight: 650,
                                }}
                            >
                                Create Test Suite
                            </div>

                            <div
                                style={{
                                    marginTop: 2,
                                    color:
                                        colors.textMuted,
                                    fontSize: 10,
                                }}
                            >
                                Group flows for reusable
                                execution
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
                            justifyContent:
                                "center",
                            border:
                                "1px solid transparent",
                            borderRadius: 6,
                            background:
                                "transparent",
                            color:
                                colors.textMuted,
                            cursor: "pointer",
                        }}
                    >
                        <X size={16} />
                    </button>
                </header>

                <div style={{ padding: 18 }}>
                    <Field
                        label="Name"
                        required
                    >
                        <input
                            autoFocus
                            value={name}
                            onChange={(event) => {
                                setName(
                                    event.target.value,
                                );

                                if (error) {
                                    setError("");
                                }
                            }}
                            placeholder="e.g. Login Regression"
                            style={inputStyle}
                        />
                    </Field>

                    <Field label="Description">
                        <textarea
                            value={description}
                            onChange={(event) =>
                                setDescription(
                                    event.target.value,
                                )
                            }
                            placeholder="Describe what this suite validates..."
                            rows={4}
                            style={{
                                ...inputStyle,
                                minHeight: 92,
                                padding: "9px 10px",
                                resize: "vertical",
                                lineHeight: 1.5,
                            }}
                        />
                    </Field>

                    {error && (
                        <div
                            style={{
                                marginTop: 2,
                                padding: "8px 10px",
                                border:
                                    "1px solid rgba(248,81,73,.25)",
                                borderRadius:
                                    radius.md,
                                background:
                                    "rgba(248,81,73,.08)",
                                color: "#F85149",
                                fontSize: 11,
                                lineHeight: 1.4,
                            }}
                        >
                            {error}
                        </div>
                    )}
                </div>

                <footer
                    style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent:
                            "flex-end",
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
                            borderRadius:
                                radius.md,
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
                        onClick={handleCreate}
                        style={{
                            height: 32,
                            padding: "0 12px",
                            border:
                                "1px solid transparent",
                            borderRadius:
                                radius.md,
                            background:
                                colors.accent,
                            color: "#FFFFFF",
                            cursor: "pointer",
                            fontSize: 11,
                            fontWeight: 650,
                        }}
                    >
                        Create Suite
                    </button>
                </footer>
            </div>
        </div>
    );
}

function Field({
    label,
    required = false,
    children,
}: {
    label: string;
    required?: boolean;
    children: React.ReactNode;
}) {
    return (
        <label
            style={{
                display: "flex",
                flexDirection: "column",
                gap: 6,
                marginBottom: 14,
            }}
        >
            <span
                style={{
                    color: colors.textSecondary,
                    fontSize: 11,
                    fontWeight: 600,
                }}
            >
                {label}

                {required && (
                    <span
                        style={{
                            marginLeft: 3,
                            color: "#F85149",
                        }}
                    >
                        *
                    </span>
                )}
            </span>

            {children}
        </label>
    );
}

const inputStyle: React.CSSProperties = {
    width: "100%",
    minHeight: 34,
    boxSizing: "border-box",
    padding: "0 10px",
    border: `1px solid ${colors.border}`,
    borderRadius: radius.md,
    outline: "none",
    background: colors.background,
    color: colors.text,
    fontSize: 12,
};