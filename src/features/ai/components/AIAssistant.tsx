import {
    useState,
} from "react";

import {
    CheckCircle2,
    X,
    Sparkles,
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

    const addMessage =
        useAIStore(
            (state) =>
                state.addMessage,
        );

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
                                "0 12px 10px",

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
        </section>
    );
}