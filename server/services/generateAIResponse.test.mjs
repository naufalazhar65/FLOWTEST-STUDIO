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

it(
    "preserves deleteNode independently across multiple operations",
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
                                                            "deleteNode",

                                                        targetNodeId:
                                                            "login-1",
                                                    },

                                                    {
                                                        type:
                                                            "addNodeAfter",

                                                        targetNodeId:
                                                            "confirm-1",

                                                        step: {
                                                            action:
                                                                "tap",

                                                            title:
                                                                "Tap Continue",

                                                            description:
                                                                "Tap the Continue button.",

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
                    "Hapus Login lalu tambahkan Continue setelah Confirm",

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

        const deleteOperation =
            result.modificationPlan.operations[0];

        expect(
            deleteOperation.type,
        ).toBe(
            "deleteNode",
        );

        expect(
            deleteOperation.targetNodeId,
        ).toBe(
            "login-1",
        );

        expect(
            deleteOperation.step,
        ).toBeUndefined();

        const addOperation =
            result.modificationPlan.operations[1];

        expect(
            addOperation.type,
        ).toBe(
            "addNodeAfter",
        );

        expect(
            addOperation.targetNodeId,
        ).toBe(
            "confirm-1",
        );

        expect(
            addOperation.step.action,
        ).toBe(
            "tap",
        );
    },
);

it(
    "rejects an invalid modification plan",
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
                                                            "addNodeAfter",

                                                        targetNodeId:
                                                            "missing-node",

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
                                            },
                                    }),
                            },
                        }),
                }),
            ),
        );

        await expect(
            generateAIResponse({
                message:
                    "Tambahkan Continue setelah Missing Node",

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
            }),
        ).rejects.toThrow(
            "AI modifyFlow response does not contain a valid modification plan.",
        );
    },
);

it(
    "generates a login flow with username and password from the user request",
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
                                            "Saya sudah menyiapkan flow login.",

                                        intent:
                                            "generateFlow",

                                        flowPlan: {
                                            type:
                                                "flow_plan",

                                            summary:
                                                "Login to the application.",

                                            steps: [
                                                {
                                                    id:
                                                        "ai-launch-app",

                                                    action:
                                                        "launchApp",

                                                    title:
                                                        "Launch App",

                                                    description:
                                                        "Launch the application.",
                                                },

                                                {
                                                    id:
                                                        "ai-input-username",

                                                    action:
                                                        "input",

                                                    title:
                                                        "Input Username",

                                                    description:
                                                        "Enter the username.",

                                                    semanticTarget:
                                                        "username-field",

                                                    locatorStrategy:
                                                        "accessibilityId",

                                                    locator:
                                                        "username",

                                                    text:
                                                        "upal",
                                                },

                                                {
                                                    id:
                                                        "ai-input-password",

                                                    action:
                                                        "input",

                                                    title:
                                                        "Input Password",

                                                    description:
                                                        "Enter the password.",

                                                    semanticTarget:
                                                        "password-field",

                                                    locatorStrategy:
                                                        "accessibilityId",

                                                    locator:
                                                        "password",

                                                    text:
                                                        "354354",
                                                },

                                                {
                                                    id:
                                                        "ai-tap-login",

                                                    action:
                                                        "tap",

                                                    title:
                                                        "Tap Login",

                                                    description:
                                                        "Tap the Login button.",

                                                    semanticTarget:
                                                        "login-button",

                                                    locatorStrategy:
                                                        "accessibilityId",

                                                    locator:
                                                        "Login",
                                                },
                                            ],

                                            warnings: [],
                                        },

                                        modificationPlan:
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
                    "Buat flow login dengan username upal dan password 354354",

                context: {
                    nodes: [],

                    edges: [],
                },
            });

        expect(
            result.intent,
        ).toBe(
            "generateFlow",
        );

        expect(
            result.modificationPlan,
        ).toBeNull();

        expect(
            result.flowPlan,
        ).not.toBeNull();

        expect(
            result.flowPlan.steps,
        ).toHaveLength(
            4,
        );

        expect(
            result.flowPlan.steps[0]
                .action,
        ).toBe(
            "launchApp",
        );

        expect(
            result.flowPlan.steps[1]
                .action,
        ).toBe(
            "input",
        );

        expect(
            result.flowPlan.steps[1]
                .semanticTarget,
        ).toBe(
            "username-field",
        );

        expect(
            result.flowPlan.steps[1]
                .locator,
        ).toBe(
            "username",
        );

        expect(
            result.flowPlan.steps[1]
                .text,
        ).toBe(
            "upal",
        );

        expect(
            result.flowPlan.steps[2]
                .action,
        ).toBe(
            "input",
        );

        expect(
            result.flowPlan.steps[2]
                .semanticTarget,
        ).toBe(
            "password-field",
        );

        expect(
            result.flowPlan.steps[2]
                .locator,
        ).toBe(
            "password",
        );

        expect(
            result.flowPlan.steps[2]
                .text,
        ).toBe(
            "354354",
        );

        expect(
            result.flowPlan.steps[3]
                .action,
        ).toBe(
            "tap",
        );

        expect(
            result.flowPlan.steps[3]
                .semanticTarget,
        ).toBe(
            "login-button",
        );

        expect(
            result.flowPlan.steps[3]
                .locator,
        ).toBe(
            "Login",
        );
    },
);

it(
    "removes model-generated wait when the user did not request a wait",
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
                                            "Saya sudah menyiapkan flow login.",

                                        intent:
                                            "generateFlow",

                                        flowPlan: {
                                            type:
                                                "flow_plan",

                                            summary:
                                                "Login to the application.",

                                            steps: [
                                                {
                                                    id:
                                                        "ai-launch-app",

                                                    action:
                                                        "launchApp",
                                                },

                                                {
                                                    id:
                                                        "ai-input-username",

                                                    action:
                                                        "input",

                                                    locatorStrategy:
                                                        "accessibilityId",

                                                    locator:
                                                        "username",

                                                    text:
                                                        "upal",
                                                },

                                                {
                                                    id:
                                                        "ai-input-password",

                                                    action:
                                                        "input",

                                                    locatorStrategy:
                                                        "accessibilityId",

                                                    locator:
                                                        "password",

                                                    text:
                                                        "354354",
                                                },

                                                {
                                                    id:
                                                        "ai-wait-login",

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

                                                {
                                                    id:
                                                        "ai-tap-login",

                                                    action:
                                                        "tap",

                                                    locatorStrategy:
                                                        "accessibilityId",

                                                    locator:
                                                        "Login",
                                                },
                                            ],
                                        },

                                        modificationPlan:
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
                    "Buat flow login dengan username upal dan password 354354",

                context: {
                    nodes: [],
                    edges: [],
                },
            });

        expect(
            result.intent,
        ).toBe(
            "generateFlow",
        );

        expect(
            result.flowPlan.steps.some(
                (step) =>
                    step.action ===
                    "wait",
            ),
        ).toBe(
            false,
        );
    },
);

it(
    "adds a deterministic wait when the user explicitly requests a wait",
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
                                            "Saya sudah menyiapkan flow login.",

                                        intent:
                                            "generateFlow",

                                        flowPlan: {
                                            type:
                                                "flow_plan",

                                            summary:
                                                "Login to the application.",

                                            steps: [
                                                {
                                                    id:
                                                        "ai-launch-app",

                                                    action:
                                                        "launchApp",
                                                },

                                                {
                                                    id:
                                                        "ai-input-username",

                                                    action:
                                                        "input",

                                                    locatorStrategy:
                                                        "accessibilityId",

                                                    locator:
                                                        "username",

                                                    text:
                                                        "upal",
                                                },

                                                {
                                                    id:
                                                        "ai-input-password",

                                                    action:
                                                        "input",

                                                    locatorStrategy:
                                                        "accessibilityId",

                                                    locator:
                                                        "password",

                                                    text:
                                                        "354354",
                                                },

                                                {
                                                    id:
                                                        "ai-tap-login",

                                                    action:
                                                        "tap",

                                                    locatorStrategy:
                                                        "accessibilityId",

                                                    locator:
                                                        "Login",
                                                },
                                            ],

                                            warnings: [],
                                        },

                                        modificationPlan:
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
                    "Buat flow login dengan username upal dan password 354354 lalu tunggu sampai tombol Login terlihat",

                context: {
                    nodes: [],
                    edges: [],
                },
            });

        expect(
            result.intent,
        ).toBe(
            "generateFlow",
        );

        const waitSteps =
            result.flowPlan.steps.filter(
                (step) =>
                    step.action ===
                    "wait",
            );

        expect(
            waitSteps,
        ).toHaveLength(
            1,
        );

        expect(
            waitSteps[0].id,
        ).toBe(
            "ai-wait-login",
        );

        expect(
            waitSteps[0].semanticTarget,
        ).toBe(
            "login-button",
        );

        expect(
            waitSteps[0].locatorStrategy,
        ).toBe(
            "accessibilityId",
        );

        expect(
            waitSteps[0].locator,
        ).toBe(
            "Login",
        );

        expect(
            waitSteps[0].timeout,
        ).toBe(
            10000,
        );

        expect(
            waitSteps[0].pollingInterval,
        ).toBe(
            500,
        );
    },
);

