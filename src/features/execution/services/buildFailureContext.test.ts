import {
    describe,
    expect,
    it,
} from "vitest";

import {
    buildFailureContext,
} from "./buildFailureContext";

describe(
    "buildFailureContext",
    () => {
        it(
            "builds failure context from a failed execution result",
            () => {
                const result =
                    buildFailureContext(
                        {
                            nodeId:
                                "tap-login",

                            nodeType:
                                "tap",

                            nodeTitle:
                                "Tap Login",

                            status:
                                "failed",

                            startedAt:
                                1000,

                            finishedAt:
                                1500,

                            duration:
                                500,

                            error:
                                "Element not found",

                            screenshot:
                                "data:image/png;base64,test",

                            pageSource:
                                "<XCUIElementTypeApplication />",
                        },
                        [
                            {
                                id:
                                    "input-username",

                                type:
                                    "flow",

                                position: {
                                    x: 0,

                                    y: 0,
                                },

                                data: {
                                    action:
                                        "input",

                                    title:
                                        "Input Username",

                                    subtitle:
                                        "Enter username",

                                    locatorStrategy:
                                        "accessibilityId",

                                    locator:
                                        "username",

                                    text:
                                        "test",

                                    debug: {
                                        breakpoint:
                                            false,
                                    },
                                },
                            },

                            {
                                id:
                                    "tap-login",

                                type:
                                    "flow",

                                position: {
                                    x: 0,

                                    y: 100,
                                },

                                data: {
                                    action:
                                        "tap",

                                    title:
                                        "Tap Login",

                                    subtitle:
                                        "Tap login button",

                                    locatorStrategy:
                                        "accessibilityId",

                                    locator:
                                        "Login",

                                    debug: {
                                        breakpoint:
                                            false,
                                    },
                                },
                            },

                            {
                                id:
                                    "assert-login",

                                type:
                                    "flow",

                                position: {
                                    x: 0,

                                    y: 200,
                                },

                                data: {
                                    action:
                                        "assert",

                                    title:
                                        "Assert Login",

                                    subtitle:
                                        "Verify login",

                                    actual:
                                        "${loginResult}",

                                    operator:
                                        "isNotEmpty",

                                    expected:
                                        "true",

                                    debug: {
                                        breakpoint:
                                            false,
                                    },
                                },
                            },
                        ],
                        [
                            {
                                id:
                                    "edge-1",

                                source:
                                    "input-username",

                                target:
                                    "tap-login",
                            },

                            {
                                id:
                                    "edge-2",

                                source:
                                    "tap-login",

                                target:
                                    "assert-login",
                            },
                        ],
                    );

                expect(
                    result,
                ).not.toBeNull();

                expect(
                    result?.node.id,
                ).toBe(
                    "tap-login",
                );

                expect(
                    result?.node.action,
                ).toBe(
                    "tap",
                );

                expect(
                    result?.node.locatorStrategy,
                ).toBe(
                    "accessibilityId",
                );

                expect(
                    result?.node.locator,
                ).toBe(
                    "Login",
                );

                expect(
                    result?.execution.error,
                ).toBe(
                    "Element not found",
                );

                expect(
                    result?.previousNodeIds,
                ).toEqual([
                    "input-username",
                ]);

                expect(
                    result?.nextNodeIds,
                ).toEqual([
                    "assert-login",
                ]);
            },
        );

        it(
            "returns null for a passed execution result",
            () => {
                const result =
                    buildFailureContext(
                        {
                            nodeId:
                                "tap-login",

                            nodeType:
                                "tap",

                            nodeTitle:
                                "Tap Login",

                            status:
                                "passed",

                            startedAt:
                                1000,

                            finishedAt:
                                1500,

                            duration:
                                500,
                        },
                        [],
                        [],
                    );

                expect(
                    result,
                ).toBeNull();
            },
        );

        it(
            "returns null when the failed node cannot be found",
            () => {
                const result =
                    buildFailureContext(
                        {
                            nodeId:
                                "missing-node",

                            nodeType:
                                "tap",

                            nodeTitle:
                                "Missing",

                            status:
                                "failed",

                            startedAt:
                                1000,

                            finishedAt:
                                1500,

                            duration:
                                500,

                            error:
                                "Element not found",
                        },
                        [],
                        [],
                    );

                expect(
                    result,
                ).toBeNull();
            },
        );
    },
);