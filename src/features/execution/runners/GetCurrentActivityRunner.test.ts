import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("../services/AppiumClient", () => ({
    appiumClient: {
        getCurrentActivity: vi.fn(),
    },
}));

import { appiumClient } from "../services/appium/AppiumClient";
import { getCurrentActivityRunner } from "./GetCurrentActivityRunner";

import type { ExecutionContext } from "../types/ExecutionContext";
import {
    clearVariables,
    getVariable,
} from "../variables/VariableStore";
import type {
    FlowNode,
    GetCurrentActivityNodeData,
} from "../../flow/types/flowNode";

const context: ExecutionContext = {
    device: "Android",
    edges: [],
};

const getCurrentActivityMock = vi.mocked(
    appiumClient.getCurrentActivity,
);

function createGetCurrentActivityNode(): FlowNode {
    return {
        id: "get-current-activity-1",
        type: "default",
        position: {
            x: 0,
            y: 0,
        },
        data: {
            action: "getCurrentActivity",
            title: "Get Current Activity",
            subtitle: "",
            debug: {
                breakpoint: false,
            },
            variableName: "currentActivity",
        },
    } as FlowNode;
}

describe("GetCurrentActivityRunner", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        clearVariables();
    });

    it("calls appiumClient.getCurrentActivity", async () => {
        getCurrentActivityMock.mockResolvedValue(
            "com.demo.MainActivity",
        );

        const result =
            await getCurrentActivityRunner.run(
                createGetCurrentActivityNode(),
                context,
            );

        expect(
            getCurrentActivityMock,
        ).toHaveBeenCalledTimes(1);

        expect(result).toEqual({
            outputs: ["next"],
        });
    });

    it("returns immediately when action is not getCurrentActivity", async () => {
        const node =
            createGetCurrentActivityNode();

        node.data = {
            ...node.data,
            action: "tap",
        } as never;

        const result =
            await getCurrentActivityRunner.run(
                node,
                context,
            );

        expect(result).toBeUndefined();

        expect(
            getCurrentActivityMock,
        ).not.toHaveBeenCalled();
    });

    it("stores activity into VariableStore", async () => {
        getCurrentActivityMock.mockResolvedValue(
            "com.demo.MainActivity",
        );

        await getCurrentActivityRunner.run(
            createGetCurrentActivityNode(),
            context,
        );

        expect(
            getVariable("currentActivity"),
        ).toBe("com.demo.MainActivity");
    });

    it("does not store variable when variableName is empty", async () => {
        getCurrentActivityMock.mockResolvedValue(
            "com.demo.MainActivity",
        );

        const node =
            createGetCurrentActivityNode();

        (
            node.data as GetCurrentActivityNodeData
        ).variableName = "";

        await getCurrentActivityRunner.run(
            node,
            context,
        );

        expect(
            getVariable("currentActivity"),
        ).toBeUndefined();
    });
});