it(
    "rejects an unsupported generated flow action",
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
                                            "Saya sudah menyiapkan flow.",

                                        intent:
                                            "generateFlow",

                                        flowPlan: {
                                            type:
                                                "flow_plan",

                                            summary:
                                                "Scroll flow.",

                                            steps: [
                                                {
                                                    id:
                                                        "ai-launch-app",

                                                    action:
                                                        "launchApp",

                                                    title:
                                                        "Launch App",

                                                    description:
                                                        "Launch the application.",
                                                },

                                                {
                                                    id:
                                                        "ai-scroll",

                                                    action:
                                                        "scroll",

                                                    title:
                                                        "Scroll",

                                                    description:
                                                        "Scroll down.",

                                                    locatorStrategy:
                                                        null,

                                                    locator:
                                                        null,
                                                },
                                            ],

                                            warnings: [],
                                        },

                                        modificationPlan:
                                            null,
                                    }),
                            },
                        }),
                }),
            ),
        );

        await expect(
            generateAIResponse({
                message:
                    "Buat flow lalu scroll ke bawah",

                context: {
                    nodes: [],
                    edges: [],
                },
            }),
        ).rejects.toThrow(
            'AI action "scroll" is not currently supported by the AI flow applier.',
        );
    },
);

it(
    "rejects an empty generated flow plan",
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
                                            "Saya sudah menyiapkan flow.",

                                        intent:
                                            "generateFlow",

                                        flowPlan: {
                                            type:
                                                "flow_plan",

                                            summary:
                                                "Empty flow.",

                                            steps: [],
                                        },

                                        modificationPlan:
                                            null,
                                    }),
                            },
                        }),
                }),
            ),
        );

        await expect(
            generateAIResponse({
                message:
                    "Buat flow kosong",

                context: {
                    nodes: [],
                    edges: [],
                },
            }),
        ).rejects.toThrow(
            "AI generateFlow response does not contain a valid flow plan.",
        );
    },
);

it(
    "rejects a missing generated flow plan",
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
                                            "Saya tidak dapat membuat flow.",

                                        intent:
                                            "generateFlow",

                                        flowPlan:
                                            null,

                                        modificationPlan:
                                            null,
                                    }),
                            },
                        }),
                }),
            ),
        );

        await expect(
            generateAIResponse({
                message:
                    "Buat flow login",

                context: {
                    nodes: [],
                    edges: [],
                },
            }),
        ).rejects.toThrow(
            "AI generateFlow response does not contain a valid flow plan.",
        );
    },
);

it(
    "parses username and password without leaking the password phrase into username",
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
                                            "Saya sudah menyiapkan flow login.",

                                        intent:
                                            "generateFlow",

                                        flowPlan: {
                                            type:
                                                "flow_plan",

                                            summary:
                                                "Login to the application.",

                                            steps: [
                                                {
                                                    id:
                                                        "ai-launch-app",

                                                    action:
                                                        "launchApp",
                                                },

                                                {
                                                    id:
                                                        "ai-input-username",

                                                    action:
                                                        "input",

                                                    locatorStrategy:
                                                        "accessibilityId",

                                                    locator:
                                                        "username",

                                                    text:
                                                        "upal",
                                                },

                                                {
                                                    id:
                                                        "ai-input-password",

                                                    action:
                                                        "input",

                                                    locatorStrategy:
                                                        "accessibilityId",

                                                    locator:
                                                        "password",

                                                    text:
                                                        "354354",
                                                },

                                                {
                                                    id:
                                                        "ai-tap-login",

                                                    action:
                                                        "tap",

                                                    locatorStrategy:
                                                        "accessibilityId",

                                                    locator:
                                                        "Login",
                                                },
                                            ],
                                        },

                                        modificationPlan:
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
                    "Buat flow login dengan username upal dan password 354354",

                context: {
                    nodes: [],
                    edges: [],
                },
            });

        const usernameStep =
            result.flowPlan.steps.find(
                (step) =>
                    step.locator ===
                    "username",
            );

        const passwordStep =
            result.flowPlan.steps.find(
                (step) =>
                    step.locator ===
                    "password",
            );

        expect(
            usernameStep?.text,
        ).toBe(
            "upal",
        );

        expect(
            usernameStep?.text,
        ).not.toContain(
            "password",
        );

        expect(
            passwordStep?.text,
        ).toBe(
            "354354",
        );
    },
);

it(
    "parses credentials from labeled username and password values",
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
                                            "Saya sudah menyiapkan flow login.",

                                        intent:
                                            "generateFlow",

                                        flowPlan: {
                                            type:
                                                "flow_plan",

                                            summary:
                                                "Login to the application.",

                                            steps: [
                                                {
                                                    id:
                                                        "ai-launch-app",

                                                    action:
                                                        "launchApp",
                                                },

                                                {
                                                    id:
                                                        "ai-input-username",

                                                    action:
                                                        "input",

                                                    locatorStrategy:
                                                        "accessibilityId",

                                                    locator:
                                                        "username",

                                                    text:
                                                        "upal",
                                                },

                                                {
                                                    id:
                                                        "ai-input-password",

                                                    action:
                                                        "input",

                                                    locatorStrategy:
                                                        "accessibilityId",

                                                    locator:
                                                        "password",

                                                    text:
                                                        "354354",
                                                },

                                                {
                                                    id:
                                                        "ai-tap-login",

                                                    action:
                                                        "tap",

                                                    locatorStrategy:
                                                        "accessibilityId",

                                                    locator:
                                                        "Login",
                                                },
                                            ],
                                        },

                                        modificationPlan:
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
                    "Buat flow login dengan username: upal, password: 354354",

                context: {
                    nodes: [],
                    edges: [],
                },
            });

        const usernameStep =
            result.flowPlan.steps.find(
                (step) =>
                    step.locator ===
                    "username",
            );

        const passwordStep =
            result.flowPlan.steps.find(
                (step) =>
                    step.locator ===
                    "password",
            );

        expect(
            usernameStep?.text,
        ).toBe(
            "upal",
        );

        expect(
            passwordStep?.text,
        ).toBe(
            "354354",
        );
    },
);

it(
    "parses credentials when password is provided before username",
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
                                            "Saya sudah menyiapkan flow login.",

                                        intent:
                                            "generateFlow",

                                        flowPlan: {
                                            type:
                                                "flow_plan",

                                            summary:
                                                "Login to the application.",

                                            steps: [
                                                {
                                                    id:
                                                        "ai-launch-app",

                                                    action:
                                                        "launchApp",
                                                },

                                                {
                                                    id:
                                                        "ai-input-username",

                                                    action:
                                                        "input",

                                                    locatorStrategy:
                                                        "accessibilityId",

                                                    locator:
                                                        "username",

                                                    text:
                                                        "upal",
                                                },

                                                {
                                                    id:
                                                        "ai-input-password",

                                                    action:
                                                        "input",

                                                    locatorStrategy:
                                                        "accessibilityId",

                                                    locator:
                                                        "password",

                                                    text:
                                                        "354354",
                                                },

                                                {
                                                    id:
                                                        "ai-tap-login",

                                                    action:
                                                        "tap",

                                                    locatorStrategy:
                                                        "accessibilityId",

                                                    locator:
                                                        "Login",
                                                },
                                            ],
                                        },

                                        modificationPlan:
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
                    "Buat flow login dengan password: 354354, username: upal",

                context: {
                    nodes: [],
                    edges: [],
                },
            });

        const usernameStep =
            result.flowPlan.steps.find(
                (step) =>
                    step.locator ===
                    "username",
            );

        const passwordStep =
            result.flowPlan.steps.find(
                (step) =>
                    step.locator ===
                    "password",
            );

        expect(
            usernameStep?.text,
        ).toBe(
            "upal",
        );

        expect(
            passwordStep?.text,
        ).toBe(
            "354354",
        );
    },
);

it(
    "analyzes an empty flow without generating or modifying a plan",
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
                                            "The model response is not used for flow analysis.",

                                        intent:
                                            "analyzeFlow",

                                        flowPlan:
                                            null,

                                        modificationPlan:
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
                    "Analisis flow ini",

                context: {
                    nodes: [],

                    edges: [],
                },
            });

        expect(
            result.intent,
        ).toBe(
            "analyzeFlow",
        );

        expect(
            result.flowPlan,
        ).toBeNull();

        expect(
            result.modificationPlan,
        ).toBeUndefined();

        expect(
            result.message,
        ).toBe(
            "Flow saat ini masih kosong. Belum ada node atau edge yang dibuat.",
        );
    },
);

