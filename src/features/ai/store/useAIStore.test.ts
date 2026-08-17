import {
    beforeEach,
    describe,
    expect,
    it,
    vi,
} from "vitest";

import {
    useAIStore,
} from "./useAIStore";

import {
    convertAITestCaseToFlow,
    generateAITestCases,
} from "../services/aiClient";

vi.mock(
    "../services/aiClient",
    async () => {
        const actual =
            await vi.importActual<
                typeof import(
                "../services/aiClient"
                )
            >(
                "../services/aiClient",
            );

        return {
            ...actual,

            convertAITestCaseToFlow:
                vi.fn(),

            generateAITestCases:
                vi.fn(),
        };
    },
);

vi.mock(
    "../services/buildFlowContext",
    () => ({
        buildFlowContext:
            vi.fn(() => ({
                selectedNodeId:
                    null,

                selectedNode:
                    null,

                nodes: [],

                edges: [],

                nodeCount:
                    0,

                edgeCount:
                    0,
            })),
    }),
);

const generateAITestCasesMock =
    vi.mocked(
        generateAITestCases,
    );

const convertAITestCaseToFlowMock =
    vi.mocked(
        convertAITestCaseToFlow,
    );

describe(
    "useAIStore",
    () => {
        beforeEach(() => {
            vi.clearAllMocks();

            useAIStore.setState({
                draftPlan:
                    null,

                draftModificationPlan:
                    null,

                draftTestCases:
                    null,

                error:
                    null,

                isGenerating:
                    false,
            });
        });

        describe(
            "generateTestCases",
            () => {
                it(
                    "stores generated test cases",
                    async () => {
                        generateAITestCasesMock.mockResolvedValue(
                            {
                                requirement:
                                    "User should be able to log in.",

                                testCases: [
                                    {
                                        id:
                                            "TC-001",

                                        title:
                                            "Login with valid credentials",

                                        description:
                                            "Verify successful login.",

                                        priority:
                                            "high",

                                        type:
                                            "functional",

                                        preconditions: [
                                            "User is on the login screen",
                                        ],

                                        steps: [
                                            {
                                                order:
                                                    1,

                                                action:
                                                    "Enter username",
                                            },

                                            {
                                                order:
                                                    2,

                                                action:
                                                    "Enter password",
                                            },

                                            {
                                                order:
                                                    3,

                                                action:
                                                    "Tap Login",
                                            },
                                        ],

                                        expectedResult:
                                            "User reaches the home screen.",
                                    },
                                ],
                            },
                        );

                        await useAIStore
                            .getState()
                            .generateTestCases(
                                "User should be able to log in.",
                            );

                        expect(
                            generateAITestCasesMock,
                        ).toHaveBeenCalledTimes(
                            1,
                        );

                        expect(
                            generateAITestCasesMock,
                        ).toHaveBeenCalledWith(
                            "User should be able to log in.",
                        );

                        expect(
                            useAIStore
                                .getState()
                                .draftTestCases,
                        ).toHaveLength(
                            1,
                        );

                        expect(
                            useAIStore
                                .getState()
                                .draftTestCases?.[0]
                                .id,
                        ).toBe(
                            "TC-001",
                        );

                        expect(
                            useAIStore
                                .getState()
                                .isGenerating,
                        ).toBe(
                            false,
                        );

                        expect(
                            useAIStore
                                .getState()
                                .error,
                        ).toBeNull();
                    },
                );

                it(
                    "does nothing for an empty requirement",
                    async () => {
                        await useAIStore
                            .getState()
                            .generateTestCases(
                                "   ",
                            );

                        expect(
                            generateAITestCasesMock,
                        ).not.toHaveBeenCalled();

                        expect(
                            useAIStore
                                .getState()
                                .draftTestCases,
                        ).toBeNull();

                        expect(
                            useAIStore
                                .getState()
                                .isGenerating,
                        ).toBe(
                            false,
                        );
                    },
                );

                it(
                    "clears the draft and stores the error when generation fails",
                    async () => {
                        generateAITestCasesMock.mockRejectedValue(
                            new Error(
                                "AI test-case generation failed.",
                            ),
                        );

                        await expect(
                            useAIStore
                                .getState()
                                .generateTestCases(
                                    "Verify login.",
                                ),
                        ).rejects.toThrow(
                            "AI test-case generation failed.",
                        );

                        expect(
                            useAIStore
                                .getState()
                                .draftTestCases,
                        ).toBeNull();

                        expect(
                            useAIStore
                                .getState()
                                .error,
                        ).toBe(
                            "AI test-case generation failed.",
                        );

                        expect(
                            useAIStore
                                .getState()
                                .isGenerating,
                        ).toBe(
                            false,
                        );
                    },
                );

                it(
                    "sets generating state while the request is pending",
                    async () => {
                        let resolveRequest:
                            | ((
                                value: {
                                    requirement:
                                    string;

                                    testCases:
                                    [];
                                },
                            ) => void)
                            | undefined;

                        generateAITestCasesMock.mockImplementation(
                            () =>
                                new Promise(
                                    (
                                        resolve,
                                    ) => {
                                        resolveRequest =
                                            resolve;
                                    },
                                ),
                        );

                        const promise =
                            useAIStore
                                .getState()
                                .generateTestCases(
                                    "Verify login.",
                                );

                        expect(
                            useAIStore
                                .getState()
                                .isGenerating,
                        ).toBe(
                            true,
                        );

                        resolveRequest?.({
                            requirement:
                                "Verify login.",

                            testCases: [],
                        });

                        await promise;

                        expect(
                            useAIStore
                                .getState()
                                .isGenerating,
                        ).toBe(
                            false,
                        );
                    },
                );
            },
        );

        describe(
            "convertTestCaseToFlow",
            () => {
                const testCase = {
                    id:
                        "TC-001",

                    title:
                        "Login with valid credentials",

                    description:
                        "Verify successful login.",

                    priority:
                        "high" as const,

                    type:
                        "functional" as const,

                    preconditions: [],

                    steps: [
                        {
                            order:
                                1,

                            action:
                                "Tap Login",
                        },
                    ],

                    expectedResult:
                        "Login succeeds.",
                };

                it(
                    "converts an approved test case into a draft flow plan",
                    async () => {
                        convertAITestCaseToFlowMock.mockResolvedValue(
                            {
                                testCaseId:
                                    "TC-001",

                                flowPlan: {
                                    type:
                                        "flow_plan",

                                    summary:
                                        "Login flow",

                                    steps: [
                                        {
                                            id:
                                                "step-1",

                                            action:
                                                "tap",

                                            title:
                                                "Tap Login",

                                            description:
                                                "Tap the Login button.",

                                            locatorStrategy:
                                                "accessibilityId",

                                            locator:
                                                "Login",
                                        },
                                    ],

                                    warnings: [],
                                },
                            },
                        );

                        await useAIStore
                            .getState()
                            .convertTestCaseToFlow(
                                testCase,
                            );

                        expect(
                            convertAITestCaseToFlowMock,
                        ).toHaveBeenCalledTimes(
                            1,
                        );

                        expect(
                            convertAITestCaseToFlowMock,
                        ).toHaveBeenCalledWith({
                            testCase,

                            context: {
                                selectedNodeId:
                                    null,

                                selectedNode:
                                    null,

                                nodes: [],

                                edges: [],

                                nodeCount:
                                    0,

                                edgeCount:
                                    0,
                            },
                        });

                        expect(
                            useAIStore
                                .getState()
                                .draftPlan?.type,
                        ).toBe(
                            "flow_plan",
                        );

                        expect(
                            useAIStore
                                .getState()
                                .draftPlan?.summary,
                        ).toBe(
                            "Login flow",
                        );

                        expect(
                            useAIStore
                                .getState()
                                .draftPlan?.steps,
                        ).toHaveLength(
                            1,
                        );

                        expect(
                            useAIStore
                                .getState()
                                .draftPlan
                                ?.steps[0]
                                .action,
                        ).toBe(
                            "tap",
                        );

                        expect(
                            useAIStore
                                .getState()
                                .draftTestCases,
                        ).toBeNull();

                        expect(
                            useAIStore
                                .getState()
                                .draftModificationPlan,
                        ).toBeNull();

                        expect(
                            useAIStore
                                .getState()
                                .isGenerating,
                        ).toBe(
                            false,
                        );

                        expect(
                            useAIStore
                                .getState()
                                .error,
                        ).toBeNull();
                    },
                );

                it(
                    "stores the error when flow conversion fails",
                    async () => {
                        convertAITestCaseToFlowMock.mockRejectedValue(
                            new Error(
                                "AI flow conversion failed.",
                            ),
                        );

                        await expect(
                            useAIStore
                                .getState()
                                .convertTestCaseToFlow(
                                    testCase,
                                ),
                        ).rejects.toThrow(
                            "AI flow conversion failed.",
                        );

                        expect(
                            useAIStore
                                .getState()
                                .draftPlan,
                        ).toBeNull();

                        expect(
                            useAIStore
                                .getState()
                                .error,
                        ).toBe(
                            "AI flow conversion failed.",
                        );

                        expect(
                            useAIStore
                                .getState()
                                .isGenerating,
                        ).toBe(
                            false,
                        );
                    },
                );

                it(
                    "clears the test-case draft after successful conversion",
                    async () => {
                        useAIStore.setState({
                            draftTestCases: [
                                testCase,
                            ],
                        });

                        convertAITestCaseToFlowMock.mockResolvedValue(
                            {
                                testCaseId:
                                    "TC-001",

                                flowPlan: {
                                    type:
                                        "flow_plan",

                                    summary:
                                        "Login flow",

                                    steps: [
                                        {
                                            id:
                                                "step-1",

                                            action:
                                                "tap",

                                            title:
                                                "Tap Login",

                                            description:
                                                "Tap the Login button.",

                                            locatorStrategy:
                                                "accessibilityId",

                                            locator:
                                                "Login",
                                        },
                                    ],

                                    warnings: [],
                                },
                            },
                        );

                        await useAIStore
                            .getState()
                            .convertTestCaseToFlow(
                                testCase,
                            );

                        expect(
                            useAIStore
                                .getState()
                                .draftTestCases,
                        ).toBeNull();
                    },
                );

                it(
                    "sets generating state while flow conversion is pending",
                    async () => {
                        let resolveRequest:
                            | ((
                                value: {
                                    testCaseId:
                                    string;

                                    flowPlan: {
                                        type:
                                        "flow_plan";

                                        summary:
                                        string;

                                        steps: {
                                            id: string;

                                            action: "tap";

                                            title: string;

                                            description: string;

                                            locatorStrategy:
                                            "accessibilityId";

                                            locator: string;
                                        }[];

                                        warnings: string[];
                                    };
                                },
                            ) => void)
                            | undefined;

                        convertAITestCaseToFlowMock.mockImplementation(
                            () =>
                                new Promise(
                                    (
                                        resolve,
                                    ) => {
                                        resolveRequest =
                                            resolve;
                                    },
                                ),
                        );

                        const promise =
                            useAIStore
                                .getState()
                                .convertTestCaseToFlow(
                                    testCase,
                                );

                        expect(
                            useAIStore
                                .getState()
                                .isGenerating,
                        ).toBe(
                            true,
                        );

                        resolveRequest?.({
                            testCaseId:
                                "TC-001",

                            flowPlan: {
                                type:
                                    "flow_plan",

                                summary:
                                    "Login flow",

                                steps: [
                                    {
                                        id:
                                            "step-1",

                                        action:
                                            "tap",

                                        title:
                                            "Tap Login",

                                        description:
                                            "Tap the Login button.",

                                        locatorStrategy:
                                            "accessibilityId",

                                        locator:
                                            "Login",
                                    },
                                ],

                                warnings: [],
                            },
                        });

                        await promise;

                        expect(
                            useAIStore
                                .getState()
                                .isGenerating,
                        ).toBe(
                            false,
                        );
                    },
                );
            },
        );
    },
);