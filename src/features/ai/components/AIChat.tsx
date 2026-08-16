import {
    useState,
    type FormEvent,
} from "react";

import {
    Send,
} from "lucide-react";

import type {
    AIFlowPlan,
} from "../types/AIFlowPlan";

import {
    useAIStore,
} from "../store/useAIStore";

import {
    AIFlowPreview,
} from "./AIFlowPreview";

import {
    AIMessage,
} from "./AIMessage";

import type {
    AIModificationOperationData,
    AIModificationPlan,
} from "../types/AIModificationPlan";

interface AIChatProps {
    draftPlan: AIFlowPlan | null;

    draftModificationPlan:
    AIModificationPlan | null;

    onApply(): void;

    onCancel(): void;
}

function ModificationOperationPreview({
    operation,
}: {
    operation:
        AIModificationOperationData;
}) {
    const step =
        "step" in operation
            ? operation.step
            : null;

    return (
        <>
            <div
                style={{
                    padding: 10,
                    border:
                        "1px solid #30363D",
                    borderRadius: 8,
                    background:
                        "#0D1117",
                }}
            >
                <div
                    style={{
                        marginBottom: 4,
                        color:
                            "#8B949E",
                        fontSize: 10,
                        textTransform:
                            "uppercase",
                        letterSpacing:
                            "0.04em",
                    }}
                >
                    Operation
                </div>

                <div
                    style={{
                        color:
                            operation.type ===
                            "deleteNode"
                                ? "#F85149"
                                : "#E6EDF3",
                        fontSize: 12,
                        fontWeight: 600,
                    }}
                >
                    {operation.type}
                </div>
            </div>

            <div
                style={{
                    padding: 10,
                    border:
                        "1px solid #30363D",
                    borderRadius: 8,
                    background:
                        "#0D1117",
                }}
            >
                <div
                    style={{
                        marginBottom: 4,
                        color:
                            "#8B949E",
                        fontSize: 10,
                        textTransform:
                            "uppercase",
                        letterSpacing:
                            "0.04em",
                    }}
                >
                    Target Node
                </div>

                <div
                    style={{
                        color:
                            "#E6EDF3",
                        fontSize: 11,
                        fontFamily:
                            "monospace",
                        wordBreak:
                            "break-all",
                    }}
                >
                    {
                        operation.targetNodeId
                    }
                </div>
            </div>

            {operation.type ===
            "deleteNode" ? (
                <div
                    style={{
                        padding: 10,
                        border:
                            "1px solid #3D1F1F",
                        borderRadius: 8,
                        background:
                            "#1A0F0F",
                    }}
                >
                    <div
                        style={{
                            marginBottom: 4,
                            color:
                                "#8B949E",
                            fontSize: 10,
                            textTransform:
                                "uppercase",
                            letterSpacing:
                                "0.04em",
                        }}
                    >
                        Action
                    </div>

                    <div
                        style={{
                            color:
                                "#F85149",
                            fontSize: 12,
                            fontWeight: 600,
                        }}
                    >
                        Delete Node
                    </div>
                </div>
            ) : step ? (
                <div
                    style={{
                        padding: 10,
                        border:
                            "1px solid #30363D",
                        borderRadius: 8,
                        background:
                            "#0D1117",
                    }}
                >
                    <div
                        style={{
                            marginBottom: 8,
                            color:
                                "#8B949E",
                            fontSize: 10,
                            textTransform:
                                "uppercase",
                            letterSpacing:
                                "0.04em",
                        }}
                    >
                        Step
                    </div>

                    <div
                        style={{
                            color:
                                "#E6EDF3",
                            fontSize: 12,
                            fontWeight: 600,
                        }}
                    >
                        {step.title ||
                            step.action}
                    </div>

                    {step.description && (
                        <div
                            style={{
                                marginTop: 3,
                                color:
                                    "#8B949E",
                                fontSize: 11,
                                lineHeight: 1.4,
                            }}
                        >
                            {
                                step.description
                            }
                        </div>
                    )}

                    <div
                        style={{
                            marginTop: 8,
                            display:
                                "flex",
                            flexWrap:
                                "wrap",
                            gap: 6,
                        }}
                    >
                        <span
                            style={{
                                padding:
                                    "2px 6px",
                                borderRadius:
                                    5,
                                background:
                                    "#21262D",
                                color:
                                    "#A371F7",
                                fontSize: 10,
                            }}
                        >
                            {step.action}
                        </span>

                        {step.locatorStrategy && (
                            <span
                                style={{
                                    padding:
                                        "2px 6px",
                                    borderRadius:
                                        5,
                                    background:
                                        "#21262D",
                                    color:
                                        "#8B949E",
                                    fontSize: 10,
                                }}
                            >
                                {
                                    step.locatorStrategy
                                }
                            </span>
                        )}

                        {step.locator && (
                            <span
                                style={{
                                    maxWidth:
                                        "100%",
                                    overflow:
                                        "hidden",
                                    textOverflow:
                                        "ellipsis",
                                    whiteSpace:
                                        "nowrap",
                                    padding:
                                        "2px 6px",
                                    borderRadius:
                                        5,
                                    background:
                                        "#21262D",
                                    color:
                                        "#8B949E",
                                    fontSize: 10,
                                }}
                            >
                                {step.locator}
                            </span>
                        )}

                        {step.text !==
                            undefined &&
                            step.text !==
                                null && (
                                <span
                                    style={{
                                        maxWidth:
                                            "100%",
                                        overflow:
                                            "hidden",
                                        textOverflow:
                                            "ellipsis",
                                        whiteSpace:
                                            "nowrap",
                                        padding:
                                            "2px 6px",
                                        borderRadius:
                                            5,
                                        background:
                                            "#21262D",
                                        color:
                                            "#8B949E",
                                        fontSize: 10,
                                    }}
                                >
                                    text=
                                    {step.text}
                                </span>
                            )}
                    </div>
                </div>
            ) : null}
        </>
    );
}