it(
    "analyzes a flow with nodes and edges without generating a plan",
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
                                            "Model response is ignored for flow analysis.",

                                        intent:
                                            "analyzeFlow",

                                        flowPlan:
                                            null,

                                        modificationPlan:
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
                    "Analisis flow ini",

                context: {
                    nodes: [
                        {
                            id:
                                "launch-1",

                            title:
                                "Launch App",

                            action:
                                "launchApp",
                        },

                        {
                            id:
                                "login-1",

                            title:
                                "Login",

                            action:
                                "tap",

                            locatorStrategy:
                                "accessibilityId",

                            locator:
                                "Login",
                        },
                    ],

                    edges: [
                        {
                            id:
                                "edge-1",

                            source:
                                "launch-1",

                            target:
                                "login-1",
                        },
                    ],
                },
            });

        expect(
            result.intent,
        ).toBe(
            "analyzeFlow",
        );

        expect(
            result.flowPlan,
        ).toBeNull();

        expect(
            result.modificationPlan,
        ).toBeUndefined();

        expect(
            result.message,
        ).toContain(
            "## Ringkasan Flow",
        );

        expect(
            result.message,
        ).toContain(
            "Flow saat ini memiliki 2 node dan 1 edge.",
        );

        expect(
            result.message,
        ).toContain(
            "## Urutan Flow",
        );

        expect(
            result.message,
        ).toContain(
            "Launch App",
        );

        expect(
            result.message,
        ).toContain(
            "Login [accessibilityId=Login]",
        );

        expect(
            result.message,
        ).toContain(
            "## Summary",
        );

        expect(
            result.message,
        ).toContain(
            "1 tap.",
        );

        expect(
            result.message,
        ).toContain(
            "## Hal yang Perlu Ditinjau",
        );

        expect(
            result.message,
        ).toContain(
            "Belum ada node assertion pada flow saat ini.",
        );
    },
);

it(
    "analyzes the selected node with execution evidence",
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
                                            "Model response is ignored for selected node analysis.",

                                        intent:
                                            "analyzeSelectedNode",

                                        flowPlan:
                                            null,

                                        modificationPlan:
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
                    "Jelaskan node yang dipilih",

                context: {
                    selectedNodeId:
                        "login-1",

                    selectedNode: {
                        id:
                            "login-1",

                        title:
                            "Login",

                        action:
                            "tap",

                        subtitle:
                            "Tap the Login button.",

                        locatorStrategy:
                            "accessibilityId",

                        locator:
                            "Login",
                    },

                    nodes: [
                        {
                            id:
                                "login-1",

                            title:
                                "Login",

                            action:
                                "tap",

                            subtitle:
                                "Tap the Login button.",

                            locatorStrategy:
                                "accessibilityId",

                            locator:
                                "Login",
                        },
                    ],

                    edges: [],

                    execution: {
                        nodeStatus: {
                            "login-1":
                                "passed",
                        },

                        nodeResults: {
                            "login-1": {
                                nodeId:
                                    "login-1",

                                nodeTitle:
                                    "Login",

                                status:
                                    "passed",

                                startedAt:
                                    1000,

                                finishedAt:
                                    1250,

                                duration:
                                    250,

                                locatorStrategy:
                                    "accessibilityId",

                                locator:
                                    "Login",
                            },
                        },
                    },
                },
            });

        expect(
            result.intent,
        ).toBe(
            "analyzeSelectedNode",
        );

        expect(
            result.flowPlan,
        ).toBeNull();

        expect(
    result.modificationPlan,
).toBeNull();

        expect(
            result.message,
        ).toContain(
            "## Execution",
        );

        expect(
            result.message,
        ).toContain(
            "Status: passed",
        );

        expect(
            result.message,
        ).toContain(
            "Duration: 250ms",
        );

        expect(
            result.message,
        ).toContain(
            "Executed locator strategy: accessibilityId",
        );

        expect(
            result.message,
        ).toContain(
            "Executed locator: Login",
        );

        expect(
    result.message,
).toContain(
    "## Node yang Dipilih",
);

        expect(
            result.message,
        ).toContain(
            "Login",
        );

        expect(
            result.message,
        ).toContain(
            "## Action",
        );

        expect(
            result.message,
        ).toContain(
            "tap",
        );

        expect(
            result.message,
        ).toContain(
            "## Locator",
        );

        expect(
            result.message,
        ).toContain(
            "accessibilityId=Login",
        );

        expect(
    result.message,
).toContain(
    "## Deskripsi",
);

expect(
    result.message,
).toContain(
    "Tap the Login button.",
);

expect(
    result.message,
).toContain(
    "## Posisi di Flow",
);

expect(
    result.message,
).toContain(
    "Node sebelumnya: 0",
);

expect(
    result.message,
).toContain(
    "Node berikutnya: 0",
);

expect(
    result.message,
).toContain(
    "## Review",
);

expect(
    result.message,
).toContain(
    "Node sudah memiliki locator strategy dan locator.",
);
    },
);

it(
    "analyzes a failed selected node with execution error evidence",
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
                                            "Model response is ignored for selected node analysis.",

                                        intent:
                                            "analyzeSelectedNode",

                                        flowPlan:
                                            null,

                                        modificationPlan:
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
                    "Kenapa node yang dipilih gagal?",

                context: {
                    selectedNodeId:
                        "login-1",

                    selectedNode: {
                        id:
                            "login-1",

                        title:
                            "Login",

                        action:
                            "tap",

                        subtitle:
                            "Tap the Login button.",

                        locatorStrategy:
                            "accessibilityId",

                        locator:
                            "Login",
                    },

                    nodes: [
                        {
                            id:
                                "login-1",

                            title:
                                "Login",

                            action:
                                "tap",

                            subtitle:
                                "Tap the Login button.",

                            locatorStrategy:
                                "accessibilityId",

                            locator:
                                "Login",
                        },
                    ],

                    edges: [],

                    execution: {
                        nodeStatus: {
                            "login-1":
                                "failed",
                        },

                        nodeResults: {
                            "login-1": {
                                nodeId:
                                    "login-1",

                                nodeTitle:
                                    "Login",

                                status:
                                    "failed",

                                startedAt:
                                    1000,

                                finishedAt:
                                    1400,

                                duration:
                                    400,

                                error:
                                    "Element with accessibilityId 'Login' was not found.",

                                locatorStrategy:
                                    "accessibilityId",

                                locator:
                                    "Login",
                            },
                        },
                    },
                },
            });

        expect(
            result.intent,
        ).toBe(
            "analyzeSelectedNode",
        );

        expect(
            result.flowPlan,
        ).toBeNull();

        expect(
            result.modificationPlan,
        ).toBeNull();

        expect(
            result.message,
        ).toContain(
            "## Execution",
        );

        expect(
            result.message,
        ).toContain(
            "Status: failed",
        );

        expect(
            result.message,
        ).toContain(
            "Duration: 400ms",
        );

        expect(
            result.message,
        ).toContain(
            "Error: Element with accessibilityId 'Login' was not found.",
        );

        expect(
            result.message,
        ).toContain(
            "Executed locator strategy: accessibilityId",
        );

        expect(
            result.message,
        ).toContain(
            "Executed locator: Login",
        );

        expect(
            result.message,
        ).toContain(
            "## Node yang Dipilih",
        );

        expect(
            result.message,
        ).toContain(
            "Login",
        );

        expect(
            result.message,
        ).toContain(
            "## Review",
        );
    },
);

it(
    "uses the first failed execution history result for selected node analysis",
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
                                            "Model response is ignored for selected node analysis.",

                                        intent:
                                            "analyzeSelectedNode",

                                        flowPlan:
                                            null,

                                        modificationPlan:
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
                    "Kenapa node yang dipilih gagal?",

                context: {
                    selectedNodeId:
                        "login-1",

                    selectedNode: {
                        id:
                            "login-1",

                        title:
                            "Login",

                        action:
                            "tap",

                        locatorStrategy:
                            "accessibilityId",

                        locator:
                            "Login",
                    },

                    nodes: [
                        {
                            id:
                                "login-1",

                            title:
                                "Login",

                            action:
                                "tap",

                            locatorStrategy:
                                "accessibilityId",

                            locator:
                                "Login",
                        },
                    ],

                    edges: [],

                    execution: {
                        nodeStatus: {
                            "login-1":
                                "passed",
                        },

                        nodeResults: {
                            "login-1": {
                                status:
                                    "passed",

                                error:
                                    "latest-result-error",
                            },
                        },

                        nodeExecutionHistory: {
                            "login-1": [
                                {
                                    status:
                                        "passed",

                                    startedAt:
                                        1000,

                                    finishedAt:
                                        1100,

                                    error:
                                        null,
                                },

                                {
                                    status:
                                        "failed",

                                    startedAt:
                                        1200,

                                    finishedAt:
                                        1500,

                                    error:
                                        "first-failure",
                                },

                                {
                                    status:
                                        "failed",

                                    startedAt:
                                        1600,

                                    finishedAt:
                                        1900,

                                    error:
                                        "second-failure",
                                },
                            ],
                        },
                    },
                },
            });

        expect(
            result.intent,
        ).toBe(
            "analyzeSelectedNode",
        );

        expect(
            result.flowPlan,
        ).toBeNull();

        expect(
            result.modificationPlan,
        ).toBeNull();

        expect(
            result.message,
        ).toContain(
            "Status: failed",
        );

        expect(
            result.message,
        ).toContain(
            "Duration: 300ms",
        );

        expect(
            result.message,
        ).toContain(
            "Error: first-failure",
        );

        expect(
            result.message,
        ).not.toContain(
            "second-failure",
        );

        expect(
            result.message,
        ).not.toContain(
            "latest-result-error",
        );
    },
);

