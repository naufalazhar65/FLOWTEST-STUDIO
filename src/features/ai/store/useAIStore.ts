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

import {
    sendAIRequest,
} from "../services/aiClient";

import {
    buildFlowContext,
} from "../services/buildFlowContext";

import {
    validateAIFlowPlan,
} from "../services/validateAIFlowPlan";

interface AIStore {
    messages: AIMessage[];

    draftPlan: AIFlowPlan | null;

    draftModificationPlan:
    AIModificationPlan | null;

    isGenerating: boolean;

    error: string | null;

    addMessage: (
        message: AIMessage,
    ) => void;

    clearMessages: () => void;

    setDraftPlan: (
        plan: AIFlowPlan | null,
    ) => void;

    setDraftModificationPlan: (
        plan:
            AIModificationPlan | null,
    ) => void;

    setGenerating: (
        value: boolean,
    ) => void;

    setError: (
        error: string | null,
    ) => void;

    sendMessage: (
        content: string,
    ) => Promise<void>;
}

function createMessageId(): string {
    return crypto.randomUUID();
}

export const useAIStore =
    create<AIStore>((set) => ({
        messages: [],

        draftPlan: null,

        draftModificationPlan:
            null,

        isGenerating: false,

        error: null,

        addMessage: (message) =>
            set((state) => ({
                messages: [
                    ...state.messages,
                    message,
                ],
            })),

        clearMessages: () =>
            set({
                messages: [],

                draftPlan: null,

                draftModificationPlan:
                    null,

                error: null,
            }),

        setDraftPlan: (plan) =>
            set({
                draftPlan: plan,
            }),

        setDraftModificationPlan: (
            plan,
        ) =>
            set({
                draftModificationPlan:
                    plan,
            }),

        setGenerating: (value) =>
            set({
                isGenerating: value,
            }),

        setError: (error) =>
            set({
                error,
            }),

        sendMessage: async (
            content,
        ) => {
            const message =
                content.trim();

            if (!message) {
                return;
            }

            const userMessage:
                AIMessage = {
                id: createMessageId(),

                role: "user",

                content: message,

                createdAt:
                    Date.now(),
            };

            set((state) => ({
                messages: [
                    ...state.messages,
                    userMessage,
                ],

                error: null,

                isGenerating: true,
            }));

            try {
                const context =
                    buildFlowContext();

                const response =
                    await sendAIRequest({
                        message,

                        context,
                    });

                let draftPlan:
                    AIFlowPlan | null =
                    null;

                let draftModificationPlan:
                    AIModificationPlan | null =
                    response.modificationPlan ??
                    null;

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

                const assistantContent =
                    response.flowPlan
                        ? `Saya sudah menyiapkan flow dengan ${response.flowPlan.steps.length} langkah. Silakan review flow plan di bawah sebelum menerapkannya ke flow.`
                        : response.modificationPlan
                            ? `Saya sudah menyiapkan perubahan untuk flow. Silakan review perubahan di bawah sebelum menerapkannya.`
                            : response.message;

                const assistantMessage:
                    AIMessage = {
                    id: createMessageId(),

                    role: "assistant",

                    content:
                        assistantContent,

                    flowPlan:
                        response.flowPlan ??
                        undefined,

                    modificationPlan:
                        response.modificationPlan ??
                        undefined,

                    createdAt:
                        Date.now(),
                };

                set((state) => ({
                    messages: [
                        ...state.messages,
                        assistantMessage,
                    ],

                    draftPlan,

                    draftModificationPlan,

                    error: null,

                    isGenerating: false,
                }));
            } catch (error) {
                const errorMessage =
                    error instanceof Error
                        ? error.message
                        : String(error);

                const assistantMessage:
                    AIMessage = {
                    id: createMessageId(),

                    role: "assistant",

                    content:
                        `AI error: ${errorMessage}`,

                    createdAt:
                        Date.now(),
                };

                set((state) => ({
                    messages: [
                        ...state.messages,
                        assistantMessage,
                    ],

                    error:
                        errorMessage,

                    isGenerating: false,

                    draftPlan: null,

                    draftModificationPlan:
                        null,
                }));
            }
        },
    }));