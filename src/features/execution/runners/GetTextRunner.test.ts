import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("../services/AppiumClient", () => ({
    appiumClient: {
        getText: vi.fn(),
    },
}));

import { appiumClient } from "../services/AppiumClient";
import { getTextRunner } from "./GetTextRunner";

import type { ExecutionContext } from "../types/ExecutionContext";
import {
    clearVariables,
    getVariable,
} from "../variables/VariableStore";
import type {
    FlowNode,
    GetTextNodeData,
} from "../../flow/types/flowNode";

const context: ExecutionContext = {
    device: "Android",
    edges: [],
};

const getTextMock = vi.mocked(appiumClient.getText);

function createGetTextNode(): FlowNode {
    return {
        id: "get-text-1",
        type: "default",
        position: {
            x: 0,
            y: 0,
        },
        data: {
            action: "getText",
            title: "Get Text",
            subtitle: "",
            debug: {
                breakpoint: false,
            },
            locatorStrategy: "id",
            locator: "welcome_text",
            variableName: "welcomeMessage",
        },
    } as FlowNode;
}

describe("GetTextRunner", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        clearVariables();
    });

    it("calls appiumClient.getText", async () => {
        getTextMock.mockResolvedValue("Welcome");

        const result = await getTextRunner.run(
            createGetTextNode(),
            context,
        );

        expect(getTextMock).toHaveBeenCalledTimes(1);

        expect(getTextMock).toHaveBeenCalledWith(
            "id",
            "welcome_text",
        );
        expect(result).toEqual({
            outputs: ["next"],
        });
    });


    it("returns immediately when action is not getText", async () => {
        const node = createGetTextNode();

        node.data = {
            ...node.data,
            action: "tap",
        } as never;

        const result = await getTextRunner.run(
            node,
            context,
        );

        expect(result).toBeUndefined();
        expect(getTextMock).not.toHaveBeenCalled();
    });

    it("stores text into VariableStore", async () => {
        getTextMock.mockResolvedValue("Welcome");

        await getTextRunner.run(
            createGetTextNode(),
            context
        );

        expect(
            getVariable("welcomeMessage")
        ).toBe("Welcome");
    });
    it("does not store variable when variableName is empty", async () => {
        getTextMock.mockResolvedValue("Welcome");

        const node = createGetTextNode();

        (node.data as GetTextNodeData).variableName = "";

        await getTextRunner.run(
            node,
            context,
        );

        expect(
            getVariable("welcomeMessage"),
        ).toBeUndefined();
    });

    it("does not store variable when variableName is empty", async () => {
        getTextMock.mockResolvedValue("Welcome");

        const node = createGetTextNode();

        (node.data as GetTextNodeData).variableName = "";

        await getTextRunner.run(
            node,
            context,
        );

        expect(
            getVariable("welcomeMessage"),
        ).toBeUndefined();
    });
});