import { beforeEach, describe, expect, it, vi } from "vitest";

import { executeFlow } from "./executeFlow";
import { validateFlow } from "../../flow/validation/validateFlow";
import { executeNode } from "./executeNode";
import type { ExecutionContext } from "../types/ExecutionContext";

import type { FlowNode } from "../../flow/types/flowNode";

const validateFlowMock = vi.mocked(validateFlow);
const executeNodeMock = vi.mocked(executeNode);






const context: ExecutionContext = {
    device: "Android",
    edges: [],
};

const node: FlowNode = {
    id: "1",
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
} as FlowNode;

const breakpointNode: FlowNode = {
    ...node,
    data: {
        ...node.data,
        debug: {
            breakpoint: true,
        },
    },
};

const executionStore = {
    reset: vi.fn(),
    startExecution: vi.fn(),
    finishExecution: vi.fn(),
    setStatus: vi.fn(),
    setCurrentNode: vi.fn(),
    pauseExecution: vi.fn(),
    setEdgeStatus: vi.fn(),

    isPaused: false,
    isStopped: false,
};

vi.mock("../store/useExecutionStore", () => ({
    useExecutionStore: {
        getState: vi.fn(() => executionStore),
    },
}));

vi.mock("../../flow/validation/validateFlow", () => ({
    validateFlow: vi.fn(),
}));

vi.mock("../variables/VariableStore", () => ({
    clearVariables: vi.fn(),
}));

vi.mock("../services/executionLogger", () => ({
    executionLogger: {
        clear: vi.fn(),
        info: vi.fn(),
        success: vi.fn(),
        error: vi.fn(),
    },
}));

vi.mock("../utils/waitWhilePaused", () => ({
    waitWhilePaused: vi.fn(() => Promise.resolve()),
}));

vi.mock("../utils/formatDuration", () => ({
    formatDuration: vi.fn(() => "1 ms"),
}));

vi.mock("./executeNode", () => ({
    executeNode: vi.fn(),
}));



describe("executeFlow", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("executes a simple flow successfully", async () => {
        validateFlowMock.mockReturnValue({
            valid: true,
            errors: [],
        });



        executeNodeMock.mockResolvedValue({
            outputs: ["next"],
        });

        await executeFlow(
            [node],
            context,
        );

        expect(executionStore.reset)
            .toHaveBeenCalled();

        expect(executionStore.startExecution)
            .toHaveBeenCalledWith(1);

        expect(executionStore.setCurrentNode)
            .toHaveBeenCalledWith("1");

        expect(executeNodeMock)
            .toHaveBeenCalledTimes(1);

        expect(executionStore.finishExecution)
            .toHaveBeenCalled();

        expect(executionStore.setStatus)
            .toHaveBeenCalledWith("passed");

        expect(executionStore.setCurrentNode)
            .toHaveBeenLastCalledWith(null);
    });

    it("throws when flow validation fails", async () => {
        validateFlowMock.mockReturnValue({
            valid: false,
            errors: [
                {
                    nodeId: "1",
                    nodeTitle: "Tap",
                    errors: ["Locator required"],
                },
            ],
        });

        await expect(
            executeFlow([node], context),
        ).rejects.toThrow(
            "Flow contains validation errors.",
        );

        expect(executionStore.setStatus)
            .toHaveBeenCalledWith("failed");

        expect(executionStore.setCurrentNode)
            .toHaveBeenLastCalledWith(null);
    });

    it("marks execution as failed when executeNode throws", async () => {
        validateFlowMock.mockReturnValue({
            valid: true,
            errors: [],
        });

        executeNodeMock.mockRejectedValue(
            new Error("Runner failed"),
        );

        await expect(
            executeFlow([node], context),
        ).rejects.toThrow(
            "Runner failed",
        );

        expect(executionStore.setStatus)
            .toHaveBeenCalledWith("failed");
    });

    it("pauses execution on breakpoint", async () => {
        validateFlowMock.mockReturnValue({
            valid: true,
            errors: [],
        });

        executeNodeMock.mockResolvedValue({
            outputs: ["next"],
        });

        await executeFlow(
            [breakpointNode],
            context,
        );

        expect(executionStore.pauseExecution)
            .toHaveBeenCalled();
    });

    it("uses 'next' when runner returns no outputs", async () => {
        validateFlowMock.mockReturnValue({
            valid: true,
            errors: [],
        });

        executeNodeMock.mockResolvedValue({
            outputs: [],
        });

        await executeFlow(
            [node],
            context,
        );

        expect(executeNodeMock)
            .toHaveBeenCalledTimes(1);

        expect(executionStore.finishExecution)
            .toHaveBeenCalled();

        expect(executionStore.setStatus)
            .toHaveBeenCalledWith("passed");
    });

    it("updates edge status while moving between nodes", async () => {
        validateFlowMock.mockReturnValue({
            valid: true,
            errors: [],
        });

        const nodeA = {
            ...node,
            id: "A",
        };

        const nodeB = {
            ...node,
            id: "B",
        };

        executeNodeMock
            .mockResolvedValueOnce({
                outputs: ["next"],
            })
            .mockResolvedValueOnce({
                outputs: ["next"],
            });

        await executeFlow(
            [nodeA, nodeB] as FlowNode[],
            {
                device: "Android",
                edges: [
                    {
                        id: "edge-1",
                        source: "A",
                        target: "B",
                    },
                ],
            },
        );

        expect(
            executionStore.setEdgeStatus,
        ).toHaveBeenNthCalledWith(
            1,
            "edge-1",
            "running",
        );

        expect(
            executionStore.setEdgeStatus,
        ).toHaveBeenNthCalledWith(
            2,
            "edge-1",
            "passed",
        );
    });

    it("marks execution as failed after an edge is already running", async () => {
        validateFlowMock.mockReturnValue({
            valid: true,
            errors: [],
        });

        const nodeA = {
            ...node,
            id: "A",
        };

        const nodeB = {
            ...node,
            id: "B",
        };

        executeNodeMock
            .mockResolvedValueOnce({
                outputs: ["next"],
            })
            .mockRejectedValueOnce(
                new Error("Runner failed"),
            );

        await expect(
            executeFlow(
                [nodeA, nodeB] as FlowNode[],
                {
                    device: "Android",
                    edges: [
                        {
                            id: "edge-1",
                            source: "A",
                            target: "B",
                        },
                    ],
                },
            ),
        ).rejects.toThrow(
            "Runner failed",
        );

        expect(
            executionStore.setStatus,
        ).toHaveBeenCalledWith(
            "failed",
        );
    });
});