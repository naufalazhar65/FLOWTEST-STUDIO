import {
    describe,
    expect,
    it,
} from "vitest";

import {
    detectApplicationStateMismatch,
} from "./detectApplicationStateMismatch";

import type {
    FailureContext,
} from "./buildFailureContext";

describe(
    "detectApplicationStateMismatch",
    () => {
        it(
            "detects a likely application state mismatch after a back action",
            () => {
                const context =
                    {
                        node: {
                            id:
                                "tap-login",

                            action:
                                "tap",

                            title:
                                "Tap Login",

                            subtitle:
                                "Tap login",

                            locatorStrategy:
                                "accessibilityId",

                            locator:
                                "Login",
                        },

                        execution: {
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

                            pageSource:
                                "<XCUIElementTypeApplication><XCUIElementTypeStaticText name='Home' /></XCUIElementTypeApplication>",
                        },

                        previousNodeIds: [
                            "back",
                        ],

                        previousNodes: [
                            {
                                id:
                                    "back",

                                action:
                                    "back",

                                title:
                                    "Back",

                                subtitle:
                                    "Go back",

                                locatorStrategy:
                                    null,

                                locator:
                                    null,
                            },
                        ],

                        nextNodeIds: [],

                        nextNodes: [],
                    } as FailureContext;

                const result =
                    detectApplicationStateMismatch(
                        context,
                    );

                expect(
                    result.detected,
                ).toBe(
                    true,
                );

                expect(
                    result.confidence,
                ).toBe(
                    "high",
                );
            },
        );

        it(
            "does not report a mismatch when the failed target is present",
            () => {
                const context =
                    {
                        node: {
                            id:
                                "tap-login",

                            action:
                                "tap",

                            title:
                                "Tap Login",

                            subtitle:
                                "Tap login",

                            locatorStrategy:
                                "accessibilityId",

                            locator:
                                "Login",
                        },

                        execution: {
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

                            pageSource:
                                "<XCUIElementTypeApplication><XCUIElementTypeButton name='Login' /></XCUIElementTypeApplication>",
                        },

                        previousNodeIds: [
                            "back",
                        ],

                        previousNodes: [
                            {
                                id:
                                    "back",

                                action:
                                    "back",

                                title:
                                    "Back",

                                subtitle:
                                    "Go back",

                                locatorStrategy:
                                    null,

                                locator:
                                    null,
                            },
                        ],

                        nextNodeIds: [],

                        nextNodes: [],
                    } as FailureContext;

                const result =
                    detectApplicationStateMismatch(
                        context,
                    );

                expect(
                    result.detected,
                ).toBe(
                    false,
                );
            },
        );

        it(
            "does not report a mismatch without a state-changing previous node",
            () => {
                const context =
                    {
                        node: {
                            id:
                                "tap-login",

                            action:
                                "tap",

                            title:
                                "Tap Login",

                            subtitle:
                                "Tap login",

                            locatorStrategy:
                                "accessibilityId",

                            locator:
                                "Login",
                        },

                        execution: {
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

                            pageSource:
                                "<XCUIElementTypeApplication><XCUIElementTypeStaticText name='Home' /></XCUIElementTypeApplication>",
                        },

                        previousNodeIds: [
                            "tap-home",
                        ],

                        previousNodes: [
                            {
                                id:
                                    "tap-home",

                                action:
                                    "tap",

                                title:
                                    "Tap Home",

                                subtitle:
                                    "Tap home",

                                locatorStrategy:
                                    "accessibilityId",

                                locator:
                                    "Home",
                            },
                        ],

                        nextNodeIds: [],

                        nextNodes: [],
                    } as FailureContext;

                const result =
                    detectApplicationStateMismatch(
                        context,
                    );

                expect(
                    result.detected,
                ).toBe(
                    false,
                );
            },
        );
    },
);