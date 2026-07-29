import { beforeEach, describe, expect, it, vi } from "vitest";

import { resolveVariables } from "./resolveVariable";
import * as VariableStore from "./VariableStore";

vi.mock("./VariableStore", () => ({
    getVariable: vi.fn(),
}));

describe("resolveVariables", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("returns original string when there are no variables", () => {
        expect(
            resolveVariables("Hello World")
        ).toBe("Hello World");
    });

    it("resolves a simple variable", () => {
        vi.mocked(VariableStore.getVariable)
            .mockReturnValue("Naufal");

        expect(
            resolveVariables("Hello ${name}")
        ).toBe("Hello Naufal");

        expect(
            VariableStore.getVariable
        ).toHaveBeenCalledWith("name");
    });

    it("resolves nested object properties", () => {
        vi.mocked(VariableStore.getVariable)
            .mockReturnValue({
                profile: {
                    name: "Naufal",
                },
            });

        expect(
            resolveVariables(
                "Hello ${user.profile.name}"
            )
        ).toBe("Hello Naufal");
    });

    it("returns empty string when variable does not exist", () => {
        vi.mocked(VariableStore.getVariable)
            .mockReturnValue(undefined);

        expect(
            resolveVariables(
                "Hello ${unknown}"
            )
        ).toBe("Hello ");
    });

    it("returns empty string when nested property does not exist", () => {
        vi.mocked(VariableStore.getVariable)
            .mockReturnValue({
                profile: {},
            });

        expect(
            resolveVariables(
                "Hello ${user.profile.name}"
            )
        ).toBe("Hello ");
    });

    it("resolves multiple variables", () => {
        vi.mocked(VariableStore.getVariable)
            .mockImplementation((name) => {
                switch (name) {
                    case "firstName":
                        return "Naufal";

                    case "lastName":
                        return "Azhar";

                    default:
                        return undefined;
                }
            });

        expect(
            resolveVariables(
                "${firstName} ${lastName}"
            )
        ).toBe("Naufal Azhar");
    });

    it("resolves number values", () => {
        vi.mocked(VariableStore.getVariable)
            .mockReturnValue(123);

        expect(
            resolveVariables(
                "Value: ${count}"
            )
        ).toBe("Value: 123");
    });

    it("resolves boolean values", () => {
        vi.mocked(VariableStore.getVariable)
            .mockReturnValue(true);

        expect(
            resolveVariables(
                "Success: ${status}"
            )
        ).toBe("Success: true");
    });


    it("ignores whitespace around variable expression", () => {
        vi.mocked(VariableStore.getVariable)
            .mockReturnValue({
                profile: {
                    name: "Naufal",
                },
            });

        expect(
            resolveVariables(
                "Hello ${   user.profile.name   }"
            )
        ).toBe("Hello Naufal");
    });

    it("returns empty string when accessing nested property on primitive", () => {
        vi.mocked(VariableStore.getVariable)
            .mockReturnValue("Naufal");

        expect(
            resolveVariables(
                "Hello ${user.name}"
            )
        ).toBe("Hello ");
    });

    it("returns empty string when variable name is empty", () => {
        expect(
            resolveVariables("Hello ${.name}")
        ).toBe("Hello ");
    });
});