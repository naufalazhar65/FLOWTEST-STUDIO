import { create } from "zustand";

import type {
    AIFlowPlan,
} from "../types/AIFlowPlan";

import type {
    AIModificationPlan,
} from "../types/AIModificationPlan";

import type {
    AIMessage,
} from "../types/AIMessage";

import type {
    AIPendingClarification,
    AIQARecommendation,
} from "../types/AIRequest";

import {
    convertAITestCaseToFlow,
    generateAITestCases,
    requestQAFixPlan,
    sendAIRequest,
} from "../services/aiClient";

import {
    buildFlowContext,
} from "../services/buildFlowContext";

import {
    validateAIFlowPlan,
} from "../services/validateAIFlowPlan";

import type {
    AITestCase,
} from "../types/AITestCase";

import {
    buildAIExecutionContext,
} from "../services/buildAIExecutionContext";

import {
    useFlowStore,
} from "../../flow/store/useFlowStore";

import {
    analyzeExecutionFailure,
} from "../../execution/services/analyzeExecutionFailure";

import {
    applyAIModificationPlan,
} from "../services/applyAIModificationPlan";

interface AIStore {
    messages: AIMessage[];

    draftPlan:
    AIFlowPlan | null;

    draftModificationPlan:
    AIModificationPlan | null;

    draftTestCases:
    AITestCase[] | null;

    qaRecommendations:
    AIQARecommendation[];

    pendingClarification:
    AIPendingClarification | null;

    isGenerating:
    boolean;

    error:
    string | null;

    addMessage: (
        message: AIMessage,
    ) => void;

    clearMessages: () => void;

    setDraftPlan: (
        plan:
            AIFlowPlan | null,
    ) => void;


    setDraftModificationPlan: (
        plan:
            AIModificationPlan | null,
    ) => void;

    setDraftTestCases: (
        testCases:
            AITestCase[] | null,
    ) => void;

    generateTestCases: (
        requirement: string,
    ) => Promise<void>;

    convertTestCaseToFlow: (
        testCase: AITestCase,
    ) => Promise<void>;

    setPendingClarification: (
        clarification:
            AIPendingClarification | null,
    ) => void;

    setGenerating: (
        value: boolean,
    ) => void;

    setError: (
        error:
            string | null,
    ) => void;

    sendMessage: (
        content: string,
    ) => Promise<void>;

    requestQAFix: (
        recommendation:
            AIQARecommendation,
    ) => Promise<void>;
}
function createMessageId(): string {
    return crypto.randomUUID();
}

