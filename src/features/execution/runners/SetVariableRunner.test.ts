import {
    beforeEach,
    describe,
    expect,
    it,
    vi,
} from "vitest";

vi.mock("../variables/VariableStore", () => ({
    setVariable: vi.fn(),
}));

vi.mock("../variables/resolveVariable", () => ({
    resolveVariables: vi.fn(),
}));

vi.mock("../services/executionLogger", () => ({
    executionLogger: {
        success: vi.fn(),
        error: vi.fn(),
    },
}));

import { executionLogger } from "../services/executionLogger";
import { setVariable } from "../variables/VariableStore";
import { resolveVariables } from "../variables/resolveVariable";
import { setVariableRunner } from "./SetVariableRunner";

import type { FlowNode } from "../../flow/types/flowNode";
import type { ExecutionContext } from "../types/ExecutionContext";

const context: ExecutionContext = {
    edges: [],
};

const setVariableMock = vi.mocked(setVariable);

const resolveVariablesMock = vi.mocked(
    resolveVariables,
);

const successMock = vi.mocked(
    executionLogger.success,
);

const errorMock = vi.mocked(
    executionLogger.error,
);

function createSetVariableNode(): FlowNode {
    return {
        id: "set-variable-1",

        type: "default",

        position: {
            x: 0,
            y: 0,
        },

        data: {
            action: "setVariable",

            title: "Set Variable",

            subtitle: "",

            debug: {
                breakpoint: false,
            },

            variableName: "username",

            value: "${user.name}",
        },
    } as FlowNode;
}

describe("SetVariableRunner", () => {
    beforeEach(() => {
        vi.clearAllMocks();

        resolveVariablesMock.mockReturnValue(
            "Naufal",
        );
    });

    it("stores resolved variable value", async () => {
        const result =
            await setVariableRunner.run(
                createSetVariableNode(),
                context,
            );

        expect(resolveVariablesMock)
            .toHaveBeenCalledWith(
                "${user.name}",
            );

        expect(setVariableMock)
            .toHaveBeenCalledTimes(1);

        expect(setVariableMock)
            .toHaveBeenCalledWith(
                "username",
                "Naufal",
            );

        expect(successMock)
            .toHaveBeenCalledTimes(1);

        expect(result).toEqual({
            outputs: ["next"],
        });
    });

    it("returns immediately when action is not setVariable", async () => {
        const node =
            createSetVariableNode();

        node.data = {
            ...node.data,
            action: "tap",
        } as never;

        const result =
            await setVariableRunner.run(
                node,
                context,
            );

        expect(result)
            .toBeUndefined();

        expect(resolveVariablesMock)
            .not.toHaveBeenCalled();

        expect(setVariableMock)
            .not.toHaveBeenCalled();

        expect(successMock)
            .not.toHaveBeenCalled();

        expect(errorMock)
            .not.toHaveBeenCalled();
    });

    it("throws when setVariable throws Error", async () => {
        setVariableMock.mockImplementationOnce(
            () => {
                throw new Error(
                    "Variable failed",
                );
            },
        );

        await expect(
            setVariableRunner.run(
                createSetVariableNode(),
                context,
            ),
        ).rejects.toThrow(
            "Variable failed",
        );

        expect(errorMock)
            .toHaveBeenCalledTimes(1);
    });

    it("throws when setVariable throws non-Error", async () => {
        setVariableMock.mockImplementationOnce(
            () => {
                throw "Unknown error";
            },
        );

        await expect(
            setVariableRunner.run(
                createSetVariableNode(),
                context,
            ),
        ).rejects.toBe(
            "Unknown error",
        );

        expect(errorMock)
            .toHaveBeenCalledTimes(1);
    });
});