it(
    "analyzes execution failure without generating or modifying a plan",
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
                                            "Execution failed because the Login element was not found.",

                                        intent:
                                            "analyzeExecution",

                                        flowPlan:
                                            null,

                                        modificationPlan:
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
                    "Kenapa execution gagal?",

                context: {
                    execution: {
                        status:
                            "failed",

                        statistics: {
                            progress:
                                100,

                            executedNodes:
                                2,

                            totalNodes:
                                2,

                            passedNodes:
                                1,

                            failedNodes:
                                1,

                            skippedNodes:
                                0,
                        },

                        timing: {
                            duration:
                                1250,
                        },

                        nodeResults: {
                            "login-1": {
                                status:
                                    "failed",

                                error:
                                    "Login element not found",

                                duration:
                                    500,

                                locatorStrategy:
                                    "accessibilityId",

                                locator:
                                    "Login",
                            },
                        },
                    },

                    environment: {
                        platform:
                            "iOS",

                        platformVersion:
                            "18.6",

                        deviceName:
                            "iPhone 15",
                    },
                },
            });

        expect(
            result.intent,
        ).toBe(
            "analyzeExecution",
        );

        expect(
            result.flowPlan,
        ).toBeNull();

        expect(
            result.modificationPlan,
        ).toBeNull();

        expect(
            result.message,
        ).toContain(
            "Status: failed",
        );

        expect(
            result.message,
        ).toContain(
            "Progress: 100%",
        );

        expect(
            result.message,
        ).toContain(
            "Passed: 1/2",
        );

        expect(
            result.message,
        ).toContain(
            "Failed: 1",
        );

        expect(
            result.message,
        ).toContain(
            "Skipped: 0",
        );
    },
);

it(
    "returns an evidence fallback when execution context is missing",
    async () => {
        vi.stubGlobal(
            "fetch",
            vi.fn(),
        );

        const result =
            await generateAIResponse({
                message:
                    "Kenapa execution gagal?",

                context: {},
            });

        expect(
            result.intent,
        ).toBe(
            "analyzeExecution",
        );

        expect(
            result.flowPlan,
        ).toBeNull();

        expect(
            result.modificationPlan,
        ).toBeNull();

        expect(
            result.message,
        ).toContain(
            "not enough execution evidence",
        );

        expect(
            fetch,
        ).not.toHaveBeenCalled();
    },
);

it(
    "reports insufficient evidence when execution failure has no diagnostic evidence",
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
                                            "Execution failed, but the available evidence is insufficient to determine the root cause.",

                                        intent:
                                            "analyzeExecution",

                                        flowPlan:
                                            null,

                                        modificationPlan:
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
                    "Kenapa execution gagal?",

                context: {
                    execution: {
                        status:
                            "failed",

                        statistics: {
                            progress:
                                100,

                            executedNodes:
                                1,

                            totalNodes:
                                1,

                            passedNodes:
                                0,

                            failedNodes:
                                1,

                            skippedNodes:
                                0,
                        },

                        nodeResults: {
                            "login-1": {
    nodeId:
        "login-1",

    status:
        "failed",
},
                        },
                    },
                },
            });

        expect(
            result.intent,
        ).toBe(
            "analyzeExecution",
        );

        expect(
            result.flowPlan,
        ).toBeNull();

        expect(
            result.modificationPlan,
        ).toBeNull();

        expect(
            result.message,
        ).toContain(
            "insufficient",
        );
    },
);

it(
    "reviews flow quality without generating or modifying a plan",
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
                                            "The flow ends without validation.",
                                        intent:
                                            "reviewFlow",
                                        flowPlan:
                                            null,
                                        modificationPlan:
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
                    "Review kualitas flow ini",

                context: {
                    nodes: [
                        {
                            id:
                                "tap-1",

                            action:
                                "tap",

                            title:
                                "Login",

                            locatorStrategy:
                                "accessibilityId",

                            locator:
                                "Login",
                        },
                    ],

                    edges: [],
                },
            });

        expect(
            result.intent,
        ).toBe(
            "reviewFlow",
        );

        expect(
            result.flowPlan,
        ).toBeNull();

        expect(
            result.modificationPlan,
        ).toBeNull();

        expect(
            result.message,
        ).toContain(
            "## Review Kualitas Flow",
        );

        expect(
            result.message,
        ).toContain(
            "Quality Score:",
        );

        expect(
            result.message,
        ).toContain(
            "## Prioritas Perbaikan",
        );

        expect(
            result.message,
        ).toContain(
            "Flow ends without validation",
        );
    },
);

it(
    "returns a fallback when no node is selected",
    async () => {
        const result =
            await generateAIResponse({
                message:
                    "Jelaskan node yang dipilih",

                context: {
                    nodes: [],
                    edges: [],
                    selectedNode:
                        null,
                },
            });

        expect(
            result.intent,
        ).toBe(
            "analyzeSelectedNode",
        );

        expect(
            result.flowPlan,
        ).toBeNull();

        expect(
            result.modificationPlan,
        ).toBeNull();

        expect(
            result.message,
        ).toContain(
            "Belum ada node yang dipilih",
        );
    },
);

it(
    "analyzes the selected node without flow nodes or edges context",
    async () => {
        const result =
            await generateAIResponse({
                message:
                    "Jelaskan node yang dipilih",

                context: {
                    selectedNode: {
                        id:
                            "login-1",

                        action:
                            "tap",

                        title:
                            "Login",

                        subtitle:
                            "Tap the Login button.",

                        locatorStrategy:
                            "accessibilityId",

                        locator:
                            "Login",
                    },
                },
            });

        expect(
            result.intent,
        ).toBe(
            "analyzeSelectedNode",
        );

        expect(
            result.flowPlan,
        ).toBeNull();

        expect(
            result.modificationPlan,
        ).toBeNull();

        expect(
            result.message,
        ).toContain(
            "Login",
        );

        expect(
            result.message,
        ).toContain(
            "Node sebelumnya: 0",
        );

        expect(
            result.message,
        ).toContain(
            "Node berikutnya: 0",
        );
    },
);

it(
    "includes previous and next nodes in selected node analysis",
    async () => {
        const result =
            await generateAIResponse({
                message:
                    "Jelaskan node yang dipilih",

                context: {
                    nodes: [
                        {
                            id:
                                "username-1",

                            action:
                                "input",

                            title:
                                "Username",

                            locatorStrategy:
                                "accessibilityId",

                            locator:
                                "username",
                        },

                        {
                            id:
                                "login-1",

                            action:
                                "tap",

                            title:
                                "Login",

                            subtitle:
                                "Tap the Login button.",

                            locatorStrategy:
                                "accessibilityId",

                            locator:
                                "Login",
                        },

                        {
                            id:
                                "dashboard-1",

                            action:
                                "getDisplayed",

                            title:
                                "Dashboard",

                            locatorStrategy:
                                "accessibilityId",

                            locator:
                                "Dashboard",
                        },
                    ],

                    edges: [
                        {
                            id:
                                "edge-username-login",

                            source:
                                "username-1",

                            target:
                                "login-1",
                        },

                        {
                            id:
                                "edge-login-dashboard",

                            source:
                                "login-1",

                            target:
                                "dashboard-1",
                        },
                    ],

                    selectedNode: {
                        id:
                            "login-1",

                        action:
                            "tap",

                        title:
                            "Login",

                        subtitle:
                            "Tap the Login button.",

                        locatorStrategy:
                            "accessibilityId",

                        locator:
                            "Login",
                    },
                },
            });

        expect(
            result.intent,
        ).toBe(
            "analyzeSelectedNode",
        );

        expect(
            result.flowPlan,
        ).toBeNull();

        expect(
            result.modificationPlan,
        ).toBeNull();

        expect(
            result.message,
        ).toContain(
            "Node sebelumnya: 1",
        );

        expect(
            result.message,
        ).toContain(
            "Node berikutnya: 1",
        );

        expect(
            result.message,
        ).toContain(
            "Username",
        );

        expect(
            result.message,
        ).toContain(
            "Dashboard",
        );
    },
);

