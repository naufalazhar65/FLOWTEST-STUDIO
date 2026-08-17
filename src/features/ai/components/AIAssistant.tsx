import {
    useState,
} from "react";

import {
    CheckCircle2,
    Sparkles,
    X,
} from "lucide-react";

import {
    useAIStore,
} from "../store/useAIStore";

import {
    applyAIFlowPlan,
} from "../services/applyAIFlowPlan";

import {
    applyAIModificationPlan,
} from "../services/applyAIModificationPlan";

import {
    AIChat,
} from "./AIChat";

import {
    AITestCasePreview,
} from "./AITestCasePreview";

interface AIAssistantProps {
    onClose?: () => void;
}

export function AIAssistant({
    onClose,
}: AIAssistantProps) {
    const [
        applyResult,
        setApplyResult,
    ] = useState<string | null>(
        null,
    );

    const [
        requirement,
        setRequirement,
    ] = useState("");

    const draftPlan =
        useAIStore(
            (state) =>
                state.draftPlan,
        );

    const draftModificationPlan =
        useAIStore(
            (state) =>
                state.draftModificationPlan,
        );

    const draftTestCases =
        useAIStore(
            (state) =>
                state.draftTestCases,
        );

    const isGenerating =
        useAIStore(
            (state) =>
                state.isGenerating,
        );

    const error =
        useAIStore(
            (state) =>
                state.error,
        );

    const setDraftPlan =
        useAIStore(
            (state) =>
                state.setDraftPlan,
        );

    const setDraftModificationPlan =
        useAIStore(
            (state) =>
                state.setDraftModificationPlan,
        );

    const setDraftTestCases =
        useAIStore(
            (state) =>
                state.setDraftTestCases,
        );

    const generateTestCases =
        useAIStore(
            (state) =>
                state.generateTestCases,
        );

    const addMessage =
        useAIStore(
            (state) =>
                state.addMessage,
        );

    async function handleGenerateTestCases() {
        const value =
            requirement.trim();

        if (!value) {
            return;
        }

        setApplyResult(null);

        try {
            await generateTestCases(
                value,
            );
        } catch {
            /*
             * The store already exposes
             * the normalized error.
             */
        }
    }

    function handleApproveTestCases() {
        if (
            !draftTestCases ||
            draftTestCases.length === 0
        ) {
            return;
        }

        addMessage({
            id:
                crypto.randomUUID(),

            role:
                "assistant",

            content:
                `Approved ${draftTestCases.length} generated test case${draftTestCases.length === 1
                    ? ""
                    : "s"
                }. They are ready for the next Test Case → Flow phase.`,

            createdAt:
                Date.now(),
        });

        setDraftTestCases(
            null,
        );

        setApplyResult(
            `Approved ${draftTestCases.length} test case${draftTestCases.length === 1
                ? ""
                : "s"
            }.`,
        );
    }

    function handleApply() {
        if (
            draftModificationPlan
        ) {
            const result =
                applyAIModificationPlan(
                    draftModificationPlan,
                );

            if (
                !result.success
            ) {
                setApplyResult(
                    result.error ??
                    "Failed to apply AI modification.",
                );

                return;
            }

            setApplyResult(
                `Applied ${result.appliedSteps} modification${result.appliedSteps ===
                    1
                    ? ""
                    : "s"
                } to the current flow.`,
            );

            addMessage({
                id:
                    crypto.randomUUID(),

                role:
                    "assistant",

                content:
                    `Done. I applied ${result.appliedSteps} modification${result.appliedSteps ===
                        1
                        ? ""
                        : "s"
                    } to the current flow.`,

                createdAt:
                    Date.now(),
            });

            setDraftModificationPlan(
                null,
            );

            return;
        }

        if (!draftPlan) {
            return;
        }

        const result =
            applyAIFlowPlan(
                draftPlan,
            );

        if (
            !result.success
        ) {
            setApplyResult(
                result.error ??
                "Failed to apply AI flow.",
            );

            return;
        }

        setApplyResult(
            `Applied ${result.appliedSteps} step${result.appliedSteps ===
                1
                ? ""
                : "s"
            } to the current flow.`,
        );

        addMessage({
            id:
                crypto.randomUUID(),

            role:
                "assistant",

            content:
                `Done. I added ${result.appliedSteps} step${result.appliedSteps ===
                    1
                    ? ""
                    : "s"
                } to the current flow.`,

            createdAt:
                Date.now(),
        });

        setDraftPlan(
            null,
        );
    }

    function handleCancel() {
        setDraftPlan(
            null,
        );

        setDraftModificationPlan(
            null,
        );

        setDraftTestCases(
            null,
        );

        setRequirement("");

        setApplyResult(
            null,
        );
    }

    return (
        <section
            style={{
                width: "100%",

                height: "100%",

                minHeight: 0,

                display:
                    "flex",

                flexDirection:
                    "column",

                background:
                    "#0D1117",

                color:
                    "#E6EDF3",
            }}
        >
            <header
                style={{
                    height: 56,

                    flexShrink: 0,

                    display:
                        "flex",

                    alignItems:
                        "center",

                    justifyContent:
                        "space-between",

                    padding:
                        "0 14px",

                    borderBottom:
                        "1px solid #30363D",
                }}
            >
                <div
                    style={{
                        display:
                            "flex",

                        alignItems:
                            "center",

                        gap: 8,
                    }}
                >
                    <Sparkles
                        size={16}
                        color="#A371F7"
                    />

                    <span
                        style={{
                            fontSize:
                                14,

                            fontWeight:
                                600,
                        }}
                    >
                        AI Assistant
                    </span>
                </div>

                {onClose && (
                    <button
                        type="button"
                        onClick={
                            onClose
                        }
                        aria-label="Close AI Assistant"
                        style={{
                            width:
                                30,

                            height:
                                30,

                            display:
                                "flex",

                            alignItems:
                                "center",

                            justifyContent:
                                "center",

                            border:
                                "none",

                            borderRadius:
                                6,

                            background:
                                "transparent",

                            color:
                                "#8B949E",

                            cursor:
                                "pointer",
                        }}
                    >
                        <X size={16} />
                    </button>
                )}
            </header>

            <div
                style={{
                    flex: 1,

                    minHeight: 0,

                    overflow:
                        "hidden",

                    display:
                        "flex",

                    flexDirection:
                        "column",
                }}
            >
                <div
                    style={{
                        flexShrink:
                            0,

                        padding:
                            "12px 12px 0",
                    }}
                >
                    <div
                        style={{
                            marginBottom:
                                7,

                            color:
                                "#E6EDF3",

                            fontSize:
                                12,

                            fontWeight:
                                600,
                        }}
                    >
                        Generate Test Cases
                    </div>

                    <textarea
                        value={
                            requirement
                        }
                        onChange={(
                            event,
                        ) =>
                            setRequirement(
                                event
                                    .target
                                    .value,
                            )
                        }
                        placeholder="Describe the requirement you want to turn into QA test cases..."
                        rows={4}
                        disabled={
                            isGenerating
                        }
                        style={{
                            width:
                                "100%",

                            resize:
                                "vertical",

                            boxSizing:
                                "border-box",

                            padding:
                                "9px 10px",

                            border:
                                "1px solid #30363D",

                            borderRadius:
                                8,

                            outline:
                                "none",

                            background:
                                "#161B22",

                            color:
                                "#E6EDF3",

                            fontSize:
                                12,

                            lineHeight:
                                1.5,

                            fontFamily:
                                "inherit",
                        }}
                    />

                    <div
                        style={{
                            display:
                                "flex",

                            justifyContent:
                                "flex-end",

                            marginTop:
                                8,
                        }}
                    >
                        <button
                            type="button"
                            onClick={
                                handleGenerateTestCases
                            }
                            disabled={
                                isGenerating ||
                                !requirement.trim()
                            }
                            style={{
                                padding:
                                    "7px 12px",

                                border:
                                    "1px solid #8957E5",

                                borderRadius:
                                    7,

                                background:
                                    isGenerating ||
                                        !requirement.trim()
                                        ? "#21262D"
                                        : "#6E40C9",

                                color:
                                    isGenerating ||
                                        !requirement.trim()
                                        ? "#8B949E"
                                        : "#FFFFFF",

                                fontSize:
                                    12,

                                fontWeight:
                                    600,

                                cursor:
                                    isGenerating ||
                                        !requirement.trim()
                                        ? "not-allowed"
                                        : "pointer",
                            }}
                        >
                            {isGenerating
                                ? "Generating..."
                                : "Generate Test Cases"}
                        </button>
                    </div>

                    {error && (
                        <div
                            style={{
                                marginTop:
                                    8,

                                padding:
                                    "8px 10px",

                                border:
                                    "1px solid #8E1519",

                                borderRadius:
                                    8,

                                background:
                                    "rgba(248,81,73,.10)",

                                color:
                                    "#F85149",

                                fontSize:
                                    11,

                                lineHeight:
                                    1.4,
                            }}
                        >
                            {error}
                        </div>
                    )}
                </div>

                <div
                    style={{
                        flex: 1,

                        minHeight: 0,

                        overflowY:
                            "auto",

                        padding:
                            "0 12px 12px",
                    }}
                >
                    {draftTestCases &&
                        draftTestCases.length >
                        0 && (
                            <AITestCasePreview
                                testCases={
                                    draftTestCases
                                }
                                onApprove={
                                    handleApproveTestCases
                                }
                                onCancel={
                                    handleCancel
                                }
                            />
                        )}

                    <AIChat
                        draftPlan={
                            draftPlan
                        }
                        draftModificationPlan={
                            draftModificationPlan
                        }
                        onApply={
                            handleApply
                        }
                        onCancel={
                            handleCancel
                        }
                    />

                    {applyResult && (
                        <div
                            style={{
                                flexShrink:
                                    0,

                                display:
                                    "flex",

                                alignItems:
                                    "center",

                                gap: 7,

                                margin:
                                    "0 0 10px",

                                padding:
                                    "8px 10px",

                                border:
                                    "1px solid #238636",

                                borderRadius:
                                    8,

                                background:
                                    "rgba(35,134,54,.12)",

                                color:
                                    "#3FB950",

                                fontSize:
                                    11,

                                lineHeight:
                                    1.4,
                            }}
                        >
                            <CheckCircle2
                                size={14}
                            />

                            <span>
                                {
                                    applyResult
                                }
                            </span>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}