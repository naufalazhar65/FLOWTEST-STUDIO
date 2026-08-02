import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("../services/appium/AppiumClient", () => ({
    appiumClient: {
        getPlatformVersion: vi.fn(),
    },
}));

vi.mock("../utils/storeResult", () => ({
    storeResult: vi.fn(),
}));

import { appiumClient } from "../services/appium/AppiumClient";
import { storeResult } from "../utils/storeResult";
import { getPlatformVersionRunner } from "./GetPlatformVersionRunner";

import type {
    FlowNode,
    GetPlatformVersionNodeData,
} from "../../flow/types/flowNode";

import type { ExecutionContext } from "../types/ExecutionContext";

const context: ExecutionContext = {
    edges: [],
};

function createGetPlatformVersionNode(): FlowNode & {
    data: GetPlatformVersionNodeData;
} {
    return {
        id: "node-1",

        type: "flowNode",

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
    } as FlowNode & {
        data: GetPlatformVersionNodeData;
    };
}

describe("GetPlatformVersionRunner", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("calls appiumClient.getPlatformVersion()", async () => {
        vi.mocked(
            appiumClient.getPlatformVersion,
        ).mockResolvedValue("14");

        await getPlatformVersionRunner.run(
            createGetPlatformVersionNode(),
            context,
        );

        expect(
            appiumClient.getPlatformVersion,
        ).toHaveBeenCalledTimes(1);
    });

    it("stores result into variable", async () => {
        vi.mocked(
            appiumClient.getPlatformVersion,
        ).mockResolvedValue("14");

        await getPlatformVersionRunner.run(
            createGetPlatformVersionNode(),
            context,
        );

        expect(storeResult).toHaveBeenCalledWith(
            "platformVersion",
            "14",
        );
    });

    it("returns next output", async () => {
        vi.mocked(
            appiumClient.getPlatformVersion,
        ).mockResolvedValue("14");

        const result =
            await getPlatformVersionRunner.run(
                createGetPlatformVersionNode(),
                context,
            );

        expect(result).toEqual({
            outputs: ["next"],
        });
    });

    it("returns undefined when action does not match", async () => {
        const result = await getPlatformVersionRunner.run(
            {
                ...createGetPlatformVersionNode(),
                data: {
                    ...createGetPlatformVersionNode().data,
                    action: "tap",
                },
            } as never,
            context,
        );

        expect(result).toBeUndefined();

        expect(
            appiumClient.getPlatformVersion,
        ).not.toHaveBeenCalled();

        expect(storeResult).not.toHaveBeenCalled();
    });

    it("throws when appiumClient.getPlatformVersion throws Error", async () => {
        const error = new Error("Appium failed");

        vi.mocked(
            appiumClient.getPlatformVersion,
        ).mockRejectedValue(error);

        await expect(
            getPlatformVersionRunner.run(
                createGetPlatformVersionNode(),
                context,
            ),
        ).rejects.toThrow("Appium failed");

        expect(storeResult).not.toHaveBeenCalled();
    });

    it("throws when appiumClient.getPlatformVersion throws string", async () => {
        vi.mocked(
            appiumClient.getPlatformVersion,
        ).mockRejectedValue("Unknown error");

        await expect(
            getPlatformVersionRunner.run(
                createGetPlatformVersionNode(),
                context,
            ),
        ).rejects.toBe("Unknown error");

        expect(storeResult).not.toHaveBeenCalled();
    });
});