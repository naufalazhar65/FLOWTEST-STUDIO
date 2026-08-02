import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("../services/appium/AppiumClient", () => ({
    appiumClient: {
        getCurrentActivity: vi.fn(),
    },
}));

vi.mock("../utils/storeResult", () => ({
    storeResult: vi.fn(),
}));

import { appiumClient } from "../services/appium/AppiumClient";
import { storeResult } from "../utils/storeResult";
import { getCurrentActivityRunner } from "./GetCurrentActivityRunner";

import type {
    FlowNode,
    GetCurrentActivityNodeData,
} from "../../flow/types/flowNode";

import type { ExecutionContext } from "../types/ExecutionContext";

const context: ExecutionContext = {
    edges: [],
};

function createGetCurrentActivityNode(): FlowNode & {
    data: GetCurrentActivityNodeData;
} {
    return {
        id: "node-1",

        type: "flowNode",

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
    } as FlowNode & {
        data: GetCurrentActivityNodeData;
    };
}

describe("GetCurrentActivityRunner", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("calls appiumClient.getCurrentActivity()", async () => {
        vi.mocked(
            appiumClient.getCurrentActivity,
        ).mockResolvedValue(
            "com.demo.MainActivity",
        );

        await getCurrentActivityRunner.run(
            createGetCurrentActivityNode(),
            context,
        );

        expect(
            appiumClient.getCurrentActivity,
        ).toHaveBeenCalledTimes(1);
    });

    it("stores result into variable", async () => {
        vi.mocked(
            appiumClient.getCurrentActivity,
        ).mockResolvedValue(
            "com.demo.MainActivity",
        );

        await getCurrentActivityRunner.run(
            createGetCurrentActivityNode(),
            context,
        );

        expect(storeResult).toHaveBeenCalledWith(
            "currentActivity",
            "com.demo.MainActivity",
        );
    });

    it("returns next output", async () => {
        vi.mocked(
            appiumClient.getCurrentActivity,
        ).mockResolvedValue(
            "com.demo.MainActivity",
        );

        const result =
            await getCurrentActivityRunner.run(
                createGetCurrentActivityNode(),
                context,
            );

        expect(result).toEqual({
            outputs: ["next"],
        });
    });

    it("returns undefined when action does not match", async () => {
        const result = await getCurrentActivityRunner.run(
            {
                ...createGetCurrentActivityNode(),
                data: {
                    ...createGetCurrentActivityNode().data,
                    action: "tap",
                },
            } as never,
            context,
        );

        expect(result).toBeUndefined();

        expect(
            appiumClient.getCurrentActivity,
        ).not.toHaveBeenCalled();

        expect(storeResult).not.toHaveBeenCalled();
    });

    it("throws when appiumClient.getCurrentActivity throws Error", async () => {
        const error = new Error("Appium failed");

        vi.mocked(
            appiumClient.getCurrentActivity,
        ).mockRejectedValue(error);

        await expect(
            getCurrentActivityRunner.run(
                createGetCurrentActivityNode(),
                context,
            ),
        ).rejects.toThrow("Appium failed");

        expect(storeResult).not.toHaveBeenCalled();
    });

    it("throws when appiumClient.getCurrentActivity throws string", async () => {
        vi.mocked(
            appiumClient.getCurrentActivity,
        ).mockRejectedValue("Unknown error");

        await expect(
            getCurrentActivityRunner.run(
                createGetCurrentActivityNode(),
                context,
            ),
        ).rejects.toBe("Unknown error");

        expect(storeResult).not.toHaveBeenCalled();
    });
});