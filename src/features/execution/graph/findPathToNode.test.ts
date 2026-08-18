import {
    describe,
    expect,
    it,
} from "vitest";

import {
    findPathToNode,
} from "./findPathToNode";

import type { Edge } from "reactflow";
import type { FlowNode } from "../../flow/types/flowNode";

describe(
    "findPathToNode",
    () => {
        it(
            "returns the path from the start node to the target node",
            () => {
                // Arrange
                const nodes: FlowNode[] = [
                    { id: "A" } as FlowNode,
                    { id: "B" } as FlowNode,
                    { id: "C" } as FlowNode,
                ];

                const edges: Edge[] = [
                    {
                        id: "1",
                        source: "A",
                        target: "B",
                    },
                    {
                        id: "2",
                        source: "B",
                        target: "C",
                    },
                ];

                // Act
                const result =
                    findPathToNode(
                        nodes,
                        edges,
                        "C",
                    );

                // Assert
                expect(
                    result.map(
                        (node) => node.id,
                    ),
                ).toEqual([
                    "A",
                    "B",
                    "C",
                ]);
            },
        );

        it(
            "returns the target node when the target is the start node",
            () => {
                // Arrange
                const nodes: FlowNode[] = [
                    { id: "A" } as FlowNode,
                ];

                const edges: Edge[] = [];

                // Act
                const result =
                    findPathToNode(
                        nodes,
                        edges,
                        "A",
                    );

                // Assert
                expect(
                    result.map(
                        (node) => node.id,
                    ),
                ).toEqual([
                    "A",
                ]);
            },
        );

        it(
            "returns an empty array when the target node does not exist",
            () => {
                // Arrange
                const nodes: FlowNode[] = [
                    { id: "A" } as FlowNode,
                    { id: "B" } as FlowNode,
                ];

                const edges: Edge[] = [
                    {
                        id: "1",
                        source: "A",
                        target: "B",
                    },
                ];

                // Act
                const result =
                    findPathToNode(
                        nodes,
                        edges,
                        "C",
                    );

                // Assert
                expect(result).toEqual(
                    [],
                );
            },
        );

        it(
            "returns an empty array when the target is unreachable",
            () => {
                // Arrange
                const nodes: FlowNode[] = [
                    { id: "A" } as FlowNode,
                    { id: "B" } as FlowNode,
                    { id: "C" } as FlowNode,
                ];

                const edges: Edge[] = [
                    {
                        id: "1",
                        source: "A",
                        target: "B",
                    },
                ];

                // Act
                const result =
                    findPathToNode(
                        nodes,
                        edges,
                        "C",
                    );

                // Assert
                expect(result).toEqual(
                    [],
                );
            },
        );

        it(
            "selects the path that reaches the target through a branch",
            () => {
                // Arrange
                const nodes: FlowNode[] = [
                    { id: "A" } as FlowNode,
                    { id: "B" } as FlowNode,
                    { id: "C" } as FlowNode,
                    { id: "D" } as FlowNode,
                ];

                const edges: Edge[] = [
                    {
                        id: "1",
                        source: "A",
                        target: "B",
                    },
                    {
                        id: "2",
                        source: "A",
                        target: "C",
                    },
                    {
                        id: "3",
                        source: "C",
                        target: "D",
                    },
                ];

                // Act
                const result =
                    findPathToNode(
                        nodes,
                        edges,
                        "D",
                    );

                // Assert
                expect(
                    result.map(
                        (node) => node.id,
                    ),
                ).toEqual([
                    "A",
                    "C",
                    "D",
                ]);
            },
        );

        it(
            "does not loop forever when the graph contains a cycle",
            () => {
                // Arrange
                const nodes: FlowNode[] = [
                    { id: "S" } as FlowNode,
                    { id: "A" } as FlowNode,
                    { id: "B" } as FlowNode,
                    { id: "C" } as FlowNode,
                ];

                const edges: Edge[] = [
                    {
                        id: "1",
                        source: "S",
                        target: "A",
                    },
                    {
                        id: "2",
                        source: "A",
                        target: "B",
                    },
                    {
                        id: "3",
                        source: "B",
                        target: "A",
                    },
                    {
                        id: "4",
                        source: "B",
                        target: "C",
                    },
                ];

                // Act
                const result =
                    findPathToNode(
                        nodes,
                        edges,
                        "C",
                    );

                // Assert
                expect(
                    result.map(
                        (node) => node.id,
                    ),
                ).toEqual([
                    "S",
                    "A",
                    "B",
                    "C",
                ]);
            },
        );
    },
);