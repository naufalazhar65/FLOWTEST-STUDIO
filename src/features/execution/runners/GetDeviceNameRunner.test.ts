import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("../services/AppiumClient", () => ({
    appiumClient: {
        getDeviceName: vi.fn(),
    },
}));

import { appiumClient } from "../services/appium/AppiumClient";
import { getDeviceNameRunner } from "./GetDeviceNameRunner";

import type { ExecutionContext } from "../types/ExecutionContext";
import {
    clearVariables,
    getVariable,
} from "../variables/VariableStore";
import type {
    FlowNode,
    GetDeviceNameNodeData,
} from "../../flow/types/flowNode";

const context: ExecutionContext = {
    device: "Android",
    edges: [],
};

const getDeviceNameMock = vi.mocked(
    appiumClient.getDeviceName,
);

function createGetDeviceNameNode(): FlowNode {
    return {
        id: "get-device-name-1",
        type: "default",
        position: {
            x: 0,
            y: 0,
        },
        data: {
            action: "getDeviceName",
            title: "Get Device Name",
            subtitle: "",
            debug: {
                breakpoint: false,
            },
            variableName: "deviceName",
        },
    } as FlowNode;
}

describe("GetDeviceNameRunner", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        clearVariables();
    });

    it("calls appiumClient.getDeviceName", async () => {
        getDeviceNameMock.mockResolvedValue(
            "Pixel 9 Pro",
        );

        const result = await getDeviceNameRunner.run(
            createGetDeviceNameNode(),
            context,
        );

        expect(
            getDeviceNameMock,
        ).toHaveBeenCalledTimes(1);

        expect(result).toEqual({
            outputs: ["next"],
        });
    });

    it("returns immediately when action is not getDeviceName", async () => {
        const node = createGetDeviceNameNode();

        node.data = {
            ...node.data,
            action: "tap",
        } as never;

        const result = await getDeviceNameRunner.run(
            node,
            context,
        );

        expect(result).toBeUndefined();

        expect(
            getDeviceNameMock,
        ).not.toHaveBeenCalled();
    });

    it("stores device name into VariableStore", async () => {
        getDeviceNameMock.mockResolvedValue(
            "Pixel 9 Pro",
        );

        await getDeviceNameRunner.run(
            createGetDeviceNameNode(),
            context,
        );

        expect(
            getVariable("deviceName"),
        ).toBe("Pixel 9 Pro");
    });

    it("does not store variable when variableName is empty", async () => {
        getDeviceNameMock.mockResolvedValue(
            "Pixel 9 Pro",
        );

        const node = createGetDeviceNameNode();

        (
            node.data as GetDeviceNameNodeData
        ).variableName = "";

        await getDeviceNameRunner.run(
            node,
            context,
        );

        expect(
            getVariable("deviceName"),
        ).toBeUndefined();
    });
});