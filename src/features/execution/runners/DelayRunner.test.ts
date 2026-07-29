import { beforeEach, describe, expect, it, vi } from "vitest";

import { delayRunner } from "./DelayRunner";

import type { ExecutionContext } from "../types/ExecutionContext";
import type { FlowNode } from "../../flow/types/flowNode";

const context: ExecutionContext = {
    device: "Android",
    edges: [],
};

function createDelayNode(): FlowNode {
    return {
        id: "delay-1",
        type: "default",
        position: {
            x: 0,
            y: 0,
        },
        data: {
            action: "delay",
            title: "Delay",
            subtitle: "",
            debug: {
                breakpoint: false,
            },
            duration: 1000, // ✅ number
        },
    } as FlowNode;
}

describe("DelayRunner", () => {
    beforeEach(() => {
        vi.restoreAllMocks();
        vi.useRealTimers();
    });

    it("waits for the specified duration", async () => {
        vi.useFakeTimers();

        const promise = delayRunner.run(
            createDelayNode(),
            context,
        );

        await vi.advanceTimersByTimeAsync(1000);

        await expect(promise).resolves.toBeUndefined();
    });

    it("throws an error for non-delay nodes", async () => {
        const node = createDelayNode();

        node.data = {
            ...node.data,
            action: "tap",
        } as never;

        await expect(
            delayRunner.run(node, context),
        ).rejects.toThrow(
            "Invalid node for DelayRunner",
        );
    });
});