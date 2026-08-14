import {
    describe,
    expect,
    it,
} from "vitest";

import type { Edge } from "reactflow";

import type { FlowNode } from "../types/flowNode";

import {
    validateGraph,
} from "./validateGraph";

function createNode(
    id: string,
    action: string = "tap",
    title: string = id,
): FlowNode {
    return {
        id,

        type: "default",

        position: {
            x: 0,
            y: 0,
        },

        data: {
            action,
            title,
        } as FlowNode["data"],
    };
}

function createEdge(
    id: string,
    source: string,
    target: string,
    sourceHandle?: string,
): Edge {
    return {
        id,

        source,

        target,

        ...(sourceHandle
            ? {
                sourceHandle,
            }
            : {}),
    };
}

describe("validateGraph", () => {
    /*
     * --------------------------------------------------
     * Empty graph
     * --------------------------------------------------
     */

    it("accepts an empty graph", () => {
        const result =
            validateGraph(
                [],
                [],
            );

        expect(result.valid).toBe(true);

        expect(
            result.errors,
        ).toEqual([]);
    });

    /*
     * --------------------------------------------------
     * Linear flow
     * --------------------------------------------------
     */

    it("accepts a valid linear flow", () => {
        const nodes = [
            createNode(
                "start",
                "launchApp",
                "Launch App",
            ),

            createNode(
                "tap",
                "tap",
                "Tap",
            ),

            createNode(
                "screenshot",
                "screenshot",
                "Screenshot",
            ),
        ];

        const edges = [
            createEdge(
                "edge-1",
                "start",
                "tap",
            ),

            createEdge(
                "edge-2",
                "tap",
                "screenshot",
            ),
        ];

        const result =
            validateGraph(
                nodes,
                edges,
            );

        expect(result.valid).toBe(true);

        expect(
            result.errors,
        ).toEqual([]);
    });

    /*
     * --------------------------------------------------
     * Unreachable node
     * --------------------------------------------------
     */

    it("detects an unreachable node", () => {
        const nodes = [
            createNode(
                "start",
                "launchApp",
                "Launch App",
            ),

            createNode(
                "tap",
                "tap",
                "Tap",
            ),

            createNode(
                "unreachable",
                "screenshot",
                "Screenshot",
            ),
        ];

        const edges = [
            createEdge(
                "edge-1",
                "start",
                "tap",
            ),
        ];

        const result =
            validateGraph(
                nodes,
                edges,
            );

        expect(result.valid).toBe(false);

        expect(
            result.errors,
        ).toHaveLength(1);

        expect(
            result.errors[0],
        ).toMatchObject({
            type: "unreachable-node",

            nodeId: "unreachable",
        });

        expect(
            result.errors[0].message,
        ).toContain(
            "Screenshot",
        );
    });

    /*
     * --------------------------------------------------
     * IF - missing TRUE
     * --------------------------------------------------
     */

    it("detects an IF node with missing TRUE branch", () => {
        const nodes = [
            createNode(
                "if-1",
                "if",
                "Check Login",
            ),

            createNode(
                "false-node",
                "screenshot",
                "Screenshot",
            ),
        ];

        const edges = [
            createEdge(
                "edge-false",
                "if-1",
                "false-node",
                "false",
            ),
        ];

        const result =
            validateGraph(
                nodes,
                edges,
            );

        expect(result.valid).toBe(false);

        const error =
            result.errors.find(
                (item) =>
                    item.type ===
                    "if-missing-true",
            );

        expect(error).toBeDefined();

        expect(
            error?.nodeId,
        ).toBe("if-1");

        expect(
            error?.message,
        ).toContain(
            "TRUE branch",
        );
    });

    /*
     * --------------------------------------------------
     * IF - missing FALSE
     * --------------------------------------------------
     */

    it("detects an IF node with missing FALSE branch", () => {
        const nodes = [
            createNode(
                "if-1",
                "if",
                "Check Login",
            ),

            createNode(
                "true-node",
                "tap",
                "Tap",
            ),
        ];

        const edges = [
            createEdge(
                "edge-true",
                "if-1",
                "true-node",
                "true",
            ),
        ];

        const result =
            validateGraph(
                nodes,
                edges,
            );

        expect(result.valid).toBe(false);

        const error =
            result.errors.find(
                (item) =>
                    item.type ===
                    "if-missing-false",
            );

        expect(error).toBeDefined();

        expect(
            error?.nodeId,
        ).toBe("if-1");

        expect(
            error?.message,
        ).toContain(
            "FALSE branch",
        );
    });

    /*
     * --------------------------------------------------
     * IF - complete branches
     * --------------------------------------------------
     */

    it("accepts an IF node with TRUE and FALSE branches", () => {
        const nodes = [
            createNode(
                "start",
                "launchApp",
                "Launch App",
            ),

            createNode(
                "if-1",
                "if",
                "Check Login",
            ),

            createNode(
                "true-node",
                "tap",
                "Tap Login",
            ),

            createNode(
                "false-node",
                "screenshot",
                "Screenshot",
            ),
        ];

        const edges = [
            createEdge(
                "edge-start",
                "start",
                "if-1",
            ),

            createEdge(
                "edge-true",
                "if-1",
                "true-node",
                "true",
            ),

            createEdge(
                "edge-false",
                "if-1",
                "false-node",
                "false",
            ),
        ];

        const result =
            validateGraph(
                nodes,
                edges,
            );

        expect(result.valid).toBe(true);

        expect(
            result.errors,
        ).toEqual([]);
    });

    /*
     * --------------------------------------------------
     * Missing target
     * --------------------------------------------------
     */

    it("detects an edge targeting a missing node", () => {
        const nodes = [
            createNode(
                "start",
                "launchApp",
                "Launch App",
            ),
        ];

        const edges = [
            createEdge(
                "broken-edge",
                "start",
                "missing-node",
            ),
        ];

        const result =
            validateGraph(
                nodes,
                edges,
            );

        expect(result.valid).toBe(false);

        const error =
            result.errors.find(
                (item) =>
                    item.type ===
                    "missing-target",
            );

        expect(error).toBeDefined();

        expect(
            error?.edgeId,
        ).toBe("broken-edge");

        expect(
            error?.message,
        ).toContain(
            "missing-node",
        );
    });

    /*
     * --------------------------------------------------
     * Duplicate edge
     * --------------------------------------------------
     */

    it("detects duplicate edges", () => {
        const nodes = [
            createNode(
                "start",
                "launchApp",
                "Launch App",
            ),

            createNode(
                "tap",
                "tap",
                "Tap",
            ),
        ];

        const edges = [
            createEdge(
                "edge-1",
                "start",
                "tap",
                "next",
            ),

            createEdge(
                "edge-2",
                "start",
                "tap",
                "next",
            ),
        ];

        const result =
            validateGraph(
                nodes,
                edges,
            );

        expect(result.valid).toBe(false);

        const errors =
            result.errors.filter(
                (item) =>
                    item.type ===
                    "duplicate-edge",
            );

        expect(errors).toHaveLength(1);

        expect(
            errors[0].edgeId,
        ).toBe("edge-2");
    });

    /*
     * --------------------------------------------------
     * Self loop
     * --------------------------------------------------
     */

    it("detects a direct self-loop", () => {
        const nodes = [
            createNode(
                "tap",
                "tap",
                "Tap",
            ),
        ];

        const edges = [
            createEdge(
                "self-loop",
                "tap",
                "tap",
            ),
        ];

        const result =
            validateGraph(
                nodes,
                edges,
            );

        expect(result.valid).toBe(false);

        const error =
            result.errors.find(
                (item) =>
                    item.type ===
                    "self-loop",
            );

        expect(error).toBeDefined();

        expect(
            error?.nodeId,
        ).toBe("tap");

        expect(
            error?.edgeId,
        ).toBe("self-loop");
    });

    /*
     * --------------------------------------------------
     * General cycles
     *
     * We intentionally allow them.
     * Loop/Repeat will need this later.
     * --------------------------------------------------
     */

    it("allows a general cycle", () => {
        const nodes = [
            createNode(
                "node-a",
                "tap",
                "Tap A",
            ),

            createNode(
                "node-b",
                "tap",
                "Tap B",
            ),

            createNode(
                "node-c",
                "tap",
                "Tap C",
            ),
        ];

        const edges = [
            createEdge(
                "edge-a-b",
                "node-a",
                "node-b",
            ),

            createEdge(
                "edge-b-c",
                "node-b",
                "node-c",
            ),

            createEdge(
                "edge-c-a",
                "node-c",
                "node-a",
            ),
        ];

        const result =
            validateGraph(
                nodes,
                edges,
            );

        /*
         * No self-loop exists, so the
         * graph validator should not reject
         * this cycle yet.
         */
        expect(
            result.errors.some(
                (error) =>
                    error.type ===
                    "self-loop",
            ),
        ).toBe(false);
    });

    /*
     * --------------------------------------------------
     * Multiple start nodes
     *
     * Currently allowed.
     *
     * We don't reject this yet because
     * the existing execution engine may
     * support more than one root in some
     * situations.
     * --------------------------------------------------
     */

    it("detects a disconnected root node as unreachable", () => {
        const nodes = [
            createNode(
                "start",
                "launchApp",
                "Launch App",
            ),

            createNode(
                "connected",
                "tap",
                "Tap",
            ),

            createNode(
                "unreachable-node",
                "screenshot",
                "Screenshot",
            ),
        ];

        const edges = [
            createEdge(
                "edge-start-connected",
                "start",
                "connected",
            ),
        ];

        const result =
            validateGraph(
                nodes,
                edges,
            );

        expect(
            result.valid,
        ).toBe(false);

        expect(
            result.errors.some(
                (error) =>
                    error.type ===
                    "unreachable-node" &&
                    error.nodeId ===
                    "unreachable-node",
            ),
        ).toBe(true);
    });

    /*
     * --------------------------------------------------
     * IF branch nodes must also be reachable
     * --------------------------------------------------
     */

    it("detects an unreachable IF branch node", () => {
        const nodes = [
            createNode(
                "start",
                "launchApp",
                "Launch App",
            ),

            createNode(
                "if-1",
                "if",
                "Check Login",
            ),

            createNode(
                "true-node",
                "tap",
                "Tap Login",
            ),

            createNode(
                "false-node",
                "screenshot",
                "Screenshot",
            ),
        ];

        const edges = [
            createEdge(
                "edge-start-if",
                "start",
                "if-1",
            ),

            createEdge(
                "edge-true",
                "if-1",
                "true-node",
                "true",
            ),

            /*
             * Intentionally missing FALSE
             * connection.
             */
        ];

        const result =
            validateGraph(
                nodes,
                edges,
            );

        expect(result.valid).toBe(false);

        expect(
            result.errors.some(
                (error) =>
                    error.type ===
                    "if-missing-false",
            ),
        ).toBe(true);

        expect(
            result.errors.some(
                (error) =>
                    error.type ===
                    "unreachable-node",
            ),
        ).toBe(true);

        expect(
            result.errors.find(
                (error) =>
                    error.nodeId ===
                    "false-node",
            ),
        ).toBeDefined();
    });

    /*
     * --------------------------------------------------
     * Valid IF with nodes after branches
     * --------------------------------------------------
     */

    it("accepts an IF flow with nodes after both branches", () => {
        const nodes = [
            createNode(
                "start",
                "launchApp",
                "Launch App",
            ),

            createNode(
                "if-1",
                "if",
                "Check Login",
            ),

            createNode(
                "true-node",
                "tap",
                "Login",
            ),

            createNode(
                "false-node",
                "screenshot",
                "Screenshot",
            ),

            createNode(
                "after",
                "screenshot",
                "Final Screenshot",
            ),
        ];

        const edges = [
            createEdge(
                "edge-start-if",
                "start",
                "if-1",
            ),

            createEdge(
                "edge-true",
                "if-1",
                "true-node",
                "true",
            ),

            createEdge(
                "edge-false",
                "if-1",
                "false-node",
                "false",
            ),

            createEdge(
                "edge-true-after",
                "true-node",
                "after",
            ),

            createEdge(
                "edge-false-after",
                "false-node",
                "after",
            ),
        ];

        const result =
            validateGraph(
                nodes,
                edges,
            );

        expect(result.valid).toBe(true);

        expect(
            result.errors,
        ).toEqual([]);
    });
});