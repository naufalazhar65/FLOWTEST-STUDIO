import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("../services/AppiumClient", () => ({
    appiumClient: {
        getPlatformVersion: vi.fn(),
    },
}));

import { appiumClient } from "../services/AppiumClient";
import { getPlatformVersionRunner } from "./GetPlatformVersionRunner";

import type { ExecutionContext } from "../types/ExecutionContext";
import {
    clearVariables,
    getVariable,
} from "../variables/VariableStore";
import type {
    FlowNode,
    GetPlatformVersionNodeData,
} from "../../flow/types/flowNode";

const context: ExecutionContext = {
    device: "Android",
    edges: [],
};

const getPlatformVersionMock = vi.mocked(
    appiumClient.getPlatformVersion,
);

function createGetPlatformVersionNode(): FlowNode {
    return {
        id: "get-platform-version-1",
        type: "default",
        position: {
            x: 0,
            y: 0,
        },
        data: {
            action: "getPlatformVersion",
            title: "Get Platform Version",
            subtitle: "",
            debug: {
                breakpoint: false,
            },
            variableName: "platformVersion",
        },
    } as FlowNode;
}

describe("GetPlatformVersionRunner", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        clearVariables();
    });

    it("calls appiumClient.getPlatformVersion", async () => {
        getPlatformVersionMock.mockResolvedValue(
            "Android 15",
        );

        const result = await getPlatformVersionRunner.run(
            createGetPlatformVersionNode(),
            context,
        );

        expect(
            getPlatformVersionMock,
        ).toHaveBeenCalledTimes(1);

        expect(result).toEqual({
            outputs: ["next"],
        });
    });

    it("returns immediately when action is not getPlatformVersion", async () => {
        const node = createGetPlatformVersionNode();

        node.data = {
            ...node.data,
            action: "tap",
        } as never;

        const result = await getPlatformVersionRunner.run(
            node,
            context,
        );

        expect(result).toBeUndefined();

        expect(
            getPlatformVersionMock,
        ).not.toHaveBeenCalled();
    });

    it("stores platform version into VariableStore", async () => {
        getPlatformVersionMock.mockResolvedValue(
            "Android 15",
        );

        await getPlatformVersionRunner.run(
            createGetPlatformVersionNode(),
            context,
        );

        expect(
            getVariable("platformVersion"),
        ).toBe("Android 15");
    });

    it("does not store variable when variableName is empty", async () => {
        getPlatformVersionMock.mockResolvedValue(
            "Android 15",
        );

        const node = createGetPlatformVersionNode();

        (
            node.data as GetPlatformVersionNodeData
        ).variableName = "";

        await getPlatformVersionRunner.run(
            node,
            context,
        );

        expect(
            getVariable("platformVersion"),
        ).toBeUndefined();
    });
});