import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("../services/AppiumClient", () => ({
    appiumClient: {
        elementExists: vi.fn(),
    },
}));

import { appiumClient } from "../services/appium/AppiumClient";
import { elementExistsRunner } from "./ElementExistsRunner";

import {
    clearVariables,
    getVariable,
} from "../variables/VariableStore";

import type {
    FlowNode,
    ElementExistsNodeData,
} from "../../flow/types/flowNode";
import type { ExecutionContext } from "../types/ExecutionContext";

const context: ExecutionContext = {
    device: "Android",
    edges: [],
};

const elementExistsMock = vi.mocked(
    appiumClient.elementExists
);

function createElementExistsNode(): FlowNode {
    return {
        id: "element-exists-1",
        type: "default",
        position: {
            x: 0,
            y: 0,
        },
        data: {
            action: "elementExists",
            title: "Element Exists",
            subtitle: "",
            debug: {
                breakpoint: false,
            },
            locatorStrategy: "id",
            locator: "login_button",
            variableName: "loginVisible",
        },
    } as FlowNode;
}

describe("ElementExistsRunner", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        clearVariables();
    });

    it("calls appiumClient.elementExists", async () => {
        elementExistsMock.mockResolvedValue(true);

        const result =
            await elementExistsRunner.run(
                createElementExistsNode(),
                context
            );

        expect(
            elementExistsMock
        ).toHaveBeenCalledTimes(1);

        expect(
            elementExistsMock
        ).toHaveBeenCalledWith(
            "id",
            "login_button"
        );

        expect(result).toEqual({
            outputs: ["next"],
        });
    });

    it("stores result into VariableStore", async () => {
        elementExistsMock.mockResolvedValue(true);

        await elementExistsRunner.run(
            createElementExistsNode(),
            context
        );

        expect(
            getVariable("loginVisible")
        ).toBe(true);
    });

    it("does not store variable when variableName is empty", async () => {
        elementExistsMock.mockResolvedValue(true);

        const node = createElementExistsNode();

        (node.data as ElementExistsNodeData).variableName = "";

        await elementExistsRunner.run(
            node,
            context,
        );

        expect(
            getVariable("loginVisible"),
        ).toBeUndefined();
    });

    it("returns immediately when action is not elementExists", async () => {
        const node =
            createElementExistsNode();

        node.data = {
            ...node.data,
            action: "tap",
        } as never;

        const result =
            await elementExistsRunner.run(
                node,
                context
            );

        expect(result).toBeUndefined();

        expect(
            elementExistsMock
        ).not.toHaveBeenCalled();
    });
});