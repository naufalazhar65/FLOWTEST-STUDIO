import { beforeEach, describe, expect, it } from "vitest";

import {
    clearVariables,
    setVariable,
} from "./VariableStore";

import { evaluateExpression } from "./evaluateExpression";

describe("evaluateExpression", () => {
    beforeEach(() => {
        clearVariables();
    });

    it("evaluates literal expressions", () => {
        expect(
            evaluateExpression("1 + 1 === 2")
        ).toBe(true);
    });

    it("evaluates string variables", () => {
        setVariable("status", "success");

        expect(
            evaluateExpression(
                '${status} === "success"'
            )
        ).toBe(true);
    });

    it("evaluates numeric variables", () => {
        setVariable("count", 5);

        expect(
            evaluateExpression(
                "${count} > 3"
            )
        ).toBe(true);
    });

    it("evaluates nested object properties", () => {
        setVariable("user", {
            profile: {
                age: 20,
            },
        });

        expect(
            evaluateExpression(
                "${user.profile.age} >= 18"
            )
        ).toBe(true);
    });

    it("returns false for invalid expressions", () => {
        expect(
            evaluateExpression(
                "${status} = 'success'"
            )
        ).toBe(false);
    });

    it("returns false when variable placeholder is empty", () => {
        expect(
            evaluateExpression("${} === 1")
        ).toBe(false);
    });

    it("returns false when accessing nested property on primitive value", () => {
        setVariable("status", "success");

        expect(
            evaluateExpression(
                '${status.value} === "success"'
            )
        ).toBe(false);
    });

    it("returns false for missing variables", () => {
        expect(
            evaluateExpression(
                "${unknown} === 1"
            )
        ).toBe(false);
    });
});