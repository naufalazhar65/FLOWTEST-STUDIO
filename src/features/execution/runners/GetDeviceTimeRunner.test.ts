import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("../services/appium/AppiumClient", () => ({
    appiumClient: {
        getDeviceTime: vi.fn(),
    },
}));

vi.mock("../utils/storeResult", () => ({
    storeResult: vi.fn(),
}));

import { appiumClient } from "../services/appium/AppiumClient";
import { storeResult } from "../utils/storeResult";
import { getDeviceTimeRunner } from "./GetDeviceTimeRunner";

import type {
    FlowNode,
    GetDeviceTimeNodeData,
} from "../../flow/types/flowNode";

import type { ExecutionContext } from "../types/ExecutionContext";

const context: ExecutionContext = {
    edges: [],
};

function createGetDeviceTimeNode(): FlowNode & {
    data: GetDeviceTimeNodeData;
} {
    return {
        id: "node-1",

        type: "flowNode",

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
    } as FlowNode & {
        data: GetDeviceTimeNodeData;
    };
}

describe("GetDeviceTimeRunner", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("calls appiumClient.getDeviceTime()", async () => {
        vi.mocked(
            appiumClient.getDeviceTime,
        ).mockResolvedValue(
            "2026-08-02T10:30:00Z",
        );

        await getDeviceTimeRunner.run(
            createGetDeviceTimeNode(),
            context,
        );

        expect(
            appiumClient.getDeviceTime,
        ).toHaveBeenCalledTimes(1);
    });

    it("stores result into variable", async () => {
        vi.mocked(
            appiumClient.getDeviceTime,
        ).mockResolvedValue(
            "2026-08-02T10:30:00Z",
        );

        await getDeviceTimeRunner.run(
            createGetDeviceTimeNode(),
            context,
        );

        expect(storeResult).toHaveBeenCalledWith(
            "deviceTime",
            "2026-08-02T10:30:00Z",
        );
    });

    it("returns next output", async () => {
        vi.mocked(
            appiumClient.getDeviceTime,
        ).mockResolvedValue(
            "2026-08-02T10:30:00Z",
        );

        const result =
            await getDeviceTimeRunner.run(
                createGetDeviceTimeNode(),
                context,
            );

        expect(result).toEqual({
            outputs: ["next"],
        });
    });

    it("returns undefined when action does not match", async () => {
        const result = await getDeviceTimeRunner.run(
            {
                ...createGetDeviceTimeNode(),
                data: {
                    ...createGetDeviceTimeNode().data,
                    action: "tap",
                },
            } as never,
            context,
        );

        expect(result).toBeUndefined();

        expect(
            appiumClient.getDeviceTime,
        ).not.toHaveBeenCalled();

        expect(storeResult).not.toHaveBeenCalled();
    });

    it("throws when appiumClient.getDeviceTime throws Error", async () => {
        const error = new Error("Appium failed");

        vi.mocked(
            appiumClient.getDeviceTime,
        ).mockRejectedValue(error);

        await expect(
            getDeviceTimeRunner.run(
                createGetDeviceTimeNode(),
                context,
            ),
        ).rejects.toThrow("Appium failed");

        expect(storeResult).not.toHaveBeenCalled();
    });

    it("throws when appiumClient.getDeviceTime throws string", async () => {
        vi.mocked(
            appiumClient.getDeviceTime,
        ).mockRejectedValue("Unknown error");

        await expect(
            getDeviceTimeRunner.run(
                createGetDeviceTimeNode(),
                context,
            ),
        ).rejects.toBe("Unknown error");

        expect(storeResult).not.toHaveBeenCalled();
    });
});