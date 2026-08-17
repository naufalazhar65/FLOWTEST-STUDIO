import {
    describe,
    expect,
    it,
} from "vitest";

import {
    buildQAFixPlan,
} from "./buildQAFixPlan.mjs";

const context = {
    selectedNodeId: null,

    nodes: [
        {
            id: "tap-login",

            action: "tap",

            title: "Tap Login",

            subtitle:
                "Tap Login button",

            locatorStrategy:
                "accessibilityId",

            locator:
                "Login",
        },
    ],

    edges: [],
};

describe(
    "buildQAFixPlan",
    () => {
        it(
    "creates an addValidation plan",
    () => {
        const result =
            buildQAFixPlan(
                {
                    priority:
                        "high",

                    impact:
                        "high",

                    finding:
                        "Flow ends without validation",

                    nodeId:
                        "tap-login",

                    suggestedFix: {
                        type:
                            "addValidation",

                        targetNodeId:
                            "tap-login",
                    },
                },
                context,
            );

        expect(
            result,
        ).not.toBeNull();

        expect(
            result.type,
        ).toBe(
            "modification_plan",
        );

        expect(
            result.operations,
        ).toHaveLength(
            2,
        );

        const getTextOperation =
            result.operations[0];

        expect(
            getTextOperation.type,
        ).toBe(
            "addNodeAfter",
        );

        expect(
            getTextOperation.targetNodeId,
        ).toBe(
            "tap-login",
        );

        expect(
            getTextOperation.resultId,
        ).toBe(
            "validationText",
        );

        expect(
            getTextOperation.step.action,
        ).toBe(
            "getText",
        );

        expect(
            getTextOperation.step.locatorStrategy,
        ).toBe(
            "accessibilityId",
        );

        expect(
            getTextOperation.step.locator,
        ).toBe(
            "Login",
        );

        const assertOperation =
            result.operations[1];

        expect(
            assertOperation.type,
        ).toBe(
            "addNodeAfter",
        );

        expect(
            assertOperation.targetNodeId,
        ).toBe(
            "$validationText",
        );

        expect(
            assertOperation.step.action,
        ).toBe(
            "assert",
        );

        expect(
            assertOperation.step.actual,
        ).toBe(
            "${actualText}",
        );

        expect(
            assertOperation.step.operator,
        ).toBe(
            "isNotEmpty",
        );

        expect(
            assertOperation.step.expected,
        ).toBe(
            "true",
        );
    },
);

it(
    "uses the nearest downstream locator when the target has no locator",
    () => {
        const noLocatorContext = {
            selectedNodeId:
                null,

            nodes: [
                {
                    id:
                        "press-return",

                    action:
                        "pressReturn",

                    title:
                        "Press Return",

                    subtitle:
                        "Press Return key",
                },

                {
                    id:
                        "result-node",

                    action:
                        "getText",

                    title:
                        "Get Text",

                    subtitle:
                        "Read text",

                    locatorStrategy:
                        "accessibilityId",

                    locator:
                        "Result",
                },
            ],

            edges: [
                {
                    id:
                        "edge-1",

                    source:
                        "press-return",

                    target:
                        "result-node",
                },
            ],
        };

        const result =
            buildQAFixPlan(
                {
                    priority:
                        "low",

                    impact:
                        "low",

                    finding:
                        "Missing assertion",

                    nodeId:
                        "press-return",

                    suggestedFix: {
                        type:
                            "addValidation",

                        targetNodeId:
                            "press-return",
                    },
                },
                noLocatorContext,
            );

        expect(
            result,
        ).not.toBeNull();

        expect(
            result.operations,
        ).toHaveLength(
            2,
        );

        expect(
            result.operations[0]
                .step.action,
        ).toBe(
            "getText",
        );

        expect(
            result.operations[0]
                .step
                .locatorStrategy,
        ).toBe(
            "accessibilityId",
        );

        expect(
            result.operations[0]
                .step
                .locator,
        ).toBe(
            "Result",
        );

        expect(
            result.warnings,
        ).toHaveLength(
            1,
        );
    },
);

it(
    "returns null when validation target has no usable locator",
    () => {
        const noLocatorContext = {
            selectedNodeId:
                null,

            nodes: [
                {
                    id:
                        "press-return",

                    action:
                        "pressReturn",

                    title:
                        "Press Return",

                    subtitle:
                        "Press Return key",
                },
            ],

            edges: [],
        };

        const result =
            buildQAFixPlan(
                {
                    priority:
                        "low",

                    impact:
                        "low",

                    finding:
                        "Missing assertion",

                    nodeId:
                        "press-return",

                    suggestedFix: {
                        type:
                            "addValidation",

                        targetNodeId:
                            "press-return",
                    },
                },
                noLocatorContext,
            );

        expect(
            result,
        ).toBeNull();
    },
);

        it(
            "creates a locator review plan",
            () => {
                const result =
                    buildQAFixPlan(
                        {
                            priority:
                                "medium",

                            impact:
                                "medium",

                            finding:
                                "Duplicate locator",

                            nodeId:
                                "tap-login",

                            suggestedFix: {
                                type:
                                    "reviewLocator",

                                targetNodeId:
                                    "tap-login",
                            },
                        },
                        context,
                    );

                expect(
                    result,
                ).not.toBeNull();

                expect(
                    result.operation.type,
                ).toBe(
                    "updateNode",
                );

                expect(
                    result.operation
                        .targetNodeId,
                ).toBe(
                    "tap-login",
                );

                expect(
                    result.warnings,
                ).toHaveLength(
                    1,
                );
            },
        );

        it(
            "returns null for unknown fix types",
            () => {
                const result =
                    buildQAFixPlan(
                        {
                            nodeId:
                                "tap-login",

                            suggestedFix: {
                                type:
                                    "unknownFix",
                            },
                        },
                        context,
                    );

                expect(
                    result,
                ).toBeNull();
            },
        );

        it(
            "returns null when target node does not exist",
            () => {
                const result =
                    buildQAFixPlan(
                        {
                            nodeId:
                                "missing-node",

                            suggestedFix: {
                                type:
                                    "addValidation",

                                targetNodeId:
                                    "missing-node",
                            },
                        },
                        context,
                    );

                expect(
                    result,
                ).toBeNull();
            },
        );

        it(
            "returns null without a target node",
            () => {
                const result =
                    buildQAFixPlan(
                        {
                            suggestedFix: {
                                type:
                                    "addValidation",
                            },
                        },
                        context,
                    );

                expect(
                    result,
                ).toBeNull();
            },
        );

        it(
    "does not create an invalid getText step for a target without locator",
    () => {
        const noLocatorContext = {
            selectedNodeId: null,

            nodes: [
                {
                    id: "press-return",

                    action:
                        "pressReturn",

                    title:
                        "Press Return",

                    subtitle:
                        "Press Return key",
                },

                {
                    id: "result-node",

                    action:
                        "getText",

                    title:
                        "Get Text",

                    subtitle:
                        "Read text",

                    locatorStrategy:
                        "accessibilityId",

                    locator:
                        "Result",
                },
            ],

            edges: [
                {
                    id: "edge-1",

                    source:
                        "press-return",

                    target:
                        "result-node",
                },
            ],
        };

        const result =
            buildQAFixPlan(
                {
                    priority:
                        "low",

                    impact:
                        "low",

                    finding:
                        "Missing assertion",

                    nodeId:
                        "press-return",

                    suggestedFix: {
                        type:
                            "addValidation",

                        targetNodeId:
                            "press-return",
                    },
                },
                noLocatorContext,
            );

        expect(
            result,
        ).not.toBeNull();

        expect(
            result.operations,
        ).toHaveLength(
            2,
        );

        const getTextOperation =
            result.operations[0];

        expect(
            getTextOperation.step.action,
        ).toBe(
            "getText",
        );

        expect(
            getTextOperation.step
                .locatorStrategy,
        ).toBe(
            "accessibilityId",
        );

        expect(
            getTextOperation.step
                .locator,
        ).toBe(
            "Result",
        );
    },
);

it(
    "prefers an observable downstream node over a generic locator node",
    () => {
        const branchContext = {
            selectedNodeId:
                null,

            nodes: [
                {
                    id:
                        "press-return",

                    action:
                        "pressReturn",

                    title:
                        "Press Return",

                    subtitle:
                        "Press Return key",
                },

                {
                    id:
                        "tap-node",

                    action:
                        "tap",

                    title:
                        "Tap",

                    subtitle:
                        "Tap element",

                    locatorStrategy:
                        "accessibilityId",

                    locator:
                        "Intermediate",
                },

                {
                    id:
                        "get-text",

                    action:
                        "getText",

                    title:
                        "Get Text",

                    subtitle:
                        "Read result",

                    locatorStrategy:
                        "accessibilityId",

                    locator:
                        "Result",
                },
            ],

            edges: [
                {
                    id:
                        "edge-1",

                    source:
                        "press-return",

                    target:
                        "tap-node",
                },

                {
                    id:
                        "edge-2",

                    source:
                        "tap-node",

                    target:
                        "get-text",
                },
            ],
        };

        const result =
            buildQAFixPlan(
                {
                    priority:
                        "low",

                    impact:
                        "low",

                    finding:
                        "Missing assertion",

                    nodeId:
                        "press-return",

                    suggestedFix: {
                        type:
                            "addValidation",

                        targetNodeId:
                            "press-return",
                    },
                },
                branchContext,
            );

        expect(
            result,
        ).not.toBeNull();

        expect(
            result.operations[0]
                .step
                .locator,
        ).toBe(
            "Result",
        );

        expect(
            result.operations[0]
                .step
                .locatorStrategy,
        ).toBe(
            "accessibilityId",
        );
    },
);

it(
    "returns null when equally strong validation targets exist on separate branches",
    () => {
        const branchContext = {
            selectedNodeId:
                null,

            nodes: [
                {
                    id:
                        "press-return",

                    action:
                        "pressReturn",

                    title:
                        "Press Return",

                    subtitle:
                        "Press Return key",
                },

                {
                    id:
                        "get-text-a",

                    action:
                        "getText",

                    title:
                        "Get Text A",

                    subtitle:
                        "Read result A",

                    locatorStrategy:
                        "accessibilityId",

                    locator:
                        "ResultA",
                },

                {
                    id:
                        "get-text-b",

                    action:
                        "getText",

                    title:
                        "Get Text B",

                    subtitle:
                        "Read result B",

                    locatorStrategy:
                        "accessibilityId",

                    locator:
                        "ResultB",
                },
            ],

            edges: [
                {
                    id:
                        "edge-a",

                    source:
                        "press-return",

                    target:
                        "get-text-a",
                },

                {
                    id:
                        "edge-b",

                    source:
                        "press-return",

                    target:
                        "get-text-b",
                },
            ],
        };

        const result =
            buildQAFixPlan(
                {
                    priority:
                        "low",

                    impact:
                        "low",

                    finding:
                        "Missing assertion",

                    nodeId:
                        "press-return",

                    suggestedFix: {
                        type:
                            "addValidation",

                        targetNodeId:
                            "press-return",
                    },
                },
                branchContext,
            );

        expect(
            result,
        ).toBeNull();
    },
);
    },
);