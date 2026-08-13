import {
    beforeEach,
    describe,
    expect,
    it,
    vi,
} from "vitest";

import type { FlowNode } from "../../flow/types/flowNode";
import type { ExecutionContext } from "../types/ExecutionContext";

const mocks = vi.hoisted(() => ({
    deleteSession: vi.fn(),

    pauseExecution: vi.fn(),

    resumeExecution: vi.fn(),

    stopExecution: vi.fn(),
}));

vi.mock(
    "../engine/executeFlow",
    () => ({
        executeFlow: vi.fn(),
    }),
);

vi.mock(
    "../services/appium/AppiumClient",
    () => ({
        appiumClient: {
            deleteSession:
                mocks.deleteSession,
        },
    }),
);

vi.mock(
    "../store/useExecutionStore",
    () => ({
        useExecutionStore: {
            getState: vi.fn(() => ({
                pauseExecution:
                    mocks.pauseExecution,

                resumeExecution:
                    mocks.resumeExecution,

                stopExecution:
                    mocks.stopExecution,
            })),
        },
    }),
);

import { executeFlow } from "../engine/executeFlow";

import { ExecutionController } from "./ExecutionController";

const executeFlowMock =
    vi.mocked(executeFlow);

const nodes: FlowNode[] = [
    {
        id: "node-1",

        type: "default",

        position: {
            x: 0,
            y: 0,
        },

        data: {
            action: "tap",

            title: "Tap",

            subtitle: "",

            debug: {
                breakpoint: false,
            },

            locatorStrategy: "id",

            locator: "login",
        },
    } as FlowNode,
];

const context: ExecutionContext = {
    edges: [],
};

describe(
    "ExecutionController",
    () => {
        beforeEach(() => {
            vi.clearAllMocks();

            mocks.deleteSession.mockResolvedValue(
                undefined,
            );

            executeFlowMock.mockResolvedValue(
                undefined,
            );
        });

        describe(
            "run",
            () => {
                it(
                    "deletes the existing Appium session before executing the flow",
                    async () => {
                        await ExecutionController.run(
                            nodes,
                            context,
                        );

                        expect(
                            mocks.deleteSession,
                        ).toHaveBeenCalledTimes(
                            1,
                        );

                        expect(
                            executeFlowMock,
                        ).toHaveBeenCalledTimes(
                            1,
                        );

                        expect(
                            executeFlowMock,
                        ).toHaveBeenCalledWith(
                            nodes,
                            context,
                        );
                    },
                );

                it(
                    "deletes the Appium session before executing the flow",
                    async () => {
                        const executionOrder: string[] =
                            [];

                        mocks.deleteSession.mockImplementation(
                            async () => {
                                executionOrder.push(
                                    "deleteSession",
                                );
                            },
                        );

                        executeFlowMock.mockImplementation(
                            async () => {
                                executionOrder.push(
                                    "executeFlow",
                                );
                            },
                        );

                        await ExecutionController.run(
                            nodes,
                            context,
                        );

                        expect(
                            executionOrder,
                        ).toEqual([
                            "deleteSession",
                            "executeFlow",
                        ]);
                    },
                );

                it(
                    "passes nodes and context to executeFlow",
                    async () => {
                        const customContext: ExecutionContext =
                        {
                            edges: [
                                {
                                    id: "edge-1",
                                    source: "node-1",
                                    target: "node-2",
                                },
                            ],
                        };

                        await ExecutionController.run(
                            nodes,
                            customContext,
                        );

                        expect(
                            executeFlowMock,
                        ).toHaveBeenCalledWith(
                            nodes,
                            customContext,
                        );
                    },
                );

                it(
                    "does not execute the flow when Appium session deletion fails",
                    async () => {
                        mocks.deleteSession.mockRejectedValue(
                            new Error(
                                "Failed to delete Appium session",
                            ),
                        );

                        await expect(
                            ExecutionController.run(
                                nodes,
                                context,
                            ),
                        ).rejects.toThrow(
                            "Failed to delete Appium session",
                        );

                        expect(
                            executeFlowMock,
                        ).not.toHaveBeenCalled();
                    },
                );

                it(
                    "propagates flow execution errors",
                    async () => {
                        executeFlowMock.mockRejectedValue(
                            new Error(
                                "Flow execution failed",
                            ),
                        );

                        await expect(
                            ExecutionController.run(
                                nodes,
                                context,
                            ),
                        ).rejects.toThrow(
                            "Flow execution failed",
                        );

                        expect(
                            mocks.deleteSession,
                        ).toHaveBeenCalledTimes(
                            1,
                        );
                    },
                );
            },
        );

        describe(
            "pause",
            () => {
                it(
                    "pauses execution",
                    () => {
                        ExecutionController.pause();

                        expect(
                            mocks.pauseExecution,
                        ).toHaveBeenCalledTimes(
                            1,
                        );

                        expect(
                            mocks.resumeExecution,
                        ).not.toHaveBeenCalled();

                        expect(
                            mocks.stopExecution,
                        ).not.toHaveBeenCalled();
                    },
                );
            },
        );

        describe(
            "resume",
            () => {
                it(
                    "resumes execution",
                    () => {
                        ExecutionController.resume();

                        expect(
                            mocks.resumeExecution,
                        ).toHaveBeenCalledTimes(
                            1,
                        );

                        expect(
                            mocks.pauseExecution,
                        ).not.toHaveBeenCalled();

                        expect(
                            mocks.stopExecution,
                        ).not.toHaveBeenCalled();
                    },
                );
            },
        );

        describe(
            "stop",
            () => {
                it(
                    "stops execution",
                    () => {
                        ExecutionController.stop();

                        expect(
                            mocks.stopExecution,
                        ).toHaveBeenCalledTimes(
                            1,
                        );

                        expect(
                            mocks.pauseExecution,
                        ).not.toHaveBeenCalled();

                        expect(
                            mocks.resumeExecution,
                        ).not.toHaveBeenCalled();
                    },
                );
            },
        );
    },
);