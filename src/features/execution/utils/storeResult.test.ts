import { beforeEach, describe, expect, it, vi } from "vitest";

import { storeResult } from "./storeResult";
import {
    clearVariables,
    getVariable,
} from "../variables/VariableStore";

describe("storeResult", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        clearVariables();
    });

    it("stores the value into VariableStore", () => {
        const result = storeResult(
            "username",
            "admin",
        );

        expect(result).toBe("admin");

        expect(
            getVariable("username"),
        ).toBe("admin");
    });

    it("returns the original value", () => {
        const value = {
            id: 1,
            name: "Naufal",
        };

        const result = storeResult(
            "user",
            value,
        );

        expect(result).toBe(value);
    });

    it("does not store the value when variableName is empty", () => {
        storeResult("", "admin");

        expect(
            getVariable(""),
        ).toBeUndefined();
    });
});