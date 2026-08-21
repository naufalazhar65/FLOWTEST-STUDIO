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
    },
);