import { beforeEach, describe, expect, it, vi } from "vitest";

import { executeNode } from "./executeNode";

import type { FlowNode } from "../../flow/types/flowNode";
import type { ExecutionContext } from "../types/ExecutionContext";
import type { RunnerResult } from "../types/RunnerResult";
import { executionLogger } from "../services/executionLogger";


const executionLoggerMock = vi.mocked(executionLogger);

const completeNode = vi.fn();

const mockRunner = {
    run: vi.fn(),
};

vi.mock("../services/runnerRegistry", () => ({
    getRunner: vi.fn(() => mockRunner),
}));

vi.mock("../services/executionLogger", () => ({
    executionLogger: {
        info: vi.fn(),
        success: vi.fn(),
        error: vi.fn(),
    },
}));

vi.mock("../store/useExecutionStore", () => ({
    useExecutionStore: {
        getState: () => ({
            completeNode,
        }),
    },
}));

const context = {} as ExecutionContext;

const node = {
    id: "node-1",
    data: {
        action: "tap",
        title: "Tap",
    },
} as FlowNode;

describe("executeNode", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("returns runner result", async () => {
        // Arrange
        const runnerResult: RunnerResult = {
            outputs: ["success"],
        };

        mockRunner.run.mockResolvedValue(
            runnerResult
        );

        // Act
        const result = await executeNode(
            node,
            context
        );

        // Assert
        expect(result).toEqual(
            runnerResult
        );

        expect(completeNode)
            .toHaveBeenCalledWith(true);
    });

    it("returns default output when runner returns void", async () => {
        // Arrange
        mockRunner.run.mockResolvedValue(
            undefined
        );

        // Act
        const result = await executeNode(
            node,
            context
        );

        // Assert
        expect(result).toEqual({
            outputs: ["next"],
        });

        expect(completeNode)
            .toHaveBeenCalledWith(true);
    });

    it("marks node as failed when runner throws", async () => {
        // Arrange
        mockRunner.run.mockRejectedValue(
            new Error("Runner failed")
        );

        // Act & Assert
        await expect(
            executeNode(node, context)
        ).rejects.toThrow(
            "Runner failed"
        );

        expect(completeNode)
            .toHaveBeenCalledWith(false);
    });

    it("logs waiting message for delay node", async () => {
    const delayNode = {
        ...node,
        data: {
            action: "delay",
            title: "Delay",
            duration: 500,
        },
    } as FlowNode;

    mockRunner.run.mockResolvedValue({
        outputs: ["next"],
    });

    await executeNode(
        delayNode,
        context,
    );

    expect(
        executionLoggerMock.info
    ).toHaveBeenCalledWith(
        "Waiting 500 ms",
        "node-1",
        "delay",
    );

    expect(completeNode)
        .toHaveBeenCalledWith(true);
});
});