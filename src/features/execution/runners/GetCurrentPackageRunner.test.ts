import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("../services/appium/AppiumClient", () => ({
    appiumClient: {
        getCurrentPackage: vi.fn(),
    },
}));

vi.mock("../utils/storeResult", () => ({
    storeResult: vi.fn(),
}));

import { appiumClient } from "../services/appium/AppiumClient";
import { storeResult } from "../utils/storeResult";
import { getCurrentPackageRunner } from "./GetCurrentPackageRunner";

import type {
    FlowNode,
    GetCurrentPackageNodeData,
} from "../../flow/types/flowNode";

import type { ExecutionContext } from "../types/ExecutionContext";

const context: ExecutionContext = {
    edges: [],
};

function createGetCurrentPackageNode(): FlowNode & {
    data: GetCurrentPackageNodeData;
} {
    return {
        id: "node-1",

        type: "flowNode",

        position: {
            x: 0,
            y: 0,
        },

        data: {
            action: "getCurrentPackage",

            title: "Get Current Package",

            subtitle: "",

            debug: {
                breakpoint: false,
            },

            variableName: "currentPackage",
        },
    } as FlowNode & {
        data: GetCurrentPackageNodeData;
    };
}

describe("GetCurrentPackageRunner", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("calls appiumClient.getCurrentPackage()", async () => {
        vi.mocked(
            appiumClient.getCurrentPackage,
        ).mockResolvedValue(
            "com.demo.app",
        );

        await getCurrentPackageRunner.run(
            createGetCurrentPackageNode(),
            context,
        );

        expect(
            appiumClient.getCurrentPackage,
        ).toHaveBeenCalledTimes(1);
    });

    it("stores result into variable", async () => {
        vi.mocked(
            appiumClient.getCurrentPackage,
        ).mockResolvedValue(
            "com.demo.app",
        );

        await getCurrentPackageRunner.run(
            createGetCurrentPackageNode(),
            context,
        );

        expect(storeResult).toHaveBeenCalledWith(
            "currentPackage",
            "com.demo.app",
        );
    });

    it("returns next output", async () => {
        vi.mocked(
            appiumClient.getCurrentPackage,
        ).mockResolvedValue(
            "com.demo.app",
        );

        const result =
            await getCurrentPackageRunner.run(
                createGetCurrentPackageNode(),
                context,
            );

        expect(result).toEqual({
            outputs: ["next"],
        });
    });

    it("returns undefined when action does not match", async () => {
        const result = await getCurrentPackageRunner.run(
            {
                ...createGetCurrentPackageNode(),
                data: {
                    ...createGetCurrentPackageNode().data,
                    action: "tap",
                },
            } as never,
            context,
        );

        expect(result).toBeUndefined();

        expect(
            appiumClient.getCurrentPackage,
        ).not.toHaveBeenCalled();

        expect(storeResult).not.toHaveBeenCalled();
    });

    it("throws when appiumClient.getCurrentPackage throws Error", async () => {
        const error = new Error("Appium failed");

        vi.mocked(
            appiumClient.getCurrentPackage,
        ).mockRejectedValue(error);

        await expect(
            getCurrentPackageRunner.run(
                createGetCurrentPackageNode(),
                context,
            ),
        ).rejects.toThrow("Appium failed");

        expect(storeResult).not.toHaveBeenCalled();
    });

    it("throws when appiumClient.getCurrentPackage throws string", async () => {
        vi.mocked(
            appiumClient.getCurrentPackage,
        ).mockRejectedValue("Unknown error");

        await expect(
            getCurrentPackageRunner.run(
                createGetCurrentPackageNode(),
                context,
            ),
        ).rejects.toBe("Unknown error");

        expect(storeResult).not.toHaveBeenCalled();
    });
});