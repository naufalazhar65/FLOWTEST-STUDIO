import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("../variables/VariableStore", () => ({
    setVariable: vi.fn(),
}));

vi.mock("../variables/resolveVariable", () => ({
    resolveVariables: vi.fn(),
}));

import { setVariable } from "../variables/VariableStore";
import { resolveVariables } from "../variables/resolveVariable";
import { setVariableRunner } from "./SetVariableRunner";

import type { FlowNode } from "../../flow/types/flowNode";
import type { ExecutionContext } from "../types/ExecutionContext";

const context: ExecutionContext = {
    device: "Android",
    edges: [],
};

const setVariableMock = vi.mocked(setVariable);
const resolveVariablesMock = vi.mocked(resolveVariables);

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
    });

    it("stores resolved variable value", async () => {
        resolveVariablesMock.mockReturnValue("Naufal");

        await setVariableRunner.run(
            createSetVariableNode(),
            context,
        );

        expect(resolveVariablesMock).toHaveBeenCalledWith(
            "${user.name}",
        );

        expect(setVariableMock).toHaveBeenCalledTimes(1);

        expect(setVariableMock).toHaveBeenCalledWith(
            "username",
            "Naufal",
        );
    });

    it("returns immediately when action is not setVariable", async () => {
        const node = createSetVariableNode();

        node.data = {
            ...node.data,
            action: "tap",
        } as never;

        const result = await setVariableRunner.run(
            node,
            context,
        );

        expect(result).toBeUndefined();

        expect(resolveVariablesMock).not.toHaveBeenCalled();
        expect(setVariableMock).not.toHaveBeenCalled();
    });
});