import {
    describe,
    expect,
    it,
} from "vitest";

import {
    buildApplicationStateRecoveryPlan,
} from "./buildApplicationStateRecoveryPlan";

import type { FlowNode } from "../../flow/types/flowNode";
import type { Edge } from "reactflow";

describe(
    "buildApplicationStateRecoveryPlan",
    () => {
        it(
            "returns the prerequisite path before the failed node",
            () => {
                const nodes: FlowNode[] = [
                    {
                        id: "A",
                    } as FlowNode,

                    {
                        id: "B",
                    } as FlowNode,

                    {
                        id: "C",
                    } as FlowNode,
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

                const result =
                    buildApplicationStateRecoveryPlan(
                        nodes,
                        edges,
                        "C",
                    );

                expect(
                    result.map(
                        (node) =>
                            node.id,
                    ),
                ).toEqual([
                    "A",
                    "B",
                ]);
            },
        );

        it(
            "returns an empty recovery path when the failed node is the start node",
            () => {
                const nodes: FlowNode[] = [
                    {
                        id: "A",
                    } as FlowNode,
                ];

                const edges: Edge[] = [];

                const result =
                    buildApplicationStateRecoveryPlan(
                        nodes,
                        edges,
                        "A",
                    );

                expect(
                    result,
                ).toEqual([]);
            },
        );

        it(
            "returns an empty recovery path when the failed node is unreachable",
            () => {
                const nodes: FlowNode[] = [
                    {
                        id: "A",
                    } as FlowNode,

                    {
                        id: "B",
                    } as FlowNode,

                    {
                        id: "C",
                    } as FlowNode,
                ];

                const edges: Edge[] = [
                    {
                        id: "1",
                        source: "A",
                        target: "B",
                    },
                ];

                const result =
                    buildApplicationStateRecoveryPlan(
                        nodes,
                        edges,
                        "C",
                    );

                expect(
                    result,
                ).toEqual([]);
            },
        );

        it(
            "does not include the failed node in the recovery path",
            () => {
                const nodes: FlowNode[] = [
                    {
                        id: "A",
                    } as FlowNode,

                    {
                        id: "B",
                    } as FlowNode,

                    {
                        id: "C",
                    } as FlowNode,
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

                const result =
                    buildApplicationStateRecoveryPlan(
                        nodes,
                        edges,
                        "C",
                    );

                expect(
                    result.some(
                        (node) =>
                            node.id ===
                            "C",
                    ),
                ).toBe(false);
            },
        );
        it(
            "uses Launch App instead of replaying later state-changing predecessors",
            () => {
                const nodes: FlowNode[] = [
                    {
                        id:
                            "launch",

                        type:
                            "flow",

                        position: {
                            x: 0,
                            y: 0,
                        },

                        data: {
                            action:
                                "launchApp",

                            title:
                                "Launch App",

                            subtitle:
                                "Launch application",

                            platform:
                                "iOS",

                            appPackage:
                                "",

                            appActivity:
                                "",

                            bundleId:
                                "com.example.app",

                            app:
                                "",

                            noReset:
                                false,

                            debug: {
                                breakpoint:
                                    false,
                            },
                        },
                    } as FlowNode,

                    {
                        id:
                            "open-dialog",

                        type:
                            "flow",

                        position: {
                            x: 0,
                            y: 100,
                        },

                        data: {
                            action:
                                "tap",

                            title:
                                "Open Dialog",

                            subtitle:
                                "Open confirmation dialog",

                            locatorStrategy:
                                "accessibilityId",

                            locator:
                                "Reset App State",

                            debug: {
                                breakpoint:
                                    false,
                            },
                        },
                    } as FlowNode,

                    {
                        id:
                            "confirm-reset",

                        type:
                            "flow",

                        position: {
                            x: 0,
                            y: 200,
                        },

                        data: {
                            action:
                                "tap",

                            title:
                                "Confirm Reset",

                            subtitle:
                                "Confirm reset",

                            locatorStrategy:
                                "iOSClassChain",

                            locator:
                                '**/XCUIElementTypeButton[`name == "RESET APP"`]',

                            debug: {
                                breakpoint:
                                    false,
                            },
                        },
                    } as FlowNode,

                    {
                        id:
                            "failed-node",

                        type:
                            "flow",

                        position: {
                            x: 0,
                            y: 300,
                        },

                        data: {
                            action:
                                "tap",

                            title:
                                "Product Item",

                            subtitle:
                                "Tap product item",

                            locatorStrategy:
                                "iOSClassChain",

                            locator:
                                '**/XCUIElementTypeOther[`name == "ProductItem"`][1]',

                            debug: {
                                breakpoint:
                                    false,
                            },
                        },
                    } as FlowNode,
                ];

                const edges: Edge[] = [
                    {
                        id:
                            "edge-1",

                        source:
                            "launch",

                        target:
                            "open-dialog",
                    },

                    {
                        id:
                            "edge-2",

                        source:
                            "open-dialog",

                        target:
                            "confirm-reset",
                    },

                    {
                        id:
                            "edge-3",

                        source:
                            "confirm-reset",

                        target:
                            "failed-node",
                    },
                ];

                const result =
                    buildApplicationStateRecoveryPlan(
                        nodes,
                        edges,
                        "failed-node",
                    );

                expect(
                    result.map(
                        (node) => ({
                            id:
                                node.id,

                            action:
                                node.data.action,

                            locator:
                                "locator" in
                                    node.data
                                    ? node.data.locator
                                    : undefined,
                        }),
                    ),
                ).toEqual([
                    {
                        id:
                            "launch",

                        action:
                            "launchApp",

                        locator:
                            undefined,
                    },
                ]);
            },
        );

        it(
            "uses Launch App as the recovery baseline for a later target",
            () => {
                const nodes: FlowNode[] = [
                    {
                        id:
                            "launch",

                        type:
                            "flow",

                        position: {
                            x: 0,
                            y: 0,
                        },

                        data: {
                            action:
                                "launchApp",

                            title:
                                "Launch App",

                            subtitle:
                                "Launch application",

                            platform:
                                "iOS",

                            appPackage:
                                "",

                            appActivity:
                                "",

                            bundleId:
                                "com.example.app",

                            app:
                                "",

                            noReset:
                                false,

                            debug: {
                                breakpoint:
                                    false,
                            },
                        },
                    } as FlowNode,

                    {
                        id:
                            "menu",

                        type:
                            "flow",

                        position: {
                            x: 0,
                            y: 100,
                        },

                        data: {
                            action:
                                "tap",

                            title:
                                "Tap",

                            subtitle:
                                "Open menu",

                            locatorStrategy:
                                "accessibilityId",

                            locator:
                                "Menu Icons",

                            debug: {
                                breakpoint:
                                    false,
                            },
                        },
                    } as FlowNode,

                    {
                        id:
                            "failed-node",

                        type:
                            "flow",

                        position: {
                            x: 0,
                            y: 200,
                        },

                        data: {
                            action:
                                "tap",

                            title:
                                "Product Item",

                            subtitle:
                                "Tap product item",

                            locatorStrategy:
                                "iOSClassChain",

                            locator:
                                '**/XCUIElementTypeOther[`name == "ProductItem"`][1]',

                            debug: {
                                breakpoint:
                                    false,
                            },
                        },
                    } as FlowNode,
                ];

                const edges: Edge[] = [
                    {
                        id:
                            "edge-1",

                        source:
                            "launch",

                        target:
                            "menu",
                    },

                    {
                        id:
                            "edge-2",

                        source:
                            "menu",

                        target:
                            "failed-node",
                    },
                ];

                const result =
                    buildApplicationStateRecoveryPlan(
                        nodes,
                        edges,
                        "failed-node",
                    );

                expect(
                    result.map(
                        (node) =>
                            node.id,
                    ),
                ).toEqual([
                    "launch",
                ]);
            },
        );

    },
);