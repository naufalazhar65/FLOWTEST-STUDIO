import {
    afterEach,
    describe,
    expect,
    it,
    vi,
} from "vitest";

import {
    generateAITestCases,
} from "./generateAITestCases.mjs";

describe(
    "generateAITestCases",
    () => {
        afterEach(() => {
            vi.restoreAllMocks();
        });

        it(
            "generates normalized test cases from Ollama response",
            async () => {
                vi.stubGlobal(
                    "fetch",
                    vi.fn(
                        async () =>
                            new Response(
                                JSON.stringify({
                                    message: {
                                        content:
                                            JSON.stringify(
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
                                                                "User reaches the home screen.",
                                                        },
                                                    ],
                                                },
                                            ),
                                    },
                                }),
                                {
                                    status:
                                        200,

                                    headers: {
                                        "Content-Type":
                                            "application/json",
                                    },
                                },
                            ),
                    ),
                );

                const result =
                    await generateAITestCases(
                        "User should be able to log in with valid credentials.",
                    );

                expect(
                    result.requirement,
                ).toBe(
                    "User should be able to log in with valid credentials.",
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
                    result.testCases[0].steps,
                ).toHaveLength(
                    3,
                );

                expect(
                    fetch,
                ).toHaveBeenCalledTimes(
                    1,
                );

                const [
                    url,
                    options,
                ] =
                    vi.mocked(
                        fetch,
                    ).mock.calls[0];

                expect(
                    url,
                ).toBe(
                    "http://localhost:11434/api/chat",
                );

                expect(
                    options.method,
                ).toBe(
                    "POST",
                );

                const body =
                    JSON.parse(
                        options.body,
                    );

                expect(
                    body.stream,
                ).toBe(
                    false,
                );

                expect(
                    body.format,
                ).toBe(
                    "json",
                );

                expect(
                    body.options
                        .temperature,
                ).toBe(
                    0,
                );
            },
        );

        it(
            "rejects an empty requirement",
            async () => {
                await expect(
                    generateAITestCases(
                        "   ",
                    ),
                ).rejects.toThrow(
                    "Requirement is required.",
                );
            },
        );

        it(
            "rejects an invalid Ollama response",
            async () => {
                vi.stubGlobal(
                    "fetch",
                    vi.fn(
                        async () =>
                            new Response(
                                JSON.stringify({
                                    message: {
                                        content:
                                            JSON.stringify(
                                                {
                                                    testCases:
                                                        [],
                                                },
                                            ),
                                    },
                                }),
                                {
                                    status:
                                        200,
                                },
                            ),
                    ),
                );

                await expect(
                    generateAITestCases(
                        "Verify login.",
                    ),
                ).rejects.toThrow(
                    "Ollama returned no valid test cases.",
                );
            },
        );

        it(
            "propagates Ollama HTTP errors",
            async () => {
                vi.stubGlobal(
                    "fetch",
                    vi.fn(
                        async () =>
                            new Response(
                                "Ollama unavailable",
                                {
                                    status:
                                        503,
                                },
                            ),
                    ),
                );

                await expect(
                    generateAITestCases(
                        "Verify login.",
                    ),
                ).rejects.toThrow(
                    "Ollama test-case request failed (503): Ollama unavailable",
                );
            },
        );

        it(
            "rejects invalid JSON returned by Ollama",
            async () => {
                vi.stubGlobal(
                    "fetch",
                    vi.fn(
                        async () =>
                            new Response(
                                JSON.stringify({
                                    message: {
                                        content:
                                            "not-json",
                                    },
                                }),
                                {
                                    status:
                                        200,
                                },
                            ),
                    ),
                );

                await expect(
                    generateAITestCases(
                        "Verify login.",
                    ),
                ).rejects.toThrow(
                    "Ollama returned invalid test-case JSON",
                );
            },
        );
    },
);