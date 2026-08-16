import {
    describe,
    expect,
    it,
} from "vitest";

import {
    createNode,
} from "../factories/nodeFactory";

import {
    insertNodeWithDataAction,
} from "./insertNodeWithData";

describe(
    "insertNodeWithDataAction",
    () => {
        it(
            "inserts a node before a target node",
            () => {
                const source =
                    createNode(
                        "tap",
                    );

                const target =
                    createNode(
                        "tap",
                    );

                const edges = [
                    {
                        id:
                            "edge-source-target",

                        source:
                            source.id,

                        target:
                            target.id,

                        sourceHandle:
                            "next",

                        type:
                            "flow" as const,

                        animated:
                            false,
                    },
                ];

                const result =
                    insertNodeWithDataAction(
                        [
                            source,
                            target,
                        ],
                        edges,
                        null,
                        "wait",
                        {
                            timeout:
                                1000,
                            locatorStrategy:
                                "xpath",
                            locator:
                                "//button",
                        },
                        undefined,
                        target.id,
                    );

                const insertedNode =
                    result.node;

                expect(
                    insertedNode,
                ).not.toBeNull();

                const incoming =
                    result.edges.find(
                        (edge) =>
                            edge.source ===
                                source.id &&
                            edge.target ===
                                insertedNode?.id,
                    );

                const outgoing =
                    result.edges.find(
                        (edge) =>
                            edge.source ===
                                insertedNode?.id &&
                            edge.target ===
                                target.id,
                    );

                expect(
                    incoming,
                ).toMatchObject({
                    source:
                        source.id,

                    target:
                        insertedNode?.id,

                    sourceHandle:
                        "next",
                });

                expect(
                    outgoing,
                ).toMatchObject({
                    source:
                        insertedNode?.id,

                    target:
                        target.id,

                    sourceHandle:
                        "next",
                });

                expect(
                    result.edges,
                ).toHaveLength(
                    2,
                );
            },
        );

        it(
            "inserts a node after an edge",
            () => {
                const source =
                    createNode(
                        "tap",
                    );

                const target =
                    createNode(
                        "tap",
                    );

                const edges = [
                    {
                        id:
                            "edge-source-target",

                        source:
                            source.id,

                        target:
                            target.id,

                        sourceHandle:
                            "next",

                        type:
                            "flow" as const,

                        animated:
                            false,
                    },
                ];

                const result =
                    insertNodeWithDataAction(
                        [
                            source,
                            target,
                        ],
                        edges,
                        "edge-source-target",
                        "wait",
                        {
                            timeout:
                                1000,
                        },
                    );

                const insertedNode =
                    result.node;

                expect(
                    insertedNode,
                ).not.toBeNull();

                expect(
                    result.edges,
                ).toHaveLength(
                    2,
                );

                expect(
                    result.edges.find(
                        (edge) =>
                            edge.source ===
                                source.id &&
                            edge.target ===
                                insertedNode?.id,
                    ),
                ).toMatchObject({
                    sourceHandle:
                        "next",
                });

                expect(
                    result.edges.find(
                        (edge) =>
                            edge.source ===
                                insertedNode?.id &&
                            edge.target ===
                                target.id,
                    ),
                ).toMatchObject({
                    sourceHandle:
                        "next",
                });
            },
        );

        it(
            "inserts before a root node",
            () => {
                const target =
                    createNode(
                        "tap",
                    );

                const result =
                    insertNodeWithDataAction(
                        [
                            target,
                        ],
                        [],
                        null,
                        "wait",
                        {
                            timeout:
                                1000,
                        },
                        undefined,
                        target.id,
                    );

                expect(
                    result.node,
                ).not.toBeNull();

                expect(
                    result.edges,
                ).toHaveLength(
                    1,
                );

                expect(
                    result.edges[0],
                ).toMatchObject({
                    target:
                        target.id,

                    sourceHandle:
                        "next",
                });
            },
        );

        it(
            "keeps existing edges untouched when insertion fails",
            () => {
                const source =
                    createNode(
                        "tap",
                    );

                const result =
                    insertNodeWithDataAction(
                        [
                            source,
                        ],
                        [],
                        null,
                        "wait",
                        {},
                        undefined,
                        "missing-node",
                    );

                expect(
                    result.node,
                ).toBeNull();

                expect(
                    result.nodes,
                ).toEqual([
                    source,
                ]);

                expect(
                    result.edges,
                ).toEqual([]);
            },
        );
    },
);