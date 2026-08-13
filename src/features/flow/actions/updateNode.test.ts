import {
    describe,
    expect,
    it,
} from "vitest";

import {
    initialNodes,
} from "../data/initialFlow";

import { updateNodeAction } from "./updateNode";

describe("updateNodeAction", () => {
    it("should update the target node", () => {
        const result = updateNodeAction(
            initialNodes,
            "1",
            {
                selected: true,
            },
        );

        expect(
            result.find(
                (node) => node.id === "1",
            )?.selected,
        ).toBe(true);
    });

    it("should preserve existing node data", () => {
        const result = updateNodeAction(
            initialNodes,
            "1",
            {
                selected: true,
            },
        );

        expect(
            result.find(
                (node) => node.id === "1",
            )?.data,
        ).toEqual(initialNodes[0].data);
    });

    it("should not modify other nodes", () => {
        const result = updateNodeAction(
            initialNodes,
            "1",
            {
                selected: true,
            },
        );

        expect(result[1]).toEqual(
            initialNodes[1],
        );

        expect(result[2]).toEqual(
            initialNodes[2],
        );
    });

    it("should return the same graph when the node does not exist", () => {
        const result = updateNodeAction(
            initialNodes,
            "missing-node",
            {
                selected: true,
            },
        );

        expect(result).toEqual(
            initialNodes,
        );
    });

    it("should not mutate the original nodes", () => {
        const nodes =
            structuredClone(
                initialNodes,
            );

        updateNodeAction(
            nodes,
            "1",
            {
                selected: true,
            },
        );

        expect(nodes).toEqual(
            initialNodes,
        );
    });
});