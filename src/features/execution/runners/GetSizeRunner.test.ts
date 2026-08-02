import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("../services/appium/AppiumClient", () => ({
    appiumClient: {
        getSize: vi.fn(),
    },
}));

vi.mock("../utils/storeResult", () => ({
    storeResult: vi.fn(),
}));

import { appiumClient } from "../services/appium/AppiumClient";
import { storeResult } from "../utils/storeResult";
import { getSizeRunner } from "./GetSizeRunner";

import type {
    FlowNode,
    GetSizeNodeData,
} from "../../flow/types/flowNode";

import type { ExecutionContext } from "../types/ExecutionContext";

const context: ExecutionContext = {
    edges: [],
};

function createGetSizeNode(): FlowNode & {
    data: GetSizeNodeData;
} {
    return {
        id: "node-1",

        type: "flowNode",

        position: {
            x: 0,
            y: 0,
        },

        data: {
            action: "getSize",

            title: "Get Size",

            subtitle: "",

            debug: {
                breakpoint: false,
            },

            locatorStrategy: "id",

            locator: "login_button",

            variableName: "size",
        },
    } as FlowNode & {
        data: GetSizeNodeData;
    };
}

describe("GetSizeRunner", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("calls appiumClient.getSize()", async () => {
        vi.mocked(
            appiumClient.getSize,
        ).mockResolvedValue({
            width: 180,
            height: 52,
        });

        await getSizeRunner.run(
            createGetSizeNode(),
            context,
        );

        expect(
            appiumClient.getSize,
        ).toHaveBeenCalledWith(
            "id",
            "login_button",
        );
    });

    it("stores result into variable", async () => {
        vi.mocked(
            appiumClient.getSize,
        ).mockResolvedValue({
            width: 180,
            height: 52,
        });

        await getSizeRunner.run(
            createGetSizeNode(),
            context,
        );

        expect(storeResult).toHaveBeenCalledWith(
            "size",
            {
                width: 180,
                height: 52,
            },
        );
    });

    it("returns next output", async () => {
        vi.mocked(
            appiumClient.getSize,
        ).mockResolvedValue({
            width: 180,
            height: 52,
        });

        const result =
            await getSizeRunner.run(
                createGetSizeNode(),
                context,
            );

        expect(result).toEqual({
            outputs: ["next"],
        });
    });

    it("returns undefined when action does not match", async () => {
        const result = await getSizeRunner.run(
            {
                ...createGetSizeNode(),
                data: {
                    ...createGetSizeNode().data,
                    action: "tap",
                },
            } as never,
            context,
        );

        expect(result).toBeUndefined();

        expect(
            appiumClient.getSize,
        ).not.toHaveBeenCalled();

        expect(storeResult).not.toHaveBeenCalled();
    });

    it("throws when appiumClient.getSize throws Error", async () => {
        const error = new Error("Appium failed");

        vi.mocked(
            appiumClient.getSize,
        ).mockRejectedValue(error);

        await expect(
            getSizeRunner.run(
                createGetSizeNode(),
                context,
            ),
        ).rejects.toThrow("Appium failed");

        expect(storeResult).not.toHaveBeenCalled();
    });

    it("throws when appiumClient.getSize throws string", async () => {
        vi.mocked(
            appiumClient.getSize,
        ).mockRejectedValue("Unknown error");

        await expect(
            getSizeRunner.run(
                createGetSizeNode(),
                context,
            ),
        ).rejects.toBe("Unknown error");

        expect(storeResult).not.toHaveBeenCalled();
    });
});