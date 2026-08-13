import {
    describe,
    expect,
    it,
} from "vitest";

import {
    initialNodes,
} from "../data/initialFlow";

import {
    updateNodeDataAction,
} from "./updateNodeData";

describe("updateNodeDataAction", () => {
    it("should update node data", () => {
        const result =
            updateNodeDataAction(
                initialNodes,
                "1",
                {
                    locator: "login-button",
                },
            );

        expect(
            result.find(
                (node) => node.id === "1",
            )?.data,
        ).toMatchObject({
            locator: "login-button",
        });
    });

    it("should preserve existing node data", () => {
        const result =
            updateNodeDataAction(
                initialNodes,
                "1",
                {
                    locator: "login-button",
                },
            );

        expect(
            result[0].data,
        ).toMatchObject({
            action: "tap",
            title: "Tap",
            subtitle: "Tap an element",
            locatorStrategy: "id",
            locator: "login-button",
            debug: {
                breakpoint: false,
            },
        });
    });

    it("should update multiple fields", () => {
        const result =
            updateNodeDataAction(
                initialNodes,
                "2",
                {
                    locator: "username",
                    text: "naufal",
                },
            );

        expect(
            result[1].data,
        ).toMatchObject({
            action: "input",
            locator: "username",
            text: "naufal",
        });
    });

    it("should not modify other nodes", () => {
        const result =
            updateNodeDataAction(
                initialNodes,
                "1",
                {
                    locator: "login-button",
                },
            );

        expect(result[1]).toEqual(
            initialNodes[1],
        );

        expect(result[2]).toEqual(
            initialNodes[2],
        );
    });

    it("should return the original graph when the node does not exist", () => {
        const result =
            updateNodeDataAction(
                initialNodes,
                "missing-node",
                {
                    locator: "login-button",
                },
            );

        expect(result).toEqual(
            initialNodes,
        );
    });

    it("should not mutate the original node data", () => {
        const nodes =
            structuredClone(
                initialNodes,
            );

        updateNodeDataAction(
            nodes,
            "1",
            {
                locator: "changed",
            },
        );

        expect(
            nodes[0].data,
        ).toEqual(
            initialNodes[0].data,
        );
    });

    it("should preserve breakpoint state", () => {
        const result =
            updateNodeDataAction(
                initialNodes,
                "1",
                {
                    locator: "login-button",
                },
            );

        expect(
            result[0].data.debug.breakpoint,
        ).toBe(false);
    });
});