it(
    "analyzes branching relationships around the selected node",
    async () => {
        const result =
            await generateAIResponse({
                message:
                    "Jelaskan node yang dipilih",

                context: {
                    nodes: [
                        {
                            id:
                                "start-1",

                            action:
                                "launchApp",

                            title:
                                "Launch App",
                        },

                        {
                            id:
                                "start-2",

                            action:
                                "input",

                            title:
                                "Username",
                        },

                        {
                            id:
                                "login-1",

                            action:
                                "tap",

                            title:
                                "Login",

                            locatorStrategy:
                                "accessibilityId",

                            locator:
                                "Login",
                        },

                        {
                            id:
                                "dashboard-1",

                            action:
                                "getDisplayed",

                            title:
                                "Dashboard",
                        },

                        {
                            id:
                                "error-1",

                            action:
                                "getDisplayed",

                            title:
                                "Error Message",
                        },
                    ],

                    edges: [
                        {
                            id:
                                "edge-start-login-1",

                            source:
                                "start-1",

                            target:
                                "login-1",
                        },

                        {
                            id:
                                "edge-start-login-2",

                            source:
                                "start-2",

                            target:
                                "login-1",
                        },

                        {
                            id:
                                "edge-login-dashboard",

                            source:
                                "login-1",

                            target:
                                "dashboard-1",
                        },

                        {
                            id:
                                "edge-login-error",

                            source:
                                "login-1",

                            target:
                                "error-1",
                        },
                    ],

                    selectedNode: {
                        id:
                            "login-1",

                        action:
                            "tap",

                        title:
                            "Login",

                        locatorStrategy:
                            "accessibilityId",

                        locator:
                            "Login",
                    },
                },
            });

        expect(
            result.intent,
        ).toBe(
            "analyzeSelectedNode",
        );

        expect(
            result.flowPlan,
        ).toBeNull();

        expect(
            result.modificationPlan,
        ).toBeNull();

        expect(
            result.message,
        ).toContain(
            "Node sebelumnya: 2",
        );

        expect(
            result.message,
        ).toContain(
            "Node berikutnya: 2",
        );

        expect(
            result.message,
        ).toContain(
            "Sebelumnya: Launch App, Username",
        );

        expect(
            result.message,
        ).toContain(
            "Berikutnya: Dashboard, Error Message",
        );

        expect(
            result.message,
        ).toContain(
            "## Branching",
        );

        expect(
            result.message,
        ).toContain(
            "Node ini memiliki lebih dari satu cabang keluaran.",
        );
    },
);

it(
    "warns about XPath stability in selected node analysis",
    async () => {
        const result =
            await generateAIResponse({
                message:
                    "Jelaskan node yang dipilih",

                context: {
                    selectedNode: {
                        id:
                            "login-1",

                        action:
                            "tap",

                        title:
                            "Login",

                        locatorStrategy:
                            "xpath",

                        locator:
                            "//button[@text='Login']",
                    },
                },
            });

        expect(
            result.intent,
        ).toBe(
            "analyzeSelectedNode",
        );

        expect(
            result.flowPlan,
        ).toBeNull();

        expect(
            result.modificationPlan,
        ).toBeNull();

        expect(
            result.message,
        ).toContain(
            "## Review",
        );

        expect(
            result.message,
        ).toContain(
            "Node menggunakan XPath.",
        );

        expect(
            result.message,
        ).toContain(
            "verifikasi kestabilan locator",
        );
    },
);

it(
    "warns when selected locator-based node has incomplete locator data",
    async () => {
        const result =
            await generateAIResponse({
                message:
                    "Jelaskan node yang dipilih",

                context: {
                    selectedNode: {
                        id:
                            "login-1",

                        action:
                            "tap",

                        title:
                            "Login",

                        subtitle:
                            "Tap the Login button.",

                        locatorStrategy:
                            null,

                        locator:
                            null,
                    },
                },
            });

        expect(
            result.intent,
        ).toBe(
            "analyzeSelectedNode",
        );

        expect(
            result.flowPlan,
        ).toBeNull();

        expect(
            result.modificationPlan,
        ).toBeNull();

        expect(
            result.message,
        ).toContain(
            "## Review",
        );

        expect(
            result.message,
        ).toContain(
            "Node berbasis locator ini belum memiliki data locator yang lengkap.",
        );
    },
);

it(
    "diagnoses locator mismatch using page source evidence",
    async () => {
        const result =
            await generateAIResponse({
                message:
                    "Kenapa execution gagal?",

                context: {
                    execution: {
                        status:
                            "failed",

                        statistics: {
                            progress:
                                100,

                            executedNodes:
                                1,

                            totalNodes:
                                1,

                            passedNodes:
                                0,

                            failedNodes:
                                1,

                            skippedNodes:
                                0,
                        },

                        nodeResults: {
                            "login-1": {
                                nodeId:
                                    "login-1",

                                status:
                                    "failed",

                                error:
                                    "Element not found",

                                locator:
                                    'name == "Login"',

                                pageSource:
                                    "<hierarchy><button name=\"Submit\" /></hierarchy>",
                            },
                        },
                    },
                },
            });

        expect(
            result.intent,
        ).toBe(
            "analyzeExecution",
        );

        expect(
            result.flowPlan,
        ).toBeNull();

        expect(
            result.modificationPlan,
        ).toBeNull();

        expect(
            result.message,
        ).toContain(
            "### Diagnosis",
        );

        expect(
            result.message,
        ).toContain(
            '"Login"',
        );

        expect(
            result.message,
        ).toContain(
            "does not match the element currently present in the UI.",
        );
    },
);

it(
    "does not report locator mismatch when page source contains the configured value",
    async () => {
        const result =
            await generateAIResponse({
                message:
                    "Why did the execution fail?",

                context: {
                    execution: {
                        status:
                            "failed",

                        statistics: {
                            progress:
                                100,

                            executedNodes:
                                1,

                            totalNodes:
                                1,

                            passedNodes:
                                0,

                            failedNodes:
                                1,

                            skippedNodes:
                                0,
                        },

                        nodeResults: {
                            "login-1": {
                                nodeId:
                                    "login-1",

                                status:
                                    "failed",

                                error:
                                    "Element not interactable",

                                locator:
                                    'name == "Login"',

                                pageSource:
                                    '<hierarchy><button name="Login" /></hierarchy>',
                            },
                        },
                    },
                },
            });

        expect(
            result.intent,
        ).toBe(
            "analyzeExecution",
        );

        expect(
            result.flowPlan,
        ).toBeNull();

        expect(
            result.modificationPlan,
        ).toBeNull();

        expect(
            result.message,
        ).toContain(
            'name == "Login"',
        );

        expect(
            result.message,
        ).not.toContain(
            "### Diagnosis",
        );

        expect(
            result.message,
        ).not.toContain(
            "does not match the element currently present in the UI.",
        );
    },
);

it(
    "reports incomplete locator findings in flow review",
    async () => {
        const result =
            await generateAIResponse({
                message:
                    "Review flow ini.",

                context: {
                    nodes: [
                        {
                            id: "login-1",
                            action: "tap",
                            title: "Login",
                            locator: "",
                            locatorStrategy:
                                "",
                        },
                    ],

                    edges: [],
                },
            });

        expect(
            result.intent,
        ).toBe(
            "reviewFlow",
        );

        expect(
            result.flowPlan,
        ).toBeNull();

        expect(
            result.modificationPlan,
        ).toBeNull();

        expect(
            result.message,
        ).toContain(
            "Incomplete locator",
        );

        expect(
            result.message,
        ).toContain(
            "does not have complete locator data.",
        );

        expect(
            result.message,
        ).toContain(
            "Configure both locator strategy and locator",
        );
    },
);

it(
    "reports fragile XPath findings in flow review",
    async () => {
        const result =
            await generateAIResponse({
                message:
                    "Review flow ini.",

                context: {
                    nodes: [
                        {
                            id: "login-1",
                            action: "tap",
                            title: "Login",
                            locatorStrategy:
                                "xpath",
                            locator:
                                "//XCUIElementTypeWindow/XCUIElementTypeOther/XCUIElementTypeOther/XCUIElementTypeButton/XCUIElementTypeOther",
                        },
                    ],

                    edges: [],
                },
            });

        expect(
            result.intent,
        ).toBe(
            "reviewFlow",
        );

        expect(
            result.flowPlan,
        ).toBeNull();

        expect(
            result.modificationPlan,
        ).toBeNull();

        expect(
            result.message,
        ).toContain(
            "Potentially fragile XPath",
        );

        expect(
            result.message,
        ).toContain(
            "structurally complex XPath",
        );

        expect(
            result.message,
        ).toContain(
            "Prefer a stable accessibility identifier",
        );
    },
);

