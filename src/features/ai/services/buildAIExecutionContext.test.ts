import {
    beforeEach,
    describe,
    expect,
    it,
    vi,
} from "vitest";

const mocks =
    vi.hoisted(
        () => ({
            buildFlowContext:
                vi.fn(),

            executionGetState:
                vi.fn(),

            appiumGetState:
                vi.fn(),
        }),
    );

vi.mock(
    "./buildFlowContext",
    () => ({
        buildFlowContext:
            mocks.buildFlowContext,
    }),
);

vi.mock(
    "../../execution/store/useExecutionStore",
    () => ({
        useExecutionStore: {
            getState:
                mocks.executionGetState,
        },
    }),
);

vi.mock(
    "../../execution/store/useAppiumConfigStore",
    () => ({
        useAppiumConfigStore: {
            getState:
                mocks.appiumGetState,
        },
    }),
);

import {
    buildAIExecutionContext,
} from "./buildAIExecutionContext";

describe(
    "buildAIExecutionContext",
    () => {
        beforeEach(
            () => {
                vi.resetAllMocks();

                mocks.buildFlowContext
                    .mockReturnValue({
                        selectedNodeId:
                            "node-2",

                        selectedNode: {
                            id:
                                "node-2",

                            action:
                                "tap",

                            title:
                                "Tap Login",

                            subtitle:
                                "Tap login button",

                            locatorStrategy:
                                "id",

                            locator:
                                "com.demo:id/login",

                            details:
                                undefined,
                        },

                        nodes: [
                            {
                                id:
                                    "node-1",

                                action:
                                    "input",

                                title:
                                    "Input Username",

                                subtitle:
                                    "Enter username",

                                locatorStrategy:
                                    "id",

                                locator:
                                    "com.demo:id/username",

                                details:
                                    undefined,
                            },

                            {
                                id:
                                    "node-2",

                                action:
                                    "tap",

                                title:
                                    "Tap Login",

                                subtitle:
                                    "Tap login button",

                                locatorStrategy:
                                    "id",

                                locator:
                                    "com.demo:id/login",

                                details:
                                    undefined,
                            },

                            {
                                id:
                                    "node-3",

                                action:
                                    "assert",

                                title:
                                    "Verify Dashboard",

                                subtitle:
                                    "Verify dashboard",

                                locatorStrategy:
                                    undefined,

                                locator:
                                    undefined,

                                details:
                                {
                                    actual:
                                        "screen",

                                    expected:
                                        "dashboard",
                                },
                            },
                        ],

                        edges: [
                            {
                                id:
                                    "edge-1",

                                source:
                                    "node-1",

                                target:
                                    "node-2",

                                sourceHandle:
                                    "next",

                                targetHandle:
                                    "target",
                            },

                            {
                                id:
                                    "edge-2",

                                source:
                                    "node-2",

                                target:
                                    "node-3",

                                sourceHandle:
                                    "next",

                                targetHandle:
                                    "target",
                            },
                        ],

                        nodeCount:
                            3,

                        edgeCount:
                            2,
                    });

                mocks.executionGetState
                    .mockReturnValue({
                        status:
                            "failed",

                        appiumConnection:
                            "connected",

                        currentNodeId:
                            "node-2",

                        nodeStatus: {
                            "node-1":
                                "passed",

                            "node-2":
                                "failed",

                            "node-3":
                                "idle",
                        },

                        edgeStatus: {
                            "edge-1":
                                "passed",

                            "edge-2":
                                "idle",
                        },

                        nodeResults: {
                            "node-1": {
                                nodeId:
                                    "node-1",

                                nodeType:
                                    "input",

                                nodeTitle:
                                    "Input Username",

                                status:
                                    "passed",

                                startedAt:
                                    1000,

                                finishedAt:
                                    1200,

                                duration:
                                    200,
                            },

                            "node-2": {
                                nodeId:
                                    "node-2",

                                nodeType:
                                    "tap",

                                nodeTitle:
                                    "Tap Login",

                                status:
                                    "failed",

                                startedAt:
                                    1300,

                                finishedAt:
                                    1800,

                                duration:
                                    500,

                                error:
                                    "Element not found.",

                                screenshot:
                                    "base64-screenshot",

                                screenshotFileName:
                                    "node-2.png",

                                pageSource:
                                    "<hierarchy />",
                            },
                        },

                        startedAt:
                            1000,

                        finishedAt:
                            1800,

                        duration:
                            800,
                    });

                mocks.appiumGetState
                    .mockReturnValue({
                        config: {
                            platformName:
                                "Android",

                            android: {
                                deviceName:
                                    "Pixel 9",

                                platformVersion:
                                    "16",

                                udid:
                                    "emulator-5554",
                            },

                            ios: {
                                deviceName:
                                    "iPhone",

                                platformVersion:
                                    "18",

                                udid:
                                    "ios-device",
                            },
                        },
                    });
            },
        );

        it(
            "builds AI context from flow, execution, and Appium state",
            () => {
                const result =
                    buildAIExecutionContext();

                expect(
                    result.flow,
                ).toEqual(
                    mocks
                        .buildFlowContext
                        .mock.results[0]
                        .value,
                );

                expect(
                    result.execution.status,
                ).toBe(
                    "failed",
                );

                expect(
                    result.execution
                        .currentNodeId,
                ).toBe(
                    "node-2",
                );

                expect(
                    result.execution
                        .nodeStatus,
                ).toEqual({
                    "node-1":
                        "passed",

                    "node-2":
                        "failed",

                    "node-3":
                        "idle",
                });

                expect(
                    result.execution
                        .edgeStatus,
                ).toEqual({
                    "edge-1":
                        "passed",

                    "edge-2":
                        "idle",
                });
            },
        );

        it(
            "preserves failure evidence from node results",
            () => {
                const result =
                    buildAIExecutionContext();

                expect(
                    result.execution
                        .nodeResults[
                    "node-2"
                    ],
                ).toMatchObject({
                    nodeId:
                        "node-2",

                    status:
                        "failed",

                    error:
                        "Element not found.",

                    screenshot:
                        "base64-screenshot",

                    screenshotFileName:
                        "node-2.png",

                    pageSource:
                        "<hierarchy />",
                });
            },
        );

        it(
            "calculates execution statistics",
            () => {
                const result =
                    buildAIExecutionContext();

                expect(
                    result.execution
                        .statistics,
                ).toEqual({
                    totalNodes:
                        3,

                    executedNodes:
                        2,

                    passedNodes:
                        1,

                    failedNodes:
                        1,

                    skippedNodes:
                        1,

                    progress:
                        67,
                });
            },
        );

        it(
            "builds timing information",
            () => {
                const result =
                    buildAIExecutionContext();

                expect(
                    result.execution
                        .timing,
                ).toEqual({
                    startedAt:
                        1000,

                    finishedAt:
                        1800,

                    duration:
                        800,
                });
            },
        );

        it(
            "uses the configured platform device",
            () => {
                const result =
                    buildAIExecutionContext();

                expect(
                    result.environment,
                ).toEqual({
                    appiumConnection:
                        "connected",

                    platform:
                        "Android",

                    deviceName:
                        "Pixel 9",

                    platformVersion:
                        "16",

                    udid:
                        "emulator-5554",
                });
            },
        );

        it(
            "handles an empty flow",
            () => {
                mocks.buildFlowContext
                    .mockReturnValue({
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
                    });

                mocks.executionGetState
                    .mockReturnValue({
                        status:
                            "idle",

                        appiumConnection:
                            "offline",

                        currentNodeId:
                            null,

                        nodeStatus: {},

                        edgeStatus: {},

                        nodeResults: {},

                        startedAt:
                            null,

                        finishedAt:
                            null,

                        duration:
                            0,
                    });

                const result =
                    buildAIExecutionContext();

                expect(
                    result.execution
                        .statistics,
                ).toEqual({
                    totalNodes:
                        0,

                    executedNodes:
                        0,

                    passedNodes:
                        0,

                    failedNodes:
                        0,

                    skippedNodes:
                        0,

                    progress:
                        0,
                });

                expect(
                    result.execution
                        .timing,
                ).toEqual({
                    startedAt:
                        null,

                    finishedAt:
                        null,

                    duration:
                        0,
                });
            },
        );
    },
);