function ModificationPreview({
    plan,
    onApply,
    onCancel,
}: {
    plan: AIModificationPlan;

    onApply(): void;

    onCancel(): void;
}) {
    const operations: AIModificationOperationData[] =
        Array.isArray(
            plan.operations,
        )
            ? plan.operations
            : plan.operation
                ? [plan.operation]
                : [];

    if (
        operations.length ===
        0
    ) {
        return null;
    }

    return (
        <div
            style={{
                marginTop: 12,
                padding: 12,
                border:
                    "1px solid #30363D",
                borderRadius: 10,
                background:
                    "#161B22",
            }}
        >
            <div
                style={{
                    marginBottom: 8,
                    color:
                        "#E6EDF3",
                    fontSize: 13,
                    fontWeight: 600,
                }}
            >
                AI Flow Modification
            </div>

            <div
                style={{
                    marginBottom: 12,
                    color:
                        "#8B949E",
                    fontSize: 12,
                    lineHeight: 1.5,
                }}
            >
                {plan.summary}
            </div>

            {plan.warnings &&
                plan.warnings.length >
                    0 && (
                    <div
                        style={{
                            marginBottom:
                                12,
                            padding: 10,
                            border:
                                "1px solid #9A6700",
                            borderRadius: 8,
                            background:
                                "#2D2100",
                            color:
                                "#D29922",
                            fontSize: 11,
                            lineHeight: 1.5,
                        }}
                    >
                        <strong>
                            Review before applying
                        </strong>

                        <div
                            style={{
                                marginTop: 4,
                            }}
                        >
                            {plan.warnings.map(
                                (
                                    warning,
                                    index,
                                ) => (
                                    <div
                                        key={`${warning}-${index}`}
                                    >
                                        {
                                            warning
                                        }
                                    </div>
                                ),
                            )}
                        </div>
                    </div>
                )}

            <div
                style={{
                    display:
                        "flex",
                    flexDirection:
                        "column",
                    gap: 12,
                }}
            >
                {operations.map(
                    (
                        operation,
                        index,
                    ) => (
                        <div
                            key={`${operation.type}-${operation.targetNodeId}-${index}`}
                            style={{
                                display:
                                    "flex",
                                flexDirection:
                                    "column",
                                gap: 8,
                            }}
                        >
                            <ModificationOperationPreview
                                operation={
                                    operation
                                }
                            />
                        </div>
                    ),
                )}
            </div>

            <div
                style={{
                    display:
                        "flex",
                    justifyContent:
                        "flex-end",
                    gap: 8,
                    marginTop: 12,
                }}
            >
                <button
                    type="button"
                    onClick={
                        onCancel
                    }
                    style={{
                        padding:
                            "7px 12px",
                        border:
                            "1px solid #30363D",
                        borderRadius: 7,
                        background:
                            "transparent",
                        color:
                            "#8B949E",
                        fontSize: 12,
                        cursor:
                            "pointer",
                    }}
                >
                    Cancel
                </button>

                <button
                    type="button"
                    onClick={
                        onApply
                    }
                    style={{
                        padding:
                            "7px 12px",
                        border:
                            "1px solid #238636",
                        borderRadius: 7,
                        background:
                            "#238636",
                        color:
                            "#FFFFFF",
                        fontSize: 12,
                        fontWeight: 600,
                        cursor:
                            "pointer",
                    }}
                >
                    Apply Changes
                </button>
            </div>
        </div>
    );
}

