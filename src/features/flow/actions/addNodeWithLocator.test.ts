import {
    describe,
    expect,
    it,
} from "vitest";

import {
    initialNodes,
    initialEdges,
} from "../data/initialFlow";

import { addNodeWithLocatorAction } from "./addNodeWithLocator";

describe("addNodeWithLocatorAction", () => {
    it("should add a node with locator data", () => {
        const result =
            addNodeWithLocatorAction(
                initialNodes,
                initialEdges,
                "tap",
                {
                    locatorStrategy: "id",
                    locator: "login-button",
                },
            );

        const newNode =
            result.nodes.at(-1);

        expect(newNode).toBeDefined();

        expect(
            newNode?.data,
        ).toMatchObject({
            action: "tap",
            locatorStrategy: "id",
            locator: "login-button",
        });
    });

    it("should apply optional text override", () => {
        const result =
            addNodeWithLocatorAction(
                initialNodes,
                initialEdges,
                "input",
                {
                    locatorStrategy: "id",
                    locator: "username",
                    text: "naufal",
                },
            );

        const newNode =
            result.nodes.at(-1);

        expect(
            newNode?.data,
        ).toMatchObject({
            action: "input",
            locatorStrategy: "id",
            locator: "username",
            text: "naufal",
        });
    });

    it("should connect the new node to the last node", () => {
        const result =
            addNodeWithLocatorAction(
                initialNodes,
                initialEdges,
                "tap",
                {
                    locatorStrategy: "id",
                    locator: "login-button",
                },
            );

        const newNode =
            result.nodes.at(-1);

        const lastNode =
            initialNodes.at(-1);

        expect(
            result.edges,
        ).toHaveLength(
            initialEdges.length + 1,
        );

        expect(
            result.edges.at(-1),
        ).toMatchObject({
            source: lastNode?.id,
            target: newNode?.id,
        });
    });

    it("should place the first node at the default position", () => {
        const result =
            addNodeWithLocatorAction(
                [],
                [],
                "tap",
                {
                    locatorStrategy: "id",
                    locator: "login-button",
                },
            );

        expect(
            result.nodes[0].position,
        ).toEqual({
            x: 250,
            y: 80,
        });

        expect(result.edges).toEqual([]);
    });

    it("should not mutate the original nodes or edges", () => {
        const nodes =
            structuredClone(
                initialNodes,
            );

        const edges =
            structuredClone(
                initialEdges,
            );

        addNodeWithLocatorAction(
            nodes,
            edges,
            "tap",
            {
                locatorStrategy: "id",
                locator: "login-button",
            },
        );

        expect(nodes).toEqual(
            initialNodes,
        );

        expect(edges).toEqual(
            initialEdges,
        );
    });
});