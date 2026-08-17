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

            generateAITestCases:
                vi.fn(),
        };
    },
);

const generateAITestCasesMock =
    vi.mocked(
        generateAITestCases,
    );

describe(
    "useAIStore generateTestCases",
    () => {
        beforeEach(() => {
            vi.clearAllMocks();

            useAIStore.setState({
                draftTestCases:
                    null,

                error:
                    null,

                isGenerating:
                    false,
            });
        });

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
                    useAIStore.getState()
                        .draftTestCases,
                ).toHaveLength(
                    1,
                );

                expect(
                    useAIStore.getState()
                        .draftTestCases?.[0]
                        .id,
                ).toBe(
                    "TC-001",
                );

                expect(
                    useAIStore.getState()
                        .isGenerating,
                ).toBe(
                    false,
                );

                expect(
                    useAIStore.getState()
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
                    useAIStore.getState()
                        .draftTestCases,
                ).toBeNull();

                expect(
                    useAIStore.getState()
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
                    useAIStore.getState()
                        .draftTestCases,
                ).toBeNull();

                expect(
                    useAIStore.getState()
                        .error,
                ).toBe(
                    "AI test-case generation failed.",
                );

                expect(
                    useAIStore.getState()
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

                            testCases: [];
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
                    useAIStore.getState()
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
                    useAIStore.getState()
                        .isGenerating,
                ).toBe(
                    false,
                );
            },
        );
    },
);