export function AIChat({
    draftPlan,
    draftModificationPlan,
    onApply,
    onCancel,
}: AIChatProps) {
    const [input, setInput] =
        useState("");

    const messages =
        useAIStore(
            (state) =>
                state.messages,
        );

    const isGenerating =
        useAIStore(
            (state) =>
                state.isGenerating,
        );

    const sendMessage =
        useAIStore(
            (state) =>
                state.sendMessage,
        );

    function handleSubmit(
        event: FormEvent<HTMLFormElement>,
    ) {
        event.preventDefault();

        const message =
            input.trim();

        if (
            !message ||
            isGenerating
        ) {
            return;
        }

        void sendMessage(
            message,
        );

        setInput("");
    }

    return (
        <div
            style={{
                flex: 1,
                minHeight: 0,
                display: "flex",
                flexDirection:
                    "column",
                overflow:
                    "hidden",
            }}
        >
            <div
                style={{
                    flex: 1,
                    minHeight: 0,
                    overflowY:
                        "auto",
                    padding:
                        "16px 16px 20px",
                }}
            >
                {messages.length ===
                    0 ? (
                    <div
                        style={{
                            minHeight:
                                "100%",
                            display:
                                "flex",
                            flexDirection:
                                "column",
                            justifyContent:
                                "center",
                            alignItems:
                                "center",
                            textAlign:
                                "center",
                            padding: 24,
                            color:
                                "#8B949E",
                        }}
                    >
                        <div
                            style={{
                                fontSize:
                                    28,
                                marginBottom:
                                    12,
                            }}
                        >
                            ✨
                        </div>

                        <strong
                            style={{
                                color:
                                    "#E6EDF3",
                                fontSize:
                                    15,
                            }}
                        >
                            AI Assistant
                        </strong>

                        <p
                            style={{
                                marginTop:
                                    8,
                                marginBottom:
                                    0,
                                fontSize:
                                    13,
                                lineHeight:
                                    1.5,
                            }}
                        >
                            Ask me about
                            your current
                            flow or
                            describe the
                            test flow you
                            want to create.
                        </p>
                    </div>
                ) : (
                    <>
                        {messages.map(
                            (
                                message,
                            ) => (
                                <AIMessage
                                    key={
                                        message.id
                                    }
                                    message={
                                        message
                                    }
                                />
                            ),
                        )}

                        {draftPlan && (
                            <AIFlowPreview
                                plan={
                                    draftPlan
                                }
                                onApply={
                                    onApply
                                }
                                onCancel={
                                    onCancel
                                }
                            />
                        )}

                        {
                            draftModificationPlan && (
                                <ModificationPreview
                                    plan={
                                        draftModificationPlan
                                    }
                                    onApply={
                                        onApply
                                    }
                                    onCancel={
                                        onCancel
                                    }
                                />
                            )
                        }
                    </>
                )}
            </div>

            <form
                onSubmit={
                    handleSubmit
                }
                style={{
                    flexShrink: 0,
                    padding: 12,
                    borderTop:
                        "1px solid #30363D",
                    background:
                        "#0D1117",
                }}
            >
                <div
                    style={{
                        display:
                            "flex",
                        alignItems:
                            "flex-end",
                        gap: 8,
                        padding: 8,
                        border:
                            "1px solid #30363D",
                        borderRadius:
                            10,
                        background:
                            "#161B22",
                    }}
                >
                    <textarea
                        value={input}
                        onChange={(
                            event,
                        ) =>
                            setInput(
                                event
                                    .target
                                    .value,
                            )
                        }
                        onKeyDown={(
                            event,
                        ) => {
                            if (
                                event.key ===
                                "Enter" &&
                                !event.shiftKey
                            ) {
                                event.preventDefault();

                                event.currentTarget.form?.requestSubmit();
                            }
                        }}
                        placeholder={
                            isGenerating
                                ? "AI is thinking..."
                                : "Ask AI..."
                        }
                        disabled={
                            isGenerating
                        }
                        rows={2}
                        style={{
                            flex: 1,
                            resize: "none",
                            border:
                                "none",
                            outline:
                                "none",
                            background:
                                "transparent",
                            color:
                                "#E6EDF3",
                            fontSize: 13,
                            lineHeight:
                                1.5,
                            fontFamily:
                                "inherit",
                        }}
                    />

                    <button
                        type="submit"
                        disabled={
                            !input.trim() ||
                            isGenerating
                        }
                        title="Send"
                        style={{
                            width: 34,
                            height: 34,
                            display:
                                "flex",
                            alignItems:
                                "center",
                            justifyContent:
                                "center",
                            border:
                                "none",
                            borderRadius:
                                8,
                            background:
                                input.trim() &&
                                    !isGenerating
                                    ? "#238636"
                                    : "#21262D",
                            color:
                                "#FFFFFF",
                            cursor:
                                input.trim() &&
                                    !isGenerating
                                    ? "pointer"
                                    : "default",
                        }}
                    >
                        <Send size={15} />
                    </button>
                </div>
            </form>
        </div>
    );
}