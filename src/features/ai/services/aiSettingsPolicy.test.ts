import {
    describe,
    expect,
    it,
} from "vitest";

import {
    ALL_AI_OPERATIONS,
    DEFAULT_AI_ASSISTANT_SETTINGS,
    isOperationAllowed,
    resolveAISettings,
} from "./aiSettingsPolicy";

describe("aiSettingsPolicy", () => {
    describe("DEFAULT_AI_ASSISTANT_SETTINGS", () => {
        it("defaults to requiring healing approval", () => {
            expect(
                DEFAULT_AI_ASSISTANT_SETTINGS.requireHealingApproval,
            ).toBe(true);
        });

        it("defaults to allowing all operations", () => {
            expect(
                DEFAULT_AI_ASSISTANT_SETTINGS.allowedOperations,
            ).toEqual(
                ALL_AI_OPERATIONS,
            );
        });
    });

    describe("resolveAISettings", () => {
        it("returns defaults when nothing is provided", () => {
            expect(
                resolveAISettings(),
            ).toEqual(
                DEFAULT_AI_ASSISTANT_SETTINGS,
            );
        });

        it("preserves a provided requireHealingApproval", () => {
            expect(
                resolveAISettings({
                    requireHealingApproval: false,
                }).requireHealingApproval,
            ).toBe(false);
        });

        it("filters out unknown operations", () => {
            const resolved =
                resolveAISettings({
                    requireHealingApproval: false,
                    allowedOperations: [
                        "interaction",
                        "notARealOperation" as never,
                    ],
                });

            expect(
                resolved.allowedOperations,
            ).toEqual([
                "interaction",
            ]);
        });

        it("keeps an explicit empty array (all operations disallowed)", () => {
            const resolved =
                resolveAISettings({
                    allowedOperations: [],
                });

            expect(
                resolved.allowedOperations,
            ).toEqual([]);

            expect(
                isOperationAllowed(
                    "interaction",
                    [],
                ),
            ).toBe(false);
        });
    });

    describe("isOperationAllowed", () => {
        it("allows everything by default", () => {
            expect(
                isOperationAllowed(
                    "locatorRepair",
                ),
            ).toBe(true);

            expect(
                isOperationAllowed(
                    "addWait",
                ),
            ).toBe(true);
        });

        it("blocks a specific operation when it is excluded", () => {
            expect(
                isOperationAllowed(
                    "addWait",
                    [
                        "interaction",
                        "assertion",
                        "locatorRepair",
                        "flowGeneration",
                    ],
                ),
            ).toBe(false);
        });

        it("treats flowGeneration as a global prerequisite gate", () => {
            expect(
                isOperationAllowed(
                    "interaction",
                    [
                        "interaction",
                    ],
                ),
            ).toBe(false);

            expect(
                isOperationAllowed(
                    "flowGeneration",
                    [
                        "interaction",
                    ],
                ),
            ).toBe(false);

            expect(
                isOperationAllowed(
                    "flowGeneration",
                    [
                        "interaction",
                        "flowGeneration",
                    ],
                ),
            ).toBe(true);
        });
    });
});
