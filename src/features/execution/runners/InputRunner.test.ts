import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("../services/AppiumClient", () => ({
    appiumClient: {
        input: vi.fn(),
    },
}));

vi.mock("../variables/resolveVariable", () => ({
    resolveVariables: vi.fn(),
}));

import { appiumClient } from "../services/appium/AppiumClient";
import { resolveVariables } from "../variables/resolveVariable";
import { inputRunner } from "./InputRunner";

import type { FlowNode } from "../../flow/types/flowNode";
import type { ExecutionContext } from "../types/ExecutionContext";

const context: ExecutionContext = {
    device: "Android",
    edges: [],
};

const inputMock = vi.mocked(appiumClient.input);
const resolveVariablesMock = vi.mocked(resolveVariables);

function createInputNode(): FlowNode {
    return {
        id: "input-1",
        type: "default",
        position: {
            x: 0,
            y: 0,
        },
        data: {
            action: "input",
            title: "Input",
            subtitle: "",
            debug: {
                breakpoint: false,
            },
            locatorStrategy: "id",
            locator: "${usernameField}",
            text: "${username}",
        },
    } as FlowNode;
}

describe("InputRunner", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("calls appiumClient.input with resolved values", async () => {
        resolveVariablesMock
            .mockReturnValueOnce("login_username")
            .mockReturnValueOnce("naufal");

        await inputRunner.run(
            createInputNode(),
            context,
        );

        expect(resolveVariablesMock).toHaveBeenNthCalledWith(
            1,
            "${usernameField}",
        );

        expect(resolveVariablesMock).toHaveBeenNthCalledWith(
            2,
            "${username}",
        );

        expect(inputMock).toHaveBeenCalledTimes(1);

        expect(inputMock).toHaveBeenCalledWith(
            "id",
            "login_username",
            "naufal",
        );
    });

    it("returns immediately when action is not input", async () => {
        const node = createInputNode();

        node.data = {
            ...node.data,
            action: "tap",
        } as never;

        const result = await inputRunner.run(
            node,
            context,
        );

        expect(result).toBeUndefined();

        expect(resolveVariablesMock).not.toHaveBeenCalled();
        expect(inputMock).not.toHaveBeenCalled();
    });
});