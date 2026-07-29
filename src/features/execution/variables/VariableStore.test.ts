import { beforeEach, describe, expect, it } from "vitest";

import {
    clearVariables,
    getAllVariables,
    getVariable,
    getVariableInfo,
    removeVariable,
    setVariable,
} from "./VariableStore";

describe("VariableStore", () => {
    beforeEach(() => {
        clearVariables();
    });

    it("stores and retrieves string variables", () => {
        setVariable("username", "admin");

        expect(
            getVariable("username")
        ).toBe("admin");
    });

    it("stores and retrieves number variables", () => {
        setVariable("count", 10);

        expect(
            getVariable("count")
        ).toBe(10);
    });

    it("stores runtime metadata", () => {
        setVariable("status", "success");

        const variable =
            getVariableInfo("status");

        expect(variable).toBeDefined();
        expect(variable?.type).toBe("string");
        expect(variable?.name).toBe("status");
    });

    it("removes variables", () => {
        setVariable("token", "123");

        removeVariable("token");

        expect(
            getVariable("token")
        ).toBeUndefined();
    });

    it("clears all variables", () => {
        setVariable("a", 1);
        setVariable("b", 2);

        clearVariables();

        expect(
            getAllVariables()
        ).toHaveLength(0);
    });

    it("stores boolean variables", () => {
        setVariable("enabled", true);

        expect(
            getVariableInfo("enabled")?.type
        ).toBe("boolean");
    });

    it("stores array variables", () => {
        setVariable("items", [1, 2, 3]);

        expect(
            getVariableInfo("items")?.type
        ).toBe("array");
    });

    it("stores object variables", () => {
        setVariable("user", {
            id: 1,
            name: "Naufal",
        });

        expect(
            getVariableInfo("user")?.type
        ).toBe("object");
    });

    it("stores null variables", () => {
        setVariable("value", null);

        expect(
            getVariableInfo("value")?.type
        ).toBe("null");
    });

    it("returns undefined for unknown variable", () => {
        expect(
            getVariable("unknown")
        ).toBeUndefined();

        expect(
            getVariableInfo("unknown")
        ).toBeUndefined();
    });

    it("detects bigint using default branch", () => {
        setVariable("id", 123n);

        expect(
            getVariableInfo("id")?.type
        ).toBe("string");
    });
});