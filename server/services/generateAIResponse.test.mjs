import {
    beforeEach,
    describe,
    expect,
    it,
    vi,
} from "vitest";

import {
    generateAIResponse,
} from "./ollamaService.mjs";

describe(
    "generateAIResponse",
    () => {
        beforeEach(() => {
            vi.restoreAllMocks();
        });

        it(
            "returns clarification when modification target is ambiguous",
            async () => {
                vi.stubGlobal(
                    "fetch",
                    vi.fn(
                        async () => ({
                            ok: true,

                            json:
                                async () => ({
                                    message: {
                                        content:
                                            JSON.stringify({
                                                message:
                                                    "Saya siap membantu.",

                                                intent:
                                                    "modifyFlow",

                                                modificationPlan:
                                                    {
                                                        type:
                                                            "modification_plan",

                                                        operation:
                                                            {
                                                                type:
                                                                    "addNodeBefore",

                                                                targetNodeId:
                                                                    "login-1",

                                                                step:
                                                                    {
                                                                        action:
                                                                            "wait",

                                                                        locatorStrategy:
                                                                            "accessibilityId",

                                                                        locator:
                                                                            "Login",

                                                                        timeout:
                                                                            1000,

                                                                        pollingInterval:
                                                                            500,
                                                                    },
                                                            },
                                                    },

                                                flowPlan:
                                                    null,
                                            }),
                                    },
                                }),
                        }),
                    ),
                );

                const result =
                    await generateAIResponse({
                        message:
                            "Tambahkan wait sebelum Login",

                        context: {
                            nodes: [
                                {
                                    id:
                                        "login-1",

                                    title:
                                        "Login",

                                    action:
                                        "tap",
                                },

                                {
                                    id:
                                        "login-2",

                                    title:
                                        "Login",

                                    action:
                                        "tap",
                                },
                            ],

                            edges: [],
                        },
                    });

                expect(
                    result.intent,
                ).toBe(
                    "modifyFlow",
                );

                expect(
                    result.modificationPlan,
                ).toBeNull();

                expect(
                    result.clarification?.type,
                ).toBe(
                    "target_node",
                );

                expect(
                    result.clarification?.candidates,
                ).toHaveLength(
                    2,
                );
            },
        );

        it(
    "resolves a clarification reply against the original modification request",
    async () => {
        vi.stubGlobal(
            "fetch",
            vi.fn(
                async () => ({
                    ok: true,

                    json:
                        async () => ({
                            message: {
                                content:
                                    JSON.stringify({
                                        message:
                                            "Saya sudah menyiapkan perubahan.",

                                        intent:
                                            "modifyFlow",

                                        flowPlan:
                                            null,

                                        modificationPlan:
                                            {
                                                type:
                                                    "modification_plan",

                                                operation:
                                                    {
                                                        type:
                                                            "addNodeBefore",

                                                        targetNodeId:
                                                            "login-1",

                                                        step:
                                                            {
                                                                action:
                                                                    "wait",

                                                                locatorStrategy:
                                                                    "accessibilityId",

                                                                locator:
                                                                    "Login",

                                                                timeout:
                                                                    1000,

                                                                pollingInterval:
                                                                    500,
                                                            },
                                                    },
                                            },
                                    }),
                            },
                        }),
                }),
            ),
        );

        const result =
            await generateAIResponse({
                message:
                    "yang kedua",

                clarification: {
                    originalMessage:
                        "Tambahkan wait sebelum Login",

                    clarification: {
                        candidates: [
                            {
                                nodeId:
                                    "login-1",

                                title:
                                    "Login",

                                action:
                                    "tap",
                            },

                            {
                                nodeId:
                                    "login-2",

                                title:
                                    "Login",

                                action:
                                    "tap",
                            },
                        ],
                    },
                },

                context: {
                    nodes: [
                        {
                            id:
                                "login-1",

                            title:
                                "Login",

                            action:
                                "tap",
                        },

                        {
                            id:
                                "login-2",

                            title:
                                "Login",

                            action:
                                "tap",
                        },
                    ],

                    edges: [],
                },
            });

        expect(
            result.intent,
        ).toBe(
            "modifyFlow",
        );

        expect(
            result.modificationPlan,
        ).not.toBeNull();

        expect(
            result.modificationPlan.operation
                .targetNodeId,
        ).toBe(
            "login-2",
        );
    },
);
    },
);