export const useAIStore =
    create<AIStore>(
        (
            set,
            get,
        ) => ({
            messages: [],

            draftPlan:
                null,

            draftModificationPlan:
                null,

            draftTestCases:
                null,

            qaRecommendations:
                [],

            pendingClarification:
                null,

            isGenerating:
                false,

            error:
                null,

            addMessage: (
                message,
            ) =>
                set(
                    (
                        state,
                    ) => ({
                        messages: [
                            ...state.messages,
                            message,
                        ],
                    }),
                ),

            clearMessages: () =>
                set({
                    messages: [],

                    draftPlan:
                        null,

                    draftTestCases:
                        null,

                    draftModificationPlan:
                        null,

                    qaRecommendations:
                        [],

                    pendingClarification:
                        null,

                    error:
                        null,

                    isGenerating:
                        false,
                }),

            setDraftPlan: (
                plan,
            ) =>
                set({
                    draftPlan:
                        plan,
                }),



            setDraftTestCases: (
                testCases,
            ) =>
                set({
                    draftTestCases:
                        testCases,
                }),

            generateTestCases: async (
                requirement,
            ) => {
                const message =
                    requirement.trim();

                if (!message) {
                    return;
                }

                set({
                    error: null,

                    isGenerating:
                        true,

                    draftTestCases:
                        null,
                });

                try {
                    const result =
                        await generateAITestCases(
                            message,
                        );

                    set({
                        draftTestCases:
                            result.testCases,

                        error:
                            null,

                        isGenerating:
                            false,
                    });
                } catch (error) {
                    const errorMessage =
                        error instanceof Error
                            ? error.message
                            : String(error);

                    set({
                        error:
                            errorMessage,

                        isGenerating:
                            false,

                        draftTestCases:
                            null,
                    });

                    throw error;
                }
            },

            convertTestCaseToFlow: async (
                testCase,
            ) => {
                set({
                    error: null,

                    isGenerating:
                        true,
                });

                try {
                    const context =
                        buildFlowContext();

                    const result =
                        await convertAITestCaseToFlow(
                            {
                                testCase,

                                context,
                            },
                        );

                    const validation =
                        validateAIFlowPlan(
                            result.flowPlan,
                        );

                    if (
                        !validation.valid
                    ) {
                        throw new Error(
                            validation.errors.join(
                                " ",
                            ),
                        );
                    }

                    set({
                        draftPlan:
                            result.flowPlan,

                        draftTestCases:
                            null,

                        draftModificationPlan:
                            null,

                        error:
                            null,

                        isGenerating:
                            false,
                    });
                } catch (error) {
                    const errorMessage =
                        error instanceof Error
                            ? error.message
                            : String(error);

                    set({
                        error:
                            errorMessage,

                        isGenerating:
                            false,

                        draftPlan:
                            null,
                    });

                    throw error;
                }
            },

            setDraftModificationPlan: (
                plan,
            ) =>
                set({
                    draftModificationPlan:
                        plan,
                }),

            setPendingClarification: (
                clarification,
            ) =>
                set({
                    pendingClarification:
                        clarification,
                }),

            setGenerating: (
                value,
            ) =>
                set({
                    isGenerating:
                        value,
                }),

            setError: (
                error,
            ) =>
                set({
                    error,
                }),

            sendMessage:
                async (
                    content,
                ) => {
                    const message =
                        content.trim();

                    if (!message) {
                        return;
                    }

                    const userMessage:
                        AIMessage = {
                        id:
                            createMessageId(),

                        role:
                            "user",

                        content:
                            message,

                        createdAt:
                            Date.now(),
                    };

                    set(
                        (
                            state,
                        ) => ({
                            messages: [
                                ...state.messages,
                                userMessage,
                            ],

                            error:
                                null,

                            isGenerating:
                                true,
                        }),
                    );

                    try {
                        const context =
                            buildAIExecutionContext();


                        const pendingClarification =
                            get()
                                .pendingClarification;

                        const response =
                            await sendAIRequest(
                                {
                                    message,

                                    context,

                                    clarification:
                                        pendingClarification ??
                                        undefined,
                                },
                            );

                        let draftPlan:
                            AIFlowPlan |
                            null =
                            null;

                        const draftModificationPlan:
                            AIModificationPlan |
                            null =
                            response.modificationPlan ??
                            null;

                        const qaRecommendations =
                            response.qaRecommendations ??
                            [];
                        let finalQARecommendations =
                            qaRecommendations;

                        if (
                            response.intent ===
                            "analyzeExecution"
                        ) {
                            const flow =
                                useFlowStore.getState();

                            const executionResults =
                                Object.values(
                                    context.execution.nodeResults,
                                );

                            const failureAnalysis =
                                analyzeExecutionFailure(
                                    executionResults,
                                    flow.nodes,
                                    flow.edges,
                                );

                            if (
                                failureAnalysis
                            ) {
                                const {
                                    context:
                                    failureContext,
                                    rootCause,
                                    suggestedFix,
                                } =
                                    failureAnalysis;

                                if (
                                    !failureContext
                                ) {
                                    return;
                                }

                                finalQARecommendations = [
                                    ...qaRecommendations,

                                    {
                                        id:
                                            `execution-failure-${failureContext.node.id}`,

                                        priority:
                                            rootCause.confidence ===
                                                "high"
                                                ? "high"
                                                : "medium",

                                        impact:
                                            "high",

                                        score:
                                            rootCause.confidence ===
                                                "high"
                                                ? 100
                                                : 75,

                                        category:
                                            rootCause.category,

                                        finding:
                                            rootCause.title,

                                        nodeId:
                                            failureContext.node.id,

                                        action:
                                            failureContext.node.action,

                                        title:
                                            rootCause.title,

                                        description:
                                            rootCause.explanation,

                                        recommendation:
                                            suggestedFix.description,

                                        suggestedFix: suggestedFix
                                            ? {
                                                type:
                                                    suggestedFix.type,

                                                targetNodeId:
                                                    suggestedFix.targetNodeId,

                                                suggestedLocator:
                                                    suggestedFix.suggestedLocator,

                                                locatorStrategy:
                                                    suggestedFix.locatorStrategy,
                                            }
                                            : null,
                                    },
                                ];
                            }
                        }

                        if (
                            response.flowPlan
                        ) {
                            const validation =
                                validateAIFlowPlan(
                                    response.flowPlan,
                                );

                            if (
                                !validation.valid
                            ) {
                                throw new Error(
                                    validation.errors.join(
                                        " ",
                                    ),
                                );
                            }

                            draftPlan =
                                response.flowPlan;
                        }

                        const nextPendingClarification:
                            AIPendingClarification |
                            null =
                            response.clarification
                                ? {
                                    originalMessage:
                                        pendingClarification
                                            ?.originalMessage ??
                                        message,

                                    clarification:
                                        response.clarification,

                                    selectedCandidateIndex:
                                        null,
                                }
                                : null;

                        const assistantContent =
                            response.flowPlan
                                ? `Saya sudah menyiapkan flow dengan ${response.flowPlan.steps.length} langkah. Silakan review flow plan di bawah sebelum menerapkannya ke flow.`
                                : response.modificationPlan
                                    ? `Saya sudah menyiapkan perubahan untuk flow. Silakan review perubahan di bawah sebelum menerapkannya.`
                                    : response.message;

                        const assistantMessage:
                            AIMessage = {
                            id:
                                createMessageId(),

                            role:
                                "assistant",

                            content:
                                assistantContent,

                            flowPlan:
                                response.flowPlan ??
                                undefined,

                            modificationPlan:
                                response.modificationPlan ??
                                undefined,

                            qaRecommendations:
                                finalQARecommendations,

                            createdAt:
                                Date.now(),
                        };

                        set(
                            (
                                state,
                            ) => ({
                                messages: [
                                    ...state.messages,
                                    assistantMessage,
                                ],

                                draftPlan,

                                draftModificationPlan,

                                qaRecommendations:
                                    finalQARecommendations,

                                pendingClarification:
                                    nextPendingClarification,

                                error:
                                    null,

                                isGenerating:
                                    false,
                            }),
                        );
                    } catch (
                    error
                    ) {
                        const errorMessage =
                            error instanceof Error
                                ? error.message
                                : String(
                                    error,
                                );

                        const assistantMessage:
                            AIMessage = {
                            id:
                                createMessageId(),

                            role:
                                "assistant",

                            content:
                                `AI error: ${errorMessage}`,

                            createdAt:
                                Date.now(),
                        };

                        set(
                            (
                                state,
                            ) => ({
                                messages: [
                                    ...state.messages,
                                    assistantMessage,
                                ],

                                error:
                                    errorMessage,

                                isGenerating:
                                    false,

                                draftPlan:
                                    null,

                                draftModificationPlan:
                                    null,

                                qaRecommendations:
                                    [],

                                pendingClarification:
                                    null,
                            }),
                        );
                    }
                },

            requestQAFix:
                async (
                    recommendation,
                ) => {
                    const suggestedFix =
                        recommendation
                            ?.suggestedFix;

                    if (
                        !suggestedFix ||
                        !suggestedFix.type
                    ) {
                        throw new Error(
                            "This QA recommendation does not contain a suggested fix.",
                        );
                    }

                    if (
                        !suggestedFix.targetNodeId
                    ) {
                        throw new Error(
                            "The QA suggested fix does not contain a target node.",
                        );
                    }

                    set({
                        error:
                            null,

                        isGenerating:
                            true,
                    });

                    try {
                        const context =
                            buildFlowContext();

                        const modificationPlan =
                            await requestQAFixPlan(
                                recommendation,
                                context,
                            );

                        const applyResult =
                            applyAIModificationPlan(
                                modificationPlan,
                            );

                        if (
                            !applyResult.success
                        ) {
                            throw new Error(
                                applyResult.error ??
                                "Failed to apply QA modification plan.",
                            );
                        }

                        set({
                            draftModificationPlan:
                                null,

                            draftPlan:
                                null,

                            error:
                                null,

                            isGenerating:
                                false,
                        });
                    } catch (
                    error
                    ) {
                        const errorMessage =
                            error instanceof Error
                                ? error.message
                                : String(
                                    error,
                                );

                        set({
                            error:
                                errorMessage,

                            isGenerating:
                                false,

                            draftModificationPlan:
                                null,
                        });

                        throw error;
                    }
                },
        }),
    );