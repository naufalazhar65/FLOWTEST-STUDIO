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

it(
    "preserves resultId and symbolic target references in multi-operation modifications",
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

                                                operations: [
                                                    {
                                                        type:
                                                            "addNodeBefore",

                                                        targetNodeId:
                                                            "login-1",

                                                        resultId:
                                                            "newWait",

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

                                                    {
                                                        type:
                                                            "addNodeAfter",

                                                        targetNodeId:
                                                            "$newWait",

                                                        step:
                                                            {
                                                                action:
                                                                    "tap",

                                                                locatorStrategy:
                                                                    "accessibilityId",

                                                                locator:
                                                                    "Continue",

                                                            },
                                                    },
                                                ],
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
                    "Tambahkan wait sebelum Login lalu tambahkan Continue setelah node hasilnya.",

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
            result.modificationPlan.operations,
        ).toHaveLength(
            2,
        );

        expect(
            result.modificationPlan.operations[0]
                .resultId,
        ).toBe(
            "newWait",
        );

        expect(
            result.modificationPlan.operations[1]
                .targetNodeId,
        ).toBe(
            "$newWait",
        );
    },
);

it(
    "overrides only the first modification target with the selected node",
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
                                            "Ubah node yang dipilih lalu tambahkan wait sebelum Confirm",

                                        intent:
                                            "modifyFlow",

                                        flowPlan:
                                            null,

                                        modificationPlan:
                                            {
                                                type:
                                                    "modification_plan",

                                                operations: [
                                                    {
                                                        type:
                                                            "updateNode",

                                                        targetNodeId:
                                                            "wrong-target",

                                                        step: {
                                                            action:
                                                                "tap",

                                                            locatorStrategy:
                                                                "accessibilityId",

                                                            locator:
                                                                "Continue",
                                                        },
                                                    },

                                                    {
                                                        type:
                                                            "addNodeBefore",

                                                        targetNodeId:
                                                            "explicit-2",

                                                        step: {
                                                            action:
                                                                "wait",

                                                            locatorStrategy:
                                                                "accessibilityId",

                                                            locator:
                                                                "Confirm",

                                                            timeout:
                                                                1000,

                                                            pollingInterval:
                                                                500,
                                                        },
                                                    },
                                                ],
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
                    "Ubah node yang dipilih lalu tambahkan wait sebelum Confirm",

                context: {
                    selectedNodeId:
                        "selected-1",

                    nodes: [
                        {
                            id:
                                "selected-1",

                            title:
                                "Selected Node",

                            action:
                                "tap",
                        },

                        {
                            id:
                                "explicit-2",

                            title:
                                "Confirm",

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
            result.modificationPlan.operations,
        ).toHaveLength(
            2,
        );

        expect(
            result.modificationPlan.operations[0]
                .targetNodeId,
        ).toBe(
            "selected-1",
        );

        expect(
            result.modificationPlan.operations[1]
                .targetNodeId,
        ).toBe(
            "explicit-2",
        );
    },
);

it(
    "preserves explicit targets across multiple before and after operations",
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

                                                operations: [
                                                    {
                                                        type:
                                                            "addNodeBefore",

                                                        targetNodeId:
                                                            "login-1",

                                                        step: {
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

                                                    {
                                                        type:
                                                            "addNodeAfter",

                                                        targetNodeId:
                                                            "confirm-1",

                                                        step: {
                                                            action:
                                                                "tap",

                                                            locatorStrategy:
                                                                "accessibilityId",

                                                            locator:
                                                                "Confirm",
                                                        },
                                                    },
                                                ],
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
                    "Tambahkan wait sebelum Login lalu tap Confirm setelah Confirm",

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
                                "confirm-1",

                            title:
                                "Confirm",

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
            result.modificationPlan.operations,
        ).toHaveLength(
            2,
        );

        expect(
            result.modificationPlan.operations[0]
                .type,
        ).toBe(
            "addNodeBefore",
        );

        expect(
            result.modificationPlan.operations[0]
                .targetNodeId,
        ).toBe(
            "login-1",
        );

        expect(
            result.modificationPlan.operations[1]
                .type,
        ).toBe(
            "addNodeAfter",
        );

        expect(
            result.modificationPlan.operations[1]
                .targetNodeId,
        ).toBe(
            "confirm-1",
        );
    },
);

it(
    "preserves independent updateNode targets across multiple operations",
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

                                                operations: [
                                                    {
                                                        type:
                                                            "updateNode",

                                                        targetNodeId:
                                                            "login-1",

                                                        step: {
                                                            action:
                                                                "assert",

                                                            title:
                                                                "Verify Login",

                                                            description:
                                                                "Verify login result.",

                                                            actual:
                                                                "Login",

                                                            operator:
                                                                "equals",

                                                            expected:
                                                                "Login",
                                                        },
                                                    },

                                                    {
                                                        type:
                                                            "updateNode",

                                                        targetNodeId:
                                                            "confirm-1",

                                                        step: {
                                                            action:
                                                                "tap",

                                                            title:
                                                                "Tap Confirm",

                                                            description:
                                                                "Tap the Confirm button.",

                                                            locatorStrategy:
                                                                "accessibilityId",

                                                            locator:
                                                                "Confirm",
                                                        },
                                                    },
                                                ],
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
                    "Ubah Login menjadi assertion lalu ubah Confirm menjadi tap",

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
                                "confirm-1",

                            title:
                                "Confirm",

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
            result.modificationPlan.operations,
        ).toHaveLength(
            2,
        );

        expect(
            result.modificationPlan.operations[0]
                .type,
        ).toBe(
            "updateNode",
        );

        expect(
            result.modificationPlan.operations[0]
                .targetNodeId,
        ).toBe(
            "login-1",
        );

        expect(
            result.modificationPlan.operations[0]
                .step.action,
        ).toBe(
            "assert",
        );

        expect(
            result.modificationPlan.operations[1]
                .type,
        ).toBe(
            "updateNode",
        );

        expect(
            result.modificationPlan.operations[1]
                .targetNodeId,
        ).toBe(
            "confirm-1",
        );

        expect(
            result.modificationPlan.operations[1]
                .step.action,
        ).toBe(
            "tap",
        );
    },
);
    },
);