it(
    "reports stable XPath findings as informational in flow review",
    async () => {
        const result =
            await generateAIResponse({
                message:
                    "Review flow ini.",

                context: {
                    nodes: [
                        {
                            id: "login-1",
                            action: "tap",
                            title: "Login",
                            locatorStrategy:
                                "xpath",
                            locator:
                                "//XCUIElementTypeButton[@name='Login']",
                        },
                    ],

                    edges: [],
                },
            });

        expect(
            result.intent,
        ).toBe(
            "reviewFlow",
        );

        expect(
            result.flowPlan,
        ).toBeNull();

        expect(
            result.modificationPlan,
        ).toBeNull();

        expect(
            result.message,
        ).toContain(
            "XPath locator",
        );

        expect(
            result.message,
        ).toContain(
            "Info: XPath locator",
        );

        expect(
            result.message,
        ).toContain(
            "Temuan informasional: 1",
        );

                expect(
            result.message,
        ).toContain(
            "Verify that the XPath remains stable on the target device.",
        );
    },
);

it(
    "reports multiple review findings with correct severity counts",
    async () => {
        const result =
            await generateAIResponse({
                message:
                    "Review flow ini.",

                context: {
                    nodes: [
                        {
                            id: "login-1",
                            action: "tap",
                            title: "Login",
                            locatorStrategy:
                                "xpath",
                            locator:
                                "",
                        },

                        {
                            id: "dashboard-1",
                            action: "tap",
                            title: "Dashboard",
                            locatorStrategy:
                                "xpath",
                            locator:
                                "//XCUIElementTypeWindow/XCUIElementTypeOther/XCUIElementTypeOther/XCUIElementTypeButton/XCUIElementTypeOther",
                        },
                    ],

                    edges: [
                        {
                            source:
                                "login-1",
                            target:
                                "dashboard-1",
                        },
                    ],
                },
            });

        expect(
            result.intent,
        ).toBe(
            "reviewFlow",
        );

        expect(
            result.flowPlan,
        ).toBeNull();

        expect(
            result.modificationPlan,
        ).toBeNull();

        expect(
            result.message,
        ).toContain(
            "Incomplete locator",
        );

        expect(
            result.message,
        ).toContain(
            "Potentially fragile XPath",
        );

        expect(
            result.message,
        ).toContain(
            "No validation step",
        );

        expect(
            result.message,
        ).toContain(
            "Error:",
        );

        expect(
            result.message,
        ).toContain(
            "Warning:",
        );

        expect(
            result.message,
        ).toContain(
            "Temuan informasional:",
        );
    },
);

it(
    "keeps distinct validation findings without duplicating identical findings",
    async () => {
        const result =
            await generateAIResponse({
                message:
                    "Review flow ini.",

                context: {
                    nodes: [
                        {
                            id: "login-1",
                            action: "tap",
                            title: "Login",
                            locatorStrategy:
                                "accessibilityId",
                            locator:
                                "Login",
                        },
                    ],

                    edges: [],
                },
            });

        expect(
            result.intent,
        ).toBe(
            "reviewFlow",
        );

        expect(
            result.flowPlan,
        ).toBeNull();

        expect(
            result.modificationPlan,
        ).toBeNull();

        expect(
            result.message,
        ).toContain(
            "Missing assertion",
        );

        expect(
            result.message,
        ).toContain(
            "No validation step",
        );

        expect(
            result.message,
        ).toContain(
            "Flow ends without validation",
        );

        const missingAssertionMatches =
            result.message.match(
                /Missing assertion/g,
            ) ?? [];

        expect(
            missingAssertionMatches.length,
        ).toBe(1);

        const noValidationMatches =
            result.message.match(
                /No validation step/g,
            ) ?? [];

        expect(
            noValidationMatches.length,
        ).toBe(1);

        const flowEndsMatches =
            result.message.match(
                /Flow ends without validation/g,
            ) ?? [];

        expect(
            flowEndsMatches.length,
        ).toBe(1);
    },
);

it(
    "gives a high quality score to a healthy validated flow",
    async () => {
        const result =
            await generateAIResponse({
                message:
                    "Review flow ini.",

                context: {
                    nodes: [
                        {
                            id: "launch-1",
                            action: "launchApp",
                            title: "Launch App",
                        },

                        {
                            id: "login-1",
                            action: "tap",
                            title: "Login",
                            locatorStrategy:
                                "accessibilityId",
                            locator:
                                "Login",
                        },

                        {
                            id: "assert-1",
                            action: "assert",
                            title:
                                "Verify Dashboard",
                            locatorStrategy:
                                "accessibilityId",
                            locator:
                                "Dashboard",
                        },
                    ],

                    edges: [
                        {
                            source:
                                "launch-1",
                            target:
                                "login-1",
                        },

                        {
                            source:
                                "login-1",
                            target:
                                "assert-1",
                        },
                    ],
                },
            });

        expect(
            result.intent,
        ).toBe(
            "reviewFlow",
        );

        expect(
            result.flowPlan,
        ).toBeNull();

        expect(
            result.modificationPlan,
        ).toBeNull();

        expect(
            result.message,
        ).toMatch(
            /Quality Score:\*\* \d+\/100/,
        );

        expect(
            result.message,
        ).toContain(
            "Quality Score:",
        );

        expect(
            result.message,
        ).not.toContain(
            "🟠 **Prioritas Tinggi",
        );

        expect(
            result.message,
        ).not.toContain(
            "🟥 **Prioritas Kritis",
        );
    },
);

it(
    "lowers quality score and recommends validation for an unvalidated flow",
    async () => {
        const result =
            await generateAIResponse({
                message:
                    "Review flow ini.",

                context: {
                    nodes: [
                        {
                            id: "launch-1",
                            action: "launchApp",
                            title: "Launch App",
                        },

                        {
                            id: "login-1",
                            action: "tap",
                            title: "Login",
                            locatorStrategy:
                                "accessibilityId",
                            locator:
                                "Login",
                        },
                    ],

                    edges: [
                        {
                            source:
                                "launch-1",
                            target:
                                "login-1",
                        },
                    ],
                },
            });

        expect(
            result.intent,
        ).toBe(
            "reviewFlow",
        );

        expect(
            result.flowPlan,
        ).toBeNull();

        expect(
            result.modificationPlan,
        ).toBeNull();

        expect(
            result.message,
        ).toMatch(
            /Quality Score:\*\* \d+\/100/,
        );

        expect(
            result.message,
        ).toContain(
            "Add final validation",
        );

        expect(
            result.message,
        ).toContain(
            "Suggested fix: `addValidation`",
        );

        expect(
            result.message,
        ).toContain(
            "No validation step",
        );

        expect(
            result.message,
        ).toContain(
            "Flow ends without validation",
        );
    },
);

it(
    "prioritizes incomplete locator findings in flow quality review",
    async () => {
        const result =
            await generateAIResponse({
                message:
                    "Review flow ini.",

                context: {
                    nodes: [
                        {
                            id: "login-1",
                            action: "tap",
                            title: "Login",
                            locatorStrategy:
                                "",
                            locator:
                                "",
                        },

                        {
                            id: "assert-1",
                            action: "assert",
                            title:
                                "Verify Dashboard",
                            locatorStrategy:
                                "accessibilityId",
                            locator:
                                "Dashboard",
                        },
                    ],

                    edges: [
                        {
                            source:
                                "login-1",
                            target:
                                "assert-1",
                        },
                    ],
                },
            });

        expect(
            result.intent,
        ).toBe(
            "reviewFlow",
        );

        expect(
            result.flowPlan,
        ).toBeNull();

        expect(
            result.modificationPlan,
        ).toBeNull();

        expect(
            result.message,
        ).toContain(
            "Incomplete locator",
        );

        expect(
            result.message,
        ).toContain(
            "locator",
        );

                expect(
            result.message,
        ).toContain(
            "Prioritas Kritis",
        );

        expect(
            result.message,
        ).toContain(
            "Configure both locator strategy and locator before executing this node.",
        );

        expect(
            result.message,
        ).toContain(
            "Error: Incomplete locator",
        );

        expect(
            result.message,
        ).toContain(
            "Error: 1",
        );

        expect(
            result.message,
        ).toMatch(
            /Quality Score:\*\* \d+\/100/,
        );
    },
);

