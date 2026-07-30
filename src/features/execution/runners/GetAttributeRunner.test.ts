import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("../services/AppiumClient", () => ({
    appiumClient: {
        getAttribute: vi.fn(),
    },
}));

import { appiumClient } from "../services/appium/AppiumClient";
import { getAttributeRunner } from "./GetAttributeRunner";

import {
    clearVariables,
    getVariable,
} from "../variables/VariableStore";

import type { FlowNode } from "../../flow/types/flowNode";
import type { ExecutionContext } from "../types/ExecutionContext";
import type { GetAttributeNodeData } from "../../flow/types/flowNode";

const context: ExecutionContext = {
    device: "Android",
    edges: [],
};

const getAttributeMock = vi.mocked(
    appiumClient.getAttribute,
);

function createGetAttributeNode(): FlowNode {
    return {
        id: "get-attribute-1",
        type: "default",
        position: {
            x: 0,
            y: 0,
        },
        data: {
            action: "getAttribute",
            title: "Get Attribute",
            subtitle: "",
            debug: {
                breakpoint: false,
            },
            locatorStrategy: "id",
            locator: "login_button",
            attribute: "content-desc",
            variableName: "buttonLabel",
        },
    } as FlowNode;
}

describe("GetAttributeRunner", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        clearVariables();
    });

    it("calls appiumClient.getAttribute", async () => {
        getAttributeMock.mockResolvedValue("Login");

        const result = await getAttributeRunner.run(
            createGetAttributeNode(),
            context,
        );

        expect(getAttributeMock).toHaveBeenCalledTimes(1);

        expect(getAttributeMock).toHaveBeenCalledWith(
            "id",
            "login_button",
            "content-desc",
        );

        expect(result).toEqual({
            outputs: ["next"],
        });
    });

    it("stores result into VariableStore", async () => {
        getAttributeMock.mockResolvedValue("Login");

        await getAttributeRunner.run(
            createGetAttributeNode(),
            context,
        );

        expect(
            getVariable("buttonLabel"),
        ).toBe("Login");
    });

    it("returns immediately when action is not getAttribute", async () => {
        const node = createGetAttributeNode();

        node.data = {
            ...node.data,
            action: "tap",
        } as never;

        const result = await getAttributeRunner.run(
            node,
            context,
        );

        expect(result).toBeUndefined();

        expect(getAttributeMock).not.toHaveBeenCalled();
    });

    it("does not store variable when variableName is empty", async () => {
        getAttributeMock.mockResolvedValue("Login");

        const node = createGetAttributeNode();

        (node.data as GetAttributeNodeData).variableName = "";

        await getAttributeRunner.run(
            node,
            context,
        );

        expect(
            getVariable("buttonLabel"),
        ).toBeUndefined();
    });
});