import {
    describe,
    expect,
    it,
} from "vitest";

import {
    validateModificationPlan,
} from "./validateModificationPlan";

describe(
    "validateModificationPlan",
    () => {
        it(
            "exposes the generic modification plan validator",
            () => {
                expect(
                    validateModificationPlan,
                ).toBeTypeOf(
                    "function",
                );
            },
        );

        it(
    "validates a valid updateNode plan",
    () => {
        const result =
            validateModificationPlan(
                {
                    type:
                        "modification_plan",

                    summary:
                        "Update locator",

                    operation: {
                        type:
                            "updateNode",

                        targetNodeId:
                            "login-1",

                        step: {
                            action:
                                "tap",

                            locatorStrategy:
                                "accessibilityId",

                            locator:
                                "Login",
                        },
                    },
                },
                new Set([
                    "login-1",
                ]),
            );

        expect(
            result.valid,
        ).toBe(
            true,
        );

        expect(
            result.errors,
        ).toEqual([]);
    },
);
    },
);