it(
    "ranks fragile XPath below critical locator errors",
    async () => {
        const result =
            await generateAIResponse({
                message:
                    "Review flow ini.",

                context: {
                    nodes: [
                        {
                            id: "login-1",
                            action: "tap",
                            title: "Login",
                            locatorStrategy:
                                "xpath",
                            locator:
                                "//XCUIElementTypeWindow/XCUIElementTypeOther/XCUIElementTypeOther/XCUIElementTypeButton/XCUIElementTypeOther",
                        },

                        {
                            id: "assert-1",
                            action: "assert",
                            title:
                                "Verify Dashboard",
                            locatorStrategy:
                                "accessibilityId",
                            locator:
                                "Dashboard",
                        },
                    ],

                    edges: [
                        {
                            source:
                                "login-1",
                            target:
                                "assert-1",
                        },
                    ],
                },
            });

        expect(
            result.intent,
        ).toBe(
            "reviewFlow",
        );

        expect(
            result.flowPlan,
        ).toBeNull();

        expect(
            result.modificationPlan,
        ).toBeNull();

        expect(
            result.message,
        ).toMatch(
            /Quality Score:\*\* \d+\/100/,
        );

        expect(
            result.message,
        ).toContain(
            "Potentially fragile XPath",
        );

        expect(
            result.message,
        ).toContain(
            "Prioritas Sedang",
        );

        expect(
            result.message,
        ).toContain(
            "Prefer a stable accessibility identifier, resource ID, predicate, or class-chain when available.",
        );

        expect(
            result.message,
        ).toContain(
            "Warning: Potentially fragile XPath",
        );

        expect(
            result.message,
        ).toContain(
            "Warning: 1",
        );

        expect(
            result.message,
        ).toMatch(
            /Quality Score:\*\* \d+\/100/,
        );
    },
);

it(
    "keeps quality score stable for a warning-only fragile XPath finding",
    async () => {
        const result =
            await generateAIResponse({
                message:
                    "Review flow ini.",

                context: {
                    nodes: [
                        {
                            id: "login-1",
                            action: "tap",
                            title: "Login",
                            locatorStrategy:
                                "accessibilityId",
                            locator:
                                "Login",
                        },
                        {
                            id: "assert-1",
                            action: "assert",
                            title:
                                "Verify Dashboard",
                            locatorStrategy:
                                "accessibilityId",
                            locator:
                                "Dashboard",
                        },
                    ],

                    edges: [
                        {
                            source:
                                "login-1",
                            target:
                                "assert-1",
                        },
                    ],
                },
            });

        expect(
            result.intent,
        ).toBe(
            "reviewFlow",
        );

        expect(
            result.flowPlan,
        ).toBeNull();

        expect(
            result.modificationPlan,
        ).toBeNull();

        expect(
            result.message,
        ).toContain(
            "**Quality Score:** 100/100",
        );

        expect(
            result.message,
        ).toContain(
            "- Error: 0",
        );

        expect(
            result.message,
        ).toContain(
            "- Warning: 0",
        );

        expect(
            result.message,
        ).toContain(
            "- Temuan informasional: 0",
        );
    },
);

it(
    "reduces quality score for a fragile XPath finding",
    async () => {
        const result =
            await generateAIResponse({
                message:
                    "Review flow ini.",

                context: {
                    nodes: [
                        {
                            id: "login-1",
                            action: "tap",
                            title: "Login",
                            locatorStrategy:
                                "xpath",
                            locator:
                                "//XCUIElementTypeWindow/XCUIElementTypeOther/XCUIElementTypeOther/XCUIElementTypeButton/XCUIElementTypeOther",
                        },

                        {
                            id: "assert-1",
                            action: "assert",
                            title:
                                "Verify Dashboard",
                            locatorStrategy:
                                "accessibilityId",
                            locator:
                                "Dashboard",
                        },
                    ],

                    edges: [
                        {
                            source:
                                "login-1",
                            target:
                                "assert-1",
                        },
                    ],
                },
            });

        expect(
            result.intent,
        ).toBe(
            "reviewFlow",
        );

        expect(
            result.flowPlan,
        ).toBeNull();

        expect(
            result.modificationPlan,
        ).toBeNull();

        const scoreMatch =
            result.message.match(
                /\*\*Quality Score:\*\* (\d+)\/100/,
            );

        expect(
            scoreMatch,
        ).not.toBeNull();

        const score =
            Number(
                scoreMatch?.[1],
            );

       expect(
    score,
).toBe(
    100,
);

        expect(
            result.message,
        ).toContain(
            "Warning: Potentially fragile XPath",
        );

        expect(
            result.message,
        ).toContain(
            "- Warning: 1",
        );
    },
);

it(
    "reduces quality score for error findings",
    async () => {
        const result =
            await generateAIResponse({
                message:
                    "Review flow ini.",

                context: {
                    nodes: [
                        {
                            id: "login-1",
                            action: "tap",
                            title: "Login",
                            locatorStrategy:
                                "",
                            locator:
                                "",
                        },

                        {
                            id: "assert-1",
                            action: "assert",
                            title:
                                "Verify Dashboard",
                            locatorStrategy:
                                "accessibilityId",
                            locator:
                                "Dashboard",
                        },
                    ],

                    edges: [
                        {
                            source:
                                "login-1",
                            target:
                                "assert-1",
                        },
                    ],
                },
            });

        expect(
            result.intent,
        ).toBe(
            "reviewFlow",
        );

        expect(
            result.flowPlan,
        ).toBeNull();

        expect(
            result.modificationPlan,
        ).toBeNull();

        expect(
            result.message,
        ).toContain(
            "Error: Incomplete locator",
        );

        const scoreMatch =
            result.message.match(
                /\*\*Quality Score:\*\* (\d+)\/100/,
            );

        expect(
            scoreMatch,
        ).not.toBeNull();

        const score =
            Number(
                scoreMatch?.[1],
            );

        expect(
            score,
        ).toBeLessThan(
            100,
        );

        expect(
            result.message,
        ).toContain(
            "- Error: 1",
        );

        expect(
            result.message,
        ).toContain(
            "Prioritas Kritis",
        );
    },
);

it(
    "applies the error deduction for multiple error findings",
    async () => {
        const result =
            await generateAIResponse({
                message:
                    "Review flow ini.",

                context: {
                    nodes: [
                        {
                            id: "login-1",
                            action: "tap",
                            title: "Login",
                            locatorStrategy:
                                "",
                            locator:
                                "",
                        },

                        {
                            id: "input-1",
                            action: "input",
                            title:
                                "Username",
                            locatorStrategy:
                                "",
                            locator:
                                "",
                        },

                        {
                            id: "assert-1",
                            action: "assert",
                            title:
                                "Verify Dashboard",
                            locatorStrategy:
                                "accessibilityId",
                            locator:
                                "Dashboard",
                        },
                    ],

                    edges: [
                        {
                            source:
                                "login-1",
                            target:
                                "input-1",
                        },
                        {
                            source:
                                "input-1",
                            target:
                                "assert-1",
                        },
                    ],
                },
            });

        expect(
            result.intent,
        ).toBe(
            "reviewFlow",
        );

        expect(
            result.flowPlan,
        ).toBeNull();

        expect(
            result.modificationPlan,
        ).toBeNull();

        expect(
            result.message,
        ).toContain(
            "Error: Incomplete locator",
        );

        const scoreMatch =
            result.message.match(
                /\*\*Quality Score:\*\* (\d+)\/100/,
            );

        expect(
            scoreMatch,
        ).not.toBeNull();

        const score =
            Number(
                scoreMatch?.[1],
            );

        expect(
            score,
        ).toBeLessThan(
            90,
        );

        expect(
            result.message,
        ).toContain(
            "- Error: 2",
        );
    },
);

it(
    "clamps quality score at zero for excessive error findings",
    async () => {
        const result =
            await generateAIResponse({
                message:
                    "Review flow ini.",

                context: {
                    nodes: [
                        {
                            id: "node-1",
                            action: "tap",
                            title: "Node 1",
                            locatorStrategy: "",
                            locator: "",
                        },
                        {
                            id: "node-2",
                            action: "tap",
                            title: "Node 2",
                            locatorStrategy: "",
                            locator: "",
                        },
                        {
                            id: "node-3",
                            action: "tap",
                            title: "Node 3",
                            locatorStrategy: "",
                            locator: "",
                        },
                        {
                            id: "node-4",
                            action: "tap",
                            title: "Node 4",
                            locatorStrategy: "",
                            locator: "",
                        },
                        {
                            id: "node-5",
                            action: "tap",
                            title: "Node 5",
                            locatorStrategy: "",
                            locator: "",
                        },
                        {
                            id: "node-6",
                            action: "tap",
                            title: "Node 6",
                            locatorStrategy: "",
                            locator: "",
                        },
                        {
                            id: "node-7",
                            action: "tap",
                            title: "Node 7",
                            locatorStrategy: "",
                            locator: "",
                        },
                        {
                            id: "node-8",
                            action: "tap",
                            title: "Node 8",
                            locatorStrategy: "",
                            locator: "",
                        },
                        {
                            id: "node-9",
                            action: "tap",
                            title: "Node 9",
                            locatorStrategy: "",
                            locator: "",
                        },
                        {
                            id: "node-10",
                            action: "tap",
                            title: "Node 10",
                            locatorStrategy: "",
                            locator: "",
                        },
                    ],

                    edges: [],
                },
            });

        expect(
            result.intent,
        ).toBe(
            "reviewFlow",
        );

        expect(
            result.flowPlan,
        ).toBeNull();

        expect(
            result.modificationPlan,
        ).toBeNull();

        const scoreMatch =
            result.message.match(
                /\*\*Quality Score:\*\* (\d+)\/100/,
            );

        expect(
            scoreMatch,
        ).not.toBeNull();

        const score =
            Number(
                scoreMatch?.[1],
            );

        expect(
            score,
        ).toBe(
            0,
        );

        expect(
            score,
        ).toBeGreaterThanOrEqual(
            0,
        );
    },
);

