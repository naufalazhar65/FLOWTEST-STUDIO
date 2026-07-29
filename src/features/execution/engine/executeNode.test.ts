import {
    beforeEach,
    describe,
    expect,
    it,
    vi,
} from "vitest";

import { executeNode } from "./executeNode";

import { getRunner } from "../services/runnerRegistry";
import { executionLogger } from "../services/executionLogger";
import { useExecutionStore } from "../store/useExecutionStore";

vi.mock("../services/runnerRegistry", () => ({
    getRunner: vi.fn(),
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
        getState: vi.fn(),
    },
}));

describe("executeNode", () => {
    const execution = {
        setCurrentNode: vi.fn(),
        setNodeStatus: vi.fn(),
        completeNode: vi.fn(),
    };

    const runner = {
        run: vi.fn(),
    };

    const node = {
        id: "node-1",
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
    };

    const context = {
        device: "emulator",
        edges: [],
    };

    beforeEach(() => {
        vi.clearAllMocks();

        vi.mocked(
            useExecutionStore.getState
        ).mockReturnValue(
            execution as never
        );

        vi.mocked(
            getRunner
        ).mockReturnValue(
            runner as never
        );
    });

    it("executes a node successfully", async () => {
        runner.run.mockResolvedValue({
            outputs: ["next"],
        });

        const result = await executeNode(
            node as never,
            context
        );

        expect(
            execution.setCurrentNode
        ).toHaveBeenNthCalledWith(
            1,
            "node-1"
        );

        expect(
            execution.setNodeStatus
        ).toHaveBeenNthCalledWith(
            1,
            "node-1",
            "running"
        );

        expect(
            runner.run
        ).toHaveBeenCalledWith(
            node,
            context
        );

        expect(
            execution.setNodeStatus
        ).toHaveBeenNthCalledWith(
            2,
            "node-1",
            "passed"
        );

        expect(
            execution.completeNode
        ).toHaveBeenCalledWith(
            true
        );

        expect(
            execution.setCurrentNode
        ).toHaveBeenNthCalledWith(
            2,
            null
        );

        expect(
            executionLogger.success
        ).toHaveBeenCalled();

        expect(result).toEqual({
            outputs: ["next"],
        });
    });

    it("returns default output when runner returns undefined", async () => {
        runner.run.mockResolvedValue(
            undefined
        );

        await expect(
            executeNode(
                node as never,
                context
            )
        ).resolves.toEqual({
            outputs: ["next"],
        });
    });

    it("marks node as failed when runner throws", async () => {
        runner.run.mockRejectedValue(
            new Error("Boom")
        );

        await expect(
            executeNode(
                node as never,
                context
            )
        ).rejects.toThrow("Boom");

        expect(
            execution.setNodeStatus
        ).toHaveBeenNthCalledWith(
            2,
            "node-1",
            "failed"
        );

        expect(
            execution.completeNode
        ).toHaveBeenCalledWith(
            false
        );

        expect(
            execution.setCurrentNode
        ).toHaveBeenLastCalledWith(
            null
        );

        expect(
            executionLogger.error
        ).toHaveBeenCalled();
    });

    it("logs delay message", async () => {
        runner.run.mockResolvedValue({
            outputs: ["next"],
        });

        await executeNode(
            {
                ...node,
                data: {
                    action: "delay",
                    title: "Delay",
                    subtitle: "",
                    debug: {
                        breakpoint: false,
                    },
                    duration: 1000,
                },
            } as never,
            context
        );

        expect(
            executionLogger.info
        ).toHaveBeenCalledWith(
            "Waiting 1000 ms",
            "node-1",
            "delay"
        );
    });
});