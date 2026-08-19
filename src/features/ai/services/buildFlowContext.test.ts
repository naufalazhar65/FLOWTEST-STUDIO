import {
    beforeEach,
    describe,
    expect,
    it,
} from "vitest";

import {
    useFlowStore,
} from "../../flow/store/useFlowStore";

import {
    buildFlowContext,
} from "./buildFlowContext";

describe(
    "buildFlowContext",
    () => {
        beforeEach(
            () => {
                useFlowStore.setState({
                    nodes: [],
                    edges: [],
                    selectedNodeId:
                        null,
                });
            },
        );

        it(
            "builds context from flow nodes and edges",
            () => {
                useFlowStore.setState({
                    nodes: [
                        {
                            id:
                                "node-1",

                            type:
                                "flowNode",

                            position: {
                                x: 0,
                                y: 0,
                            },

                            data: {
                                action:
                                    "tap",

                                title:
                                    "Tap Login",

                                subtitle:
                                    "Tap login button",

                                locatorStrategy:
                                    "accessibilityId",

                                locator:
                                    "login-button",

                                semanticTarget:
                                    "Login",

                                debug: {
                                    breakpoint:
                                        false,
                                },
                            },
                        },
                        {
                            id:
                                "node-2",

                            type:
                                "flowNode",

                            position: {
                                x: 200,
                                y: 0,
                            },

                            data: {
                                action:
                                    "input",

                                title:
                                    "Input Username",

                                subtitle:
                                    "Enter username",

                                locatorStrategy:
                                    "accessibilityId",

                                locator:
                                    "username-field",

                                semanticTarget:
                                    "Username",

                                text:
                                    "test-user",

                                debug: {
                                    breakpoint:
                                        false,
                                },
                            },
                        },
                    ],

                    edges: [
                        {
                            id:
                                "edge-1",

                            source:
                                "node-1",

                            target:
                                "node-2",

                            sourceHandle:
                                "source",

                            targetHandle:
                                "target",
                        },
                    ],

                    selectedNodeId:
                        "node-1",
                });

                const result =
                    buildFlowContext();

                expect(
                    result.nodeCount,
                ).toBe(
                    2,
                );

                expect(
                    result.edgeCount,
                ).toBe(
                    1,
                );

                expect(
                    result.selectedNodeId,
                ).toBe(
                    "node-1",
                );

                expect(
                    result.selectedNode,
                ).toMatchObject({
                    id:
                        "node-1",

                    action:
                        "tap",

                    title:
                        "Tap Login",

                    subtitle:
                        "Tap login button",

                    locatorStrategy:
                        "accessibilityId",

                    locator:
                        "login-button",
                });

                expect(
                    result.nodes,
                ).toHaveLength(
                    2,
                );

                expect(
                    result.nodes[0],
                ).toMatchObject({
                    id:
                        "node-1",

                    action:
                        "tap",

                    title:
                        "Tap Login",

                    subtitle:
                        "Tap login button",

                    locatorStrategy:
                        "accessibilityId",

                    locator:
                        "login-button",

                    details: {
                        semanticTarget:
                            "Login",
                    },
                });

                expect(
                    result.nodes[1],
                ).toMatchObject({
                    id:
                        "node-2",

                    action:
                        "input",

                    title:
                        "Input Username",

                    locatorStrategy:
                        "accessibilityId",

                    locator:
                        "username-field",

                    details: {
                        semanticTarget:
                            "Username",

                        text:
                            "test-user",
                    },
                });

                expect(
                    result.edges,
                ).toEqual([
                    {
                        id:
                            "edge-1",

                        source:
                            "node-1",

                        target:
                            "node-2",

                        sourceHandle:
                            "source",

                        targetHandle:
                            "target",
                    },
                ]);
            },
        );

        it(
            "returns null selectedNode when no node is selected",
            () => {
                useFlowStore.setState({
                    nodes: [
                        {
                            id:
                                "node-1",

                            type:
                                "flowNode",

                            position: {
                                x: 0,
                                y: 0,
                            },

                            data: {
                                action:
                                    "tap",

                                title:
                                    "Tap Login",

                                subtitle:
                                    "Tap login",

                                locatorStrategy:
                                    "accessibilityId",

                                locator:
                                    "login-button",

                                debug: {
                                    breakpoint:
                                        false,
                                },
                            },
                        },
                    ],

                    edges: [],

                    selectedNodeId:
                        null,
                });

                const result =
                    buildFlowContext();

                expect(
                    result.selectedNodeId,
                ).toBeNull();

                expect(
                    result.selectedNode,
                ).toBeNull();
            },
        );

        it(
            "returns an empty context when the flow is empty",
            () => {
                const result =
                    buildFlowContext();

                expect(
                    result.selectedNodeId,
                ).toBeNull();

                expect(
                    result.selectedNode,
                ).toBeNull();

                expect(
                    result.nodes,
                ).toEqual(
                    [],
                );

                expect(
                    result.edges,
                ).toEqual(
                    [],
                );

                expect(
                    result.nodeCount,
                ).toBe(
                    0,
                );

                expect(
                    result.edgeCount,
                ).toBe(
                    0,
                );
            },
        );
    },
);