it(
    "provides a suggested fix for missing validation findings",
    async () => {
        const result =
            await generateAIResponse({
                message:
                    "Review flow ini.",

                context: {
                    nodes: [
                        {
                            id: "login-1",
                            action: "tap",
                            title: "Login",
                            locatorStrategy:
                                "accessibilityId",
                            locator:
                                "Login",
                        },
                    ],

                    edges: [],
                },
            });

        expect(
            result.intent,
        ).toBe(
            "reviewFlow",
        );

        expect(
            result.flowPlan,
        ).toBeNull();

        expect(
            result.modificationPlan,
        ).toBeNull();

        expect(
            result.message,
        ).toContain(
            "Warning: Missing assertion",
        );

        expect(
            result.message,
        ).toContain(
            "Suggested fix: `addValidation`",
        );
    },
);

it(
    "provides a suggested fix for incomplete locator findings",
    async () => {
        const result =
            await generateAIResponse({
                message:
                    "Review flow ini.",

                context: {
                    nodes: [
                        {
                            id: "login-1",
                            action: "tap",
                            title: "Login",
                            locatorStrategy: "",
                            locator: "",
                        },

                        {
                            id: "assert-1",
                            action: "assert",
                            title:
                                "Verify Dashboard",
                            locatorStrategy:
                                "accessibilityId",
                            locator:
                                "Dashboard",
                        },
                    ],

                    edges: [
                        {
                            source:
                                "login-1",
                            target:
                                "assert-1",
                        },
                    ],
                },
            });

        expect(
            result.intent,
        ).toBe(
            "reviewFlow",
        );

        expect(
            result.flowPlan,
        ).toBeNull();

        expect(
            result.modificationPlan,
        ).toBeNull();

        expect(
            result.message,
        ).toContain(
            "Error: Incomplete locator",
        );

        expect(
            result.message,
        ).toContain(
            "Prioritas Kritis",
        );

        expect(
            result.message,
        ).toContain(
            "Suggested fix: `fixLocator`",
        );
    },
);

it(
    "provides a suggested fix for duplicate locator findings",
    async () => {
        const result =
            await generateAIResponse({
                message:
                    "Review flow ini.",

                context: {
                    nodes: [
                        {
                            id: "login-1",
                            action: "tap",
                            title: "Login",
                            locatorStrategy:
                                "accessibilityId",
                            locator:
                                "Login",
                        },

                        {
                            id: "login-2",
                            action: "tap",
                            title:
                                "Login Again",
                            locatorStrategy:
                                "accessibilityId",
                            locator:
                                "Login",
                        },

                        {
                            id: "assert-1",
                            action: "assert",
                            title:
                                "Verify Dashboard",
                            locatorStrategy:
                                "accessibilityId",
                            locator:
                                "Dashboard",
                        },
                    ],

                    edges: [
                        {
                            source:
                                "login-1",
                            target:
                                "login-2",
                        },

                        {
                            source:
                                "login-2",
                            target:
                                "assert-1",
                        },
                    ],
                },
            });

        expect(
            result.intent,
        ).toBe(
            "reviewFlow",
        );

        expect(
            result.flowPlan,
        ).toBeNull();

        expect(
            result.modificationPlan,
        ).toBeNull();

        expect(
            result.message,
        ).toContain(
            "Duplicate locator",
        );

        expect(
            result.message,
        ).toContain(
            "Suggested fix: `reviewLocator`",
        );
    },
);

it(
    "targets the affected node in suggested fixes",
    async () => {
        const result =
            await generateAIResponse({
                message:
                    "Review flow ini.",

                context: {
                    nodes: [
                        {
                            id: "login-1",
                            action: "tap",
                            title: "Login",
                            locatorStrategy: "",
                            locator: "",
                        },

                        {
                            id: "assert-1",
                            action: "assert",
                            title:
                                "Verify Dashboard",
                            locatorStrategy:
                                "accessibilityId",
                            locator:
                                "Dashboard",
                        },
                    ],

                    edges: [
                        {
                            source:
                                "login-1",
                            target:
                                "assert-1",
                        },
                    ],
                },
            });

        expect(
            result.intent,
        ).toBe(
            "reviewFlow",
        );

        expect(
            result.message,
        ).toContain(
            "Node: `login-1`",
        );

        expect(
            result.message,
        ).toContain(
            "Suggested fix: `fixLocator`",
        );
    },
);

it(
    "does not report locator mismatch when page source contains the configured value",
    async () => {
        const result =
            await generateAIResponse({
                message:
                    "Kenapa execution gagal?",

                context: {
                    execution: {
                        status:
                            "failed",

                        statistics: {
                            progress:
                                100,

                            executedNodes:
                                1,

                            totalNodes:
                                1,

                            passedNodes:
                                0,

                            failedNodes:
                                1,

                            skippedNodes:
                                0,
                        },

                        nodeResults: {
                            "login-1": {
                                nodeId:
                                    "login-1",

                                status:
                                    "failed",

                                locatorStrategy:
                                    "accessibilityId",

                                locator:
                                    'name == "Login"',

                                error:
                                    "Element not found",

                                pageSource:
                                    '<XCUIElementTypeButton name="Login" />',
                            },
                        },
                    },
                },
            });

        expect(
            result.intent,
        ).toBe(
            "analyzeExecution",
        );

        expect(
            result.message,
        ).not.toContain(
            "does not match the element currently present",
        );

        expect(
            result.message,
        ).not.toContain(
            "locator yang dikonfigurasi tidak cocok",
        );
    },
);

it(
    "diagnoses using the first failed execution result",
    async () => {
        const result =
            await generateAIResponse({
                message:
                    "Kenapa execution gagal?",

                context: {
                    execution: {
                        status:
                            "failed",

                        statistics: {
                            progress:
                                100,

                            executedNodes:
                                2,

                            totalNodes:
                                2,

                            passedNodes:
                                0,

                            failedNodes:
                                2,

                            skippedNodes:
                                0,
                        },

                        nodeResults: {
                            "login-1": {
                                nodeId:
                                    "login-1",

                                status:
                                    "failed",

                                locator:
                                    'name == "Login"',

                                error:
                                    "First failure",

                                pageSource:
                                    "<Screen><Button name=\"Home\" /></Screen>",
                            },

                            "login-2": {
                                nodeId:
                                    "login-2",

                                status:
                                    "failed",

                                locator:
                                    'name == "Dashboard"',

                                error:
                                    "Second failure",

                                pageSource:
                                    "<Screen><Button name=\"Login\" /></Screen>",
                            },
                        },
                    },
                },
            });

        expect(
            result.intent,
        ).toBe(
            "analyzeExecution",
        );

        expect(
            result.message,
        ).toContain(
            '"Login"',
        );

        expect(
            result.message,
        ).toContain(
            'The node failed because the configured locator uses "Login"',
        );

        expect(
            result.message,
        ).not.toContain(
            'The node failed because the configured locator uses "Dashboard"',
        );
    },
);

it(
    "treats screenshot evidence as sufficient diagnostic evidence",
    async () => {
        const result =
            await generateAIResponse({
                message:
                    "Kenapa execution gagal?",

                context: {
                    execution: {
                        status:
                            "failed",

                        statistics: {
                            progress:
                                100,

                            executedNodes:
                                1,

                            totalNodes:
                                1,

                            passedNodes:
                                0,

                            failedNodes:
                                1,

                            skippedNodes:
                                0,
                        },

                        nodeResults: {
                            "login-1": {
                                nodeId:
                                    "login-1",

                                status:
                                    "failed",

                                screenshotFileName:
                                    "login-failure.png",
                            },
                        },
                    },
                },
            });

        expect(
            result.intent,
        ).toBe(
            "analyzeExecution",
        );

        expect(
            result.message,
        ).not.toContain(
            "insufficient",
        );

        expect(
            result.message,
        ).toContain(
            "login-failure.png",
        );
    },
);
    },
);