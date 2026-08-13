import {
    beforeEach,
    describe,
    expect,
    it,
    vi,
} from "vitest";

vi.mock("../services/runnerRegistry", () => ({
    getRunner: vi.fn(),
}));

vi.mock("../services/executionLogger", () => ({
    executionLogger: {
        info: vi.fn(),
        success: vi.fn(),
        warning: vi.fn(),
        error: vi.fn(),
        clear: vi.fn(),
    },
}));

vi.mock("../store/useExecutionStore", () => ({
    useExecutionStore: {
        getState: vi.fn(),
    },
}));

import { executeNode } from "./executeNode";
import { getRunner } from "../services/runnerRegistry";
import { executionLogger } from "../services/executionLogger";
import { useExecutionStore } from "../store/useExecutionStore";

import type {
    FlowNode,
    TapNodeData,
} from "../../flow/types/flowNode";

import type { ExecutionContext } from "../types/ExecutionContext";

const context: ExecutionContext = {
    edges: [],
};

const executionStore = {
    setCurrentNode: vi.fn(),
    setNodeStatus: vi.fn(),
    setNodeResult: vi.fn(),
    completeNode: vi.fn(),
};

function createNode(): FlowNode & {
    data: TapNodeData;
} {
    return {
        id: "tap-1",

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

            locator: "login_button",
        },
    } as FlowNode & {
        data: TapNodeData;
    };
}

describe("executeNode", () => {
    beforeEach(() => {
        vi.clearAllMocks();

        vi.mocked(
            useExecutionStore.getState,
        ).mockReturnValue(
            executionStore as never,
        );
    });

    it("executes runner successfully", async () => {
        const run = vi.fn().mockResolvedValue({
            outputs: ["next"],
        });

        vi.mocked(getRunner).mockReturnValue({
            run,
        } as never);

        const result = await executeNode(
            createNode(),
            context,
        );

        expect(getRunner).toHaveBeenCalledWith(
            "tap",
        );

        expect(run).toHaveBeenCalledTimes(1);

        expect(result).toEqual({
            outputs: ["next"],
        });

        expect(
            executionStore.setNodeResult,
        ).toHaveBeenCalledTimes(1);

        expect(
            executionStore.setCurrentNode,
        ).toHaveBeenNthCalledWith(
            1,
            "tap-1",
        );

        expect(
            executionStore.setNodeStatus,
        ).toHaveBeenNthCalledWith(
            1,
            "tap-1",
            "running",
        );

        expect(
            executionStore.setNodeStatus,
        ).toHaveBeenNthCalledWith(
            2,
            "tap-1",
            "passed",
        );

        expect(
            executionStore.completeNode,
        ).toHaveBeenCalledWith(
            true,
        );

        expect(
            executionLogger.info,
        ).toHaveBeenCalledWith({
            message: "Executing node",
            nodeId: "tap-1",
            nodeType: "tap",
            nodeTitle: "Tap",
        });
    });

    it("returns default output when runner returns undefined", async () => {
        const run = vi.fn().mockResolvedValue(
            undefined,
        );

        vi.mocked(getRunner).mockReturnValue({
            run,
        } as never);

        const result =
            await executeNode(
                createNode(),
                context,
            );

        expect(result).toEqual({
            outputs: ["next"],
        });

        expect(
            executionStore.setNodeResult,
        ).toHaveBeenCalledTimes(1);
    });

    it("marks node as failed when runner throws Error", async () => {
        const run = vi.fn().mockRejectedValue(
            new Error("Runner failed"),
        );

        vi.mocked(getRunner).mockReturnValue({
            run,
        } as never);

        await expect(
            executeNode(
                createNode(),
                context,
            ),
        ).rejects.toThrow(
            "Runner failed",
        );

        expect(
            executionStore.setNodeStatus,
        ).toHaveBeenNthCalledWith(
            1,
            "tap-1",
            "running",
        );

        expect(
            executionStore.setNodeStatus,
        ).toHaveBeenNthCalledWith(
            2,
            "tap-1",
            "failed",
        );

        expect(
            executionStore.completeNode,
        ).toHaveBeenCalledWith(
            false,
        );

        expect(
            executionLogger.error,
        ).toHaveBeenCalledTimes(
            1,
        );
    });

    it("marks node as failed when runner throws non-Error", async () => {
        const run = vi.fn().mockRejectedValue(
            "Unknown error",
        );

        vi.mocked(getRunner).mockReturnValue({
            run,
        } as never);

        await expect(
            executeNode(
                createNode(),
                context,
            ),
        ).rejects.toBe(
            "Unknown error",
        );

        expect(
            executionLogger.error,
        ).toHaveBeenCalledTimes(
            1,
        );
    });

    it("always clears current node", async () => {
        const run = vi.fn().mockResolvedValue({
            outputs: ["next"],
        });

        vi.mocked(getRunner).mockReturnValue({
            run,
        } as never);

        await executeNode(
            createNode(),
            context,
        );

        expect(
            executionStore.setCurrentNode,
        ).toHaveBeenLastCalledWith(
            null,
        );
    });
});