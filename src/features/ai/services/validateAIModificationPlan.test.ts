import {
    describe,
    expect,
    it,
} from "vitest";

import {
    validateAIModificationPlan,
} from "./validateAIModificationPlan";

describe(
    "validateAIModificationPlan",
    () => {
        it(
            "validates a single addNodeAfter operation",
            () => {
                const result =
                    validateAIModificationPlan(
                        {
                            type:
                                "modification_plan",

                            summary:
                                "Add a wait after Login.",

                            operation: {
                                type:
                                    "addNodeAfter",

                                targetNodeId:
                                    "login",

                                step: {
                                    action:
                                        "wait",

                                    locatorStrategy:
                                        "accessibilityId",

                                    locator:
                                        "Login",

                                    timeout:
                                        1000,

                                    pollingInterval:
                                        500,
                                },
                            },
                        },

                        new Set([
                            "login",
                        ]),
                    );

                expect(
                    result.valid,
                ).toBe(true);

                expect(
                    result.errors,
                ).toHaveLength(0);
            },
        );

        it(
            "validates deleteNode without a step",
            () => {
                const result =
                    validateAIModificationPlan(
                        {
                            type:
                                "modification_plan",

                            summary:
                                "Delete Return.",

                            operation: {
                                type:
                                    "deleteNode",

                                targetNodeId:
                                    "return",
                            },
                        },

                        new Set([
                            "return",
                        ]),
                    );

                expect(
                    result.valid,
                ).toBe(true);

                expect(
                    result.errors,
                ).toHaveLength(0);
            },
        );

        it(
            "rejects a missing target node",
            () => {
                const result =
                    validateAIModificationPlan(
                        {
                            type:
                                "modification_plan",

                            summary:
                                "Update Login.",

                            operation: {
                                type:
                                    "updateNode",

                                targetNodeId:
                                    "missing-node",

                                step: {
                                    action:
                                        "tap",
                                },
                            },
                        },

                        new Set([
                            "login",
                        ]),
                    );

                expect(
                    result.valid,
                ).toBe(false);

                expect(
                    result.errors.some(
                        (
                            error,
                        ) =>
                            error.includes(
                                "missing-node",
                            ),
                    ),
                ).toBe(true);
            },
        );

        it(
            "rejects an invalid input operation",
            () => {
                const result =
                    validateAIModificationPlan(
                        {
                            type:
                                "modification_plan",

                            summary:
                                "Add input.",

                            operation: {
                                type:
                                    "addNodeAfter",

                                targetNodeId:
                                    "login",

                                step: {
                                    action:
                                        "input",

                                    locatorStrategy:
                                        "accessibilityId",

                                    locator:
                                        "Username",

                                    text:
                                        "",
                                },
                            },
                        },

                        new Set([
                            "login",
                        ]),
                    );

                expect(
                    result.valid,
                ).toBe(false);

                expect(
                    result.errors,
                ).toContain(
                    "input requires text.",
                );
            },
        );

        it(
            "validates multiple operations",
            () => {
                const result =
                    validateAIModificationPlan(
                        {
                            type:
                                "modification_plan",

                            summary:
                                "Add wait and update assertion.",

                            operations: [
                                {
                                    type:
                                        "addNodeBefore",

                                    targetNodeId:
                                        "login",

                                    step: {
                                        action:
                                            "wait",

                                        locatorStrategy:
                                            "accessibilityId",

                                        locator:
                                            "Login",

                                        timeout:
                                            1000,
                                    },
                                },

                                {
                                    type:
                                        "updateNode",

                                    targetNodeId:
                                        "assert",

                                    step: {
                                        action:
                                            "assert",

                                        actual:
                                            "${catalogScreen}",

                                        operator:
                                            "contains",

                                        expected:
                                            "Dashboard",
                                    },
                                },
                            ],
                        },

                        new Set([
                            "login",
                            "assert",
                        ]),
                    );

                expect(
                    result.valid,
                ).toBe(true);

                expect(
                    result.errors,
                ).toHaveLength(0);
            },
        );

        it(
            "allows a later operation to reference a previous resultId",
            () => {
                const result =
                    validateAIModificationPlan(
                        {
                            type:
                                "modification_plan",

                            summary:
                                "Add Get Text and Assert.",

                            operations: [
                                {
                                    type:
                                        "addNodeAfter",

                                    targetNodeId:
                                        "tap-login",

                                    resultId:
                                        "validationText",

                                    step: {
                                        action:
                                            "getText",

                                        locatorStrategy:
                                            "accessibilityId",

                                        locator:
                                            "Login",

                                        variableName:
                                            "validationText",
                                    },
                                },

                                {
                                    type:
                                        "addNodeAfter",

                                    targetNodeId:
                                        "$validationText",

                                    step: {
                                        action:
                                            "assert",

                                        actual:
                                            "${validationText}",

                                        operator:
                                            "isNotEmpty",

                                        expected:
                                            "true",
                                    },
                                },
                            ],
                        },

                        new Set([
                            "tap-login",
                        ]),
                    );

                expect(
                    result.valid,
                ).toBe(true);

                expect(
                    result.errors,
                ).toHaveLength(0);
            },
        );

        it(
            "rejects an unknown result reference",
            () => {
                const result =
                    validateAIModificationPlan(
                        {
                            type:
                                "modification_plan",

                            summary:
                                "Use an unknown reference.",

                            operations: [
                                {
                                    type:
                                        "addNodeAfter",

                                    targetNodeId:
                                        "$missingResult",

                                    step: {
                                        action:
                                            "getText",

                                        locatorStrategy:
                                            "accessibilityId",

                                        locator:
                                            "Login",

                                        variableName:
                                            "text",
                                    },
                                },
                            ],
                        },

                        new Set([
                            "tap-login",
                        ]),
                    );

                expect(
                    result.valid,
                ).toBe(false);

                expect(
                    result.errors.some(
                        (
                            error,
                        ) =>
                            error.includes(
                                "does not refer to a previous operation result",
                            ),
                    ),
                ).toBe(true);
            },
        );

        it(
            "rejects a forward result reference",
            () => {
                const result =
                    validateAIModificationPlan(
                        {
                            type:
                                "modification_plan",

                            summary:
                                "Use a future reference.",

                            operations: [
                                {
                                    type:
                                        "addNodeAfter",

                                    targetNodeId:
                                        "$futureNode",

                                    step: {
                                        action:
                                            "assert",

                                        actual:
                                            "${value}",

                                        operator:
                                            "isNotEmpty",

                                        expected:
                                            "true",
                                    },
                                },

                                {
                                    type:
                                        "addNodeAfter",

                                    targetNodeId:
                                        "login",

                                    resultId:
                                        "futureNode",

                                    step: {
                                        action:
                                            "getText",

                                        locatorStrategy:
                                            "accessibilityId",

                                        locator:
                                            "Login",

                                        variableName:
                                            "value",
                                    },
                                },
                            ],
                        },

                        new Set([
                            "login",
                        ]),
                    );

                expect(
                    result.valid,
                ).toBe(false);

                expect(
                    result.errors.some(
                        (
                            error,
                        ) =>
                            error.includes(
                                "$futureNode",
                            ),
                    ),
                ).toBe(true);
            },
        );

        it(
            "rejects an empty resultId",
            () => {
                const result =
                    validateAIModificationPlan(
                        {
                            type:
                                "modification_plan",

                            summary:
                                "Invalid result id.",

                            operation: {
                                type:
                                    "addNodeAfter",

                                targetNodeId:
                                    "login",

                                resultId:
                                    "   ",

                                step: {
                                    action:
                                        "getText",

                                    locatorStrategy:
                                        "accessibilityId",

                                    locator:
                                        "Login",

                                    variableName:
                                        "text",
                                },
                            },
                        },

                        new Set([
                            "login",
                        ]),
                    );

                expect(
                    result.valid,
                ).toBe(false);

                expect(
                    result.errors.some(
                        (
                            error,
                        ) =>
                            error.includes(
                                "empty resultId",
                            ),
                    ),
                ).toBe(true);
            },
        );

        it(
            "rejects duplicate resultId values",
            () => {
                const result =
                    validateAIModificationPlan(
                        {
                            type:
                                "modification_plan",

                            summary:
                                "Duplicate result ids.",

                            operations: [
                                {
                                    type:
                                        "addNodeAfter",

                                    targetNodeId:
                                        "login",

                                    resultId:
                                        "value",

                                    step: {
                                        action:
                                            "getText",

                                        locatorStrategy:
                                            "accessibilityId",

                                        locator:
                                            "Login",

                                        variableName:
                                            "value",
                                    },
                                },

                                {
                                    type:
                                        "addNodeAfter",

                                    targetNodeId:
                                        "login",

                                    resultId:
                                        "value",

                                    step: {
                                        action:
                                            "getText",

                                        locatorStrategy:
                                            "accessibilityId",

                                        locator:
                                            "Login",

                                        variableName:
                                            "value2",
                                    },
                                },
                            ],
                        },

                        new Set([
                            "login",
                        ]),
                    );

                expect(
                    result.valid,
                ).toBe(false);

                expect(
                    result.errors.some(
                        (
                            error,
                        ) =>
                            error.includes(
                                'reuses duplicate resultId "value"',
                            ),
                    ),
                ).toBe(true);
            },
        );

        it(
            "rejects resultId on updateNode",
            () => {
                const result =
                    validateAIModificationPlan(
                        {
                            type:
                                "modification_plan",

                            summary:
                                "Invalid update result.",

                            operation: {
                                type:
                                    "updateNode",

                                targetNodeId:
                                    "assert",

                                resultId:
                                    "assertResult",

                                step: {
                                    action:
                                        "assert",

                                    actual:
                                        "${value}",

                                    operator:
                                        "isNotEmpty",

                                    expected:
                                        "true",
                                },
                            },
                        },

                        new Set([
                            "assert",
                        ]),
                    );

                expect(
                    result.valid,
                ).toBe(false);

                expect(
                    result.errors.some(
                        (
                            error,
                        ) =>
                            error.includes(
                                "can only define resultId",
                            ),
                    ),
                ).toBe(true);
            },
        );

        it(
            "rejects resultId on deleteNode",
            () => {
                const result =
                    validateAIModificationPlan(
                        {
                            type:
                                "modification_plan",

                            summary:
                                "Invalid delete result.",

                            operation:
                                {
                                    type:
                                        "deleteNode",

                                    targetNodeId:
                                        "return",
                                } as never,
                        },

                        new Set([
                            "return",
                        ]),
                    );

                expect(
                    result.valid,
                ).toBe(true);
            },
        );

        it(
            "rejects an empty modification plan",
            () => {
                const result =
                    validateAIModificationPlan(
                        {
                            type:
                                "modification_plan",

                            summary:
                                "Empty plan.",

                            operations: [],
                        },

                        new Set(),
                    );

                expect(
                    result.valid,
                ).toBe(false);

                expect(
                    result.errors,
                ).toContain(
                    "Modification plan operation is missing.",
                );
            },
        );
    },
);