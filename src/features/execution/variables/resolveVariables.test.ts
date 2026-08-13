import {
    beforeEach,
    describe,
    expect,
    it,
    vi,
} from "vitest";

import { resolveVariables } from "./resolveVariable";
import * as VariableStore from "./VariableStore";
import { executionLogger } from "../services/executionLogger";

vi.mock("./VariableStore", () => ({
    getVariable: vi.fn(),
}));

vi.mock("../services/executionLogger", () => ({
    executionLogger: {
        warning: vi.fn(),
    },
}));

describe("resolveVariables", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("returns original string when there are no variables", () => {
        expect(
            resolveVariables("Hello World"),
        ).toBe("Hello World");
    });

    it("resolves a simple variable", () => {
        vi.mocked(
            VariableStore.getVariable,
        ).mockReturnValue("Naufal");

        expect(
            resolveVariables("Hello ${name}"),
        ).toBe("Hello Naufal");

        expect(
            VariableStore.getVariable,
        ).toHaveBeenCalledWith("name");
    });

    it("resolves nested object properties", () => {
        vi.mocked(
            VariableStore.getVariable,
        ).mockReturnValue({
            profile: {
                name: "Naufal",
            },
        });

        expect(
            resolveVariables(
                "Hello ${user.profile.name}",
            ),
        ).toBe("Hello Naufal");
    });

    it("keeps unresolved variables", () => {
        vi.mocked(
            VariableStore.getVariable,
        ).mockReturnValue(undefined);

        expect(
            resolveVariables(
                "Hello ${unknown}",
            ),
        ).toBe("Hello ${unknown}");

        expect(
            executionLogger.warning,
        ).toHaveBeenCalledWith({
            message:
                'Variable "unknown" not found',
        });
    });

    it("keeps unresolved nested properties", () => {
        vi.mocked(
            VariableStore.getVariable,
        ).mockReturnValue({
            profile: {},
        });

        expect(
            resolveVariables(
                "Hello ${user.profile.name}",
            ),
        ).toBe(
            "Hello ${user.profile.name}",
        );

        expect(
            executionLogger.warning,
        ).toHaveBeenCalledWith({
            message:
                'Property "user.profile.name" not found',
        });
    });

    it("resolves multiple variables", () => {
        vi.mocked(
            VariableStore.getVariable,
        ).mockImplementation((name) => {
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
                "${firstName} ${lastName}",
            ),
        ).toBe("Naufal Azhar");
    });

    it("resolves number values", () => {
        vi.mocked(
            VariableStore.getVariable,
        ).mockReturnValue(123);

        expect(
            resolveVariables(
                "Value: ${count}",
            ),
        ).toBe("Value: 123");
    });

    it("resolves boolean values", () => {
        vi.mocked(
            VariableStore.getVariable,
        ).mockReturnValue(true);

        expect(
            resolveVariables(
                "Success: ${status}",
            ),
        ).toBe("Success: true");
    });

    it("ignores whitespace around variable expression", () => {
        vi.mocked(
            VariableStore.getVariable,
        ).mockReturnValue({
            profile: {
                name: "Naufal",
            },
        });

        expect(
            resolveVariables(
                "Hello ${   user.profile.name   }",
            ),
        ).toBe("Hello Naufal");
    });

    it("keeps placeholder when accessing nested property on primitive", () => {
        vi.mocked(
            VariableStore.getVariable,
        ).mockReturnValue("Naufal");

        expect(
            resolveVariables(
                "Hello ${user.name}",
            ),
        ).toBe("Hello ${user.name}");

        expect(
            executionLogger.warning,
        ).toHaveBeenCalledWith({
            message:
                'Property "user.name" not found',
        });
    });

    it("returns empty string when variable name is empty", () => {
        expect(
            resolveVariables("Hello ${.name}"),
        ).toBe("Hello ");
    });

    it("resolves known variables while keeping unknown ones", () => {
        vi.mocked(
            VariableStore.getVariable,
        ).mockImplementation((name) => {
            if (name === "name") {
                return "Naufal";
            }

            return undefined;
        });

        expect(
            resolveVariables(
                "Hello ${name} (${username})",
            ),
        ).toBe(
            "Hello Naufal (${username})",
        );

        expect(
            executionLogger.warning,
        ).toHaveBeenCalledWith({
            message:
                'Variable "username" not found',
        });
    });
});