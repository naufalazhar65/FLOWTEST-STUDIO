import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("../services/appium/AppiumClient", () => ({
    appiumClient: {
        getOrientation: vi.fn(),
    },
}));

vi.mock("../utils/storeResult", () => ({
    storeResult: vi.fn(),
}));

import { appiumClient } from "../services/appium/AppiumClient";
import { storeResult } from "../utils/storeResult";
import { getOrientationRunner } from "./GetOrientationRunner";

import type {
    FlowNode,
    GetOrientationNodeData,
} from "../../flow/types/flowNode";

import type { ExecutionContext } from "../types/ExecutionContext";

const context: ExecutionContext = {
    edges: [],
};

function createGetOrientationNode(): FlowNode & {
    data: GetOrientationNodeData;
} {
    return {
        id: "node-1",

        type: "flowNode",

        position: {
            x: 0,
            y: 0,
        },

        data: {
            action: "getOrientation",

            title: "Get Orientation",

            subtitle: "",

            debug: {
                breakpoint: false,
            },

            variableName: "orientation",
        },
    } as FlowNode & {
        data: GetOrientationNodeData;
    };
}

describe("GetOrientationRunner", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("calls appiumClient.getOrientation()", async () => {
        vi.mocked(
            appiumClient.getOrientation,
        ).mockResolvedValue("PORTRAIT");

        await getOrientationRunner.run(
            createGetOrientationNode(),
            context,
        );

        expect(
            appiumClient.getOrientation,
        ).toHaveBeenCalledTimes(1);
    });

    it("stores result into variable", async () => {
        vi.mocked(
            appiumClient.getOrientation,
        ).mockResolvedValue("PORTRAIT");

        await getOrientationRunner.run(
            createGetOrientationNode(),
            context,
        );

        expect(storeResult).toHaveBeenCalledWith(
            "orientation",
            "PORTRAIT",
        );
    });

    it("returns next output", async () => {
        vi.mocked(
            appiumClient.getOrientation,
        ).mockResolvedValue("PORTRAIT");

        const result =
            await getOrientationRunner.run(
                createGetOrientationNode(),
                context,
            );

        expect(result).toEqual({
            outputs: ["next"],
        });
    });

    it("returns undefined when action does not match", async () => {
        const result = await getOrientationRunner.run(
            {
                ...createGetOrientationNode(),
                data: {
                    ...createGetOrientationNode().data,
                    action: "tap",
                },
            } as never,
            context,
        );

        expect(result).toBeUndefined();

        expect(
            appiumClient.getOrientation,
        ).not.toHaveBeenCalled();

        expect(storeResult).not.toHaveBeenCalled();
    });

    it("throws when appiumClient.getOrientation throws Error", async () => {
        const error = new Error("Appium failed");

        vi.mocked(
            appiumClient.getOrientation,
        ).mockRejectedValue(error);

        await expect(
            getOrientationRunner.run(
                createGetOrientationNode(),
                context,
            ),
        ).rejects.toThrow("Appium failed");

        expect(storeResult).not.toHaveBeenCalled();
    });

    it("throws when appiumClient.getOrientation throws string", async () => {
        vi.mocked(
            appiumClient.getOrientation,
        ).mockRejectedValue("Unknown error");

        await expect(
            getOrientationRunner.run(
                createGetOrientationNode(),
                context,
            ),
        ).rejects.toBe("Unknown error");

        expect(storeResult).not.toHaveBeenCalled();
    });
});