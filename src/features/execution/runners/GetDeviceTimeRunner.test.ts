import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("../services/AppiumClient", () => ({
    appiumClient: {
        getDeviceTime: vi.fn(),
    },
}));

import { appiumClient } from "../services/appium/AppiumClient";
import { getDeviceTimeRunner } from "./GetDeviceTimeRunner";

import type { ExecutionContext } from "../types/ExecutionContext";
import {
    clearVariables,
    getVariable,
} from "../variables/VariableStore";
import type {
    FlowNode,
    GetDeviceTimeNodeData,
} from "../../flow/types/flowNode";

const context: ExecutionContext = {
    device: "Android",
    edges: [],
};

const getDeviceTimeMock = vi.mocked(
    appiumClient.getDeviceTime,
);

function createGetDeviceTimeNode(): FlowNode {
    return {
        id: "get-device-time-1",
        type: "default",
        position: {
            x: 0,
            y: 0,
        },
        data: {
            action: "getDeviceTime",
            title: "Get Device Time",
            subtitle: "",
            debug: {
                breakpoint: false,
            },
            variableName: "deviceTime",
        },
    } as FlowNode;
}

describe("GetDeviceTimeRunner", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        clearVariables();
    });

    it("calls appiumClient.getDeviceTime", async () => {
        getDeviceTimeMock.mockResolvedValue(
            "2026-07-29T22:30:00+07:00",
        );

        const result = await getDeviceTimeRunner.run(
            createGetDeviceTimeNode(),
            context,
        );

        expect(
            getDeviceTimeMock,
        ).toHaveBeenCalledTimes(1);

        expect(result).toEqual({
            outputs: ["next"],
        });
    });

    it("returns immediately when action is not getDeviceTime", async () => {
        const node = createGetDeviceTimeNode();

        node.data = {
            ...node.data,
            action: "tap",
        } as never;

        const result = await getDeviceTimeRunner.run(
            node,
            context,
        );

        expect(result).toBeUndefined();

        expect(
            getDeviceTimeMock,
        ).not.toHaveBeenCalled();
    });

    it("stores device time into VariableStore", async () => {
        getDeviceTimeMock.mockResolvedValue(
            "2026-07-29T22:30:00+07:00",
        );

        await getDeviceTimeRunner.run(
            createGetDeviceTimeNode(),
            context,
        );

        expect(
            getVariable("deviceTime"),
        ).toBe("2026-07-29T22:30:00+07:00");
    });

    it("does not store variable when variableName is empty", async () => {
        getDeviceTimeMock.mockResolvedValue(
            "2026-07-29T22:30:00+07:00",
        );

        const node = createGetDeviceTimeNode();

        (
            node.data as GetDeviceTimeNodeData
        ).variableName = "";

        await getDeviceTimeRunner.run(
            node,
            context,
        );

        expect(
            getVariable("deviceTime"),
        ).toBeUndefined();
    });
});