import {
    describe,
    expect,
    it,
} from "vitest";

import {
    normalizeTestCaseGenerationResult,
} from "./generateTestCases.mjs";

describe(
    "normalizeTestCaseGenerationResult",
    () => {
        it(
            "normalizes a valid test case result",
            () => {
                const result =
                    normalizeTestCaseGenerationResult(
                        "User should be able to log in.",
                        {
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
                                        "A valid account exists",
                                    ],

                                    steps: [
                                        {
                                            order:
                                                1,

                                            action:
                                                "Enter username",

                                            testData:
                                                "valid username",
                                        },

                                        {
                                            order:
                                                2,

                                            action:
                                                "Enter password",

                                            testData:
                                                "valid password",
                                        },

                                        {
                                            order:
                                                3,

                                            action:
                                                "Tap Login",
                                        },
                                    ],

                                    expectedResult:
                                        "User is redirected to the home screen.",
                                },
                            ],
                        },
                    );

                expect(
                    result,
                ).not.toBeNull();

                expect(
                    result.requirement,
                ).toBe(
                    "User should be able to log in.",
                );

                expect(
                    result.testCases,
                ).toHaveLength(
                    1,
                );

                expect(
                    result.testCases[0].id,
                ).toBe(
                    "TC-001",
                );

                expect(
                    result.testCases[0]
                        .priority,
                ).toBe(
                    "high",
                );

                expect(
                    result.testCases[0].type,
                ).toBe(
                    "functional",
                );

                expect(
                    result.testCases[0].steps,
                ).toHaveLength(
                    3,
                );
            },
        );

        it(
            "generates a test case id when the model omits it",
            () => {
                const result =
                    normalizeTestCaseGenerationResult(
                        "Verify search.",
                        {
                            testCases: [
                                {
                                    title:
                                        "Search for a product",

                                    priority:
                                        "high",

                                    type:
                                        "functional",

                                    preconditions: [],

                                    steps: [
                                        {
                                            action:
                                                "Enter search keyword",
                                        },

                                        {
                                            action:
                                                "Submit search",
                                        },
                                    ],

                                    expectedResult:
                                        "Matching results are displayed.",
                                },
                            ],
                        },
                    );

                expect(
                    result,
                ).not.toBeNull();

                expect(
                    result.testCases[0].id,
                ).toBe(
                    "TC-001",
                );
            },
        );

        it(
            "normalizes unsupported priority and type",
            () => {
                const result =
                    normalizeTestCaseGenerationResult(
                        "Verify logout.",
                        {
                            testCases: [
                                {
                                    title:
                                        "Logout",

                                    priority:
                                        "unknown",

                                    type:
                                        "something",

                                    preconditions: [],

                                    steps: [
                                        {
                                            action:
                                                "Tap Logout",
                                        },
                                    ],

                                    expectedResult:
                                        "User is logged out.",
                                },
                            ],
                        },
                    );

                expect(
                    result.testCases[0]
                        .priority,
                ).toBe(
                    "medium",
                );

                expect(
                    result.testCases[0]
                        .type,
                ).toBe(
                    "functional",
                );
            },
        );

        it(
            "removes invalid test cases",
            () => {
                const result =
                    normalizeTestCaseGenerationResult(
                        "Invalid output.",
                        {
                            testCases: [
                                {
                                    title:
                                        "",

                                    steps: [],

                                    expectedResult:
                                        "",
                                },

                                {
                                    title:
                                        "Valid case",

                                    priority:
                                        "high",

                                    type:
                                        "functional",

                                    preconditions: [],

                                    steps: [
                                        {
                                            action:
                                                "Tap Login",
                                        },
                                    ],

                                    expectedResult:
                                        "Login succeeds.",
                                },
                            ],
                        },
                    );

                expect(
                    result,
                ).not.toBeNull();

                expect(
                    result.testCases,
                ).toHaveLength(
                    1,
                );
            },
        );

        it(
            "returns null when no valid test cases exist",
            () => {
                const result =
                    normalizeTestCaseGenerationResult(
                        "Generate test cases.",
                        {
                            testCases: [],
                        },
                    );

                expect(
                    result,
                ).toBeNull();
            },
        );

        it(
            "returns null for an invalid requirement",
            () => {
                const result =
                    normalizeTestCaseGenerationResult(
                        "",
                        {
                            testCases: [
                                {
                                    title:
                                        "Login",

                                    steps: [
                                        {
                                            action:
                                                "Tap Login",
                                        },
                                    ],

                                    expectedResult:
                                        "Login succeeds.",
                                },
                            ],
                        },
                    );

                expect(
                    result,
                ).toBeNull();
            },
        );
    },
);