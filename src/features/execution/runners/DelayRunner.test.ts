import {
    beforeEach,
    afterEach,
    describe,
    expect,
    it,
    vi,
} from "vitest";

import { delayRunner } from "./DelayRunner";

import type {
    DelayNodeData,
    FlowNode,
} from "../../flow/types/flowNode";

import type { ExecutionContext } from "../types/ExecutionContext";

const context: ExecutionContext = {
    edges: [],
};

function createDelayNode(): FlowNode & {
    data: DelayNodeData;
} {
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

            duration: 1000,
        },
    } as FlowNode & {
        data: DelayNodeData;
    };
}

describe("DelayRunner", () => {
    beforeEach(() => {
        vi.useFakeTimers();
    });

    afterEach(() => {
        vi.useRealTimers();
        vi.clearAllMocks();
    });

    it("waits for the configured duration", async () => {
        const promise = delayRunner.run(
            createDelayNode(),
            context,
        );

        await vi.advanceTimersByTimeAsync(1000);

        await expect(promise).resolves.toBeUndefined();
    });

    it("returns undefined after completion", async () => {
        const promise = delayRunner.run(
            createDelayNode(),
            context,
        );

        await vi.advanceTimersByTimeAsync(1000);

        const result = await promise;

        expect(result).toBeUndefined();
    });

    it("returns immediately when action is not delay", async () => {
        const node = createDelayNode();

        node.data = {
            ...node.data,
            action: "tap",
        } as never;

        const result = await delayRunner.run(
            node,
            context,
        );

        expect(result).toBeUndefined();
    });
    it("throws when setTimeout throws Error", async () => {
        vi.spyOn(
            globalThis,
            "setTimeout",
        ).mockImplementationOnce(() => {
            throw new Error("Delay failed");
        });

        await expect(
            delayRunner.run(
                createDelayNode(),
                context,
            ),
        ).rejects.toThrow("Delay failed");
    });

    it("throws when setTimeout throws non-Error", async () => {
        vi.spyOn(
            globalThis,
            "setTimeout",
        ).mockImplementationOnce(() => {
            throw "Unknown error";
        });

        await expect(
            delayRunner.run(
                createDelayNode(),
                context,
            ),
        ).rejects.toBe("Unknown error");
    });
});