import { describe, expect, it } from "vitest";

import { validateFlow } from "./validateFlow";

import type { FlowNode } from "../types/flowNode";

function createNode(
    id: string,
    valid = true
): FlowNode {
    return {
        id,
        type: "default",

        position: {
            x: 0,
            y: 0,
        },

        data: {
            action: "tap",

            title: `Node ${id}`,

            subtitle: "",

            debug: {
                breakpoint: false,
            },

            locator: valid
                ? "id=username"
                : "",

            locatorStrategy: "id",
        },
    } as FlowNode;
}

describe("validateFlow", () => {
    it("returns valid for empty flow", () => {
        const result = validateFlow([]);

        expect(result.valid).toBe(true);
        expect(result.errors).toEqual([]);
    });

    it("returns valid when every node is valid", () => {
        const result = validateFlow([
            createNode("1"),
            createNode("2"),
        ]);

        expect(result.valid).toBe(true);
        expect(result.errors).toHaveLength(0);
    });

    it("returns invalid when one node is invalid", () => {
        const result = validateFlow([
            createNode("1"),
            createNode("2", false),
        ]);

        expect(result.valid).toBe(false);

        expect(result.errors).toHaveLength(1);

        expect(result.errors[0]).toMatchObject({
            nodeId: "2",
            nodeTitle: "Node 2",
        });
    });

    it("collects all invalid nodes", () => {
        const result = validateFlow([
            createNode("1", false),
            createNode("2", false),
        ]);

        expect(result.valid).toBe(false);

        expect(result.errors).toHaveLength(2);
    });
});