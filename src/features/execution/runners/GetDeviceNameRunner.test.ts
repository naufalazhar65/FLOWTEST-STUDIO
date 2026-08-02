import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("../services/appium/AppiumClient", () => ({
    appiumClient: {
        getDeviceName: vi.fn(),
    },
}));

vi.mock("../utils/storeResult", () => ({
    storeResult: vi.fn(),
}));

import { appiumClient } from "../services/appium/AppiumClient";
import { storeResult } from "../utils/storeResult";
import { getDeviceNameRunner } from "./GetDeviceNameRunner";

import type {
    FlowNode,
    GetDeviceNameNodeData,
} from "../../flow/types/flowNode";

import type { ExecutionContext } from "../types/ExecutionContext";

const context: ExecutionContext = {
    edges: [],
};

function createGetDeviceNameNode(): FlowNode & {
    data: GetDeviceNameNodeData;
} {
    return {
        id: "node-1",

        type: "flowNode",

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
    } as FlowNode & {
        data: GetDeviceNameNodeData;
    };
}

describe("GetDeviceNameRunner", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("calls appiumClient.getDeviceName()", async () => {
        vi.mocked(
            appiumClient.getDeviceName,
        ).mockResolvedValue(
            "Pixel 8 Pro",
        );

        await getDeviceNameRunner.run(
            createGetDeviceNameNode(),
            context,
        );

        expect(
            appiumClient.getDeviceName,
        ).toHaveBeenCalledTimes(1);
    });

    it("stores result into variable", async () => {
        vi.mocked(
            appiumClient.getDeviceName,
        ).mockResolvedValue(
            "Pixel 8 Pro",
        );

        await getDeviceNameRunner.run(
            createGetDeviceNameNode(),
            context,
        );

        expect(storeResult).toHaveBeenCalledWith(
            "deviceName",
            "Pixel 8 Pro",
        );
    });

    it("returns next output", async () => {
        vi.mocked(
            appiumClient.getDeviceName,
        ).mockResolvedValue(
            "Pixel 8 Pro",
        );

        const result =
            await getDeviceNameRunner.run(
                createGetDeviceNameNode(),
                context,
            );

        expect(result).toEqual({
            outputs: ["next"],
        });
    });

    it("returns undefined when action does not match", async () => {
        const result = await getDeviceNameRunner.run(
            {
                ...createGetDeviceNameNode(),
                data: {
                    ...createGetDeviceNameNode().data,
                    action: "tap",
                },
            } as never,
            context,
        );

        expect(result).toBeUndefined();

        expect(
            appiumClient.getDeviceName,
        ).not.toHaveBeenCalled();

        expect(storeResult).not.toHaveBeenCalled();
    });

    it("throws when appiumClient.getDeviceName throws Error", async () => {
        const error = new Error("Appium failed");

        vi.mocked(
            appiumClient.getDeviceName,
        ).mockRejectedValue(error);

        await expect(
            getDeviceNameRunner.run(
                createGetDeviceNameNode(),
                context,
            ),
        ).rejects.toThrow("Appium failed");

        expect(storeResult).not.toHaveBeenCalled();
    });

    it("throws when appiumClient.getDeviceName throws string", async () => {
        vi.mocked(
            appiumClient.getDeviceName,
        ).mockRejectedValue("Unknown error");

        await expect(
            getDeviceNameRunner.run(
                createGetDeviceNameNode(),
                context,
            ),
        ).rejects.toBe("Unknown error");

        expect(storeResult).not.toHaveBeenCalled();
    });
});