import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("../services/appium/AppiumClient", () => ({
    appiumClient: {
        isDisplayed: vi.fn(),
    },
}));

vi.mock("../utils/storeResult", () => ({
    storeResult: vi.fn(),
}));

import { appiumClient } from "../services/appium/AppiumClient";
import { storeResult } from "../utils/storeResult";
import { getDisplayedRunner } from "./GetDisplayedRunner";

import type {
    FlowNode,
    GetDisplayedNodeData,
} from "../../flow/types/flowNode";

import type { ExecutionContext } from "../types/ExecutionContext";

const context: ExecutionContext = {
    edges: [],
};

function createGetDisplayedNode(): FlowNode & {
    data: GetDisplayedNodeData;
} {
    return {
        id: "node-1",

        type: "flowNode",

        position: {
            x: 0,
            y: 0,
        },

        data: {
            action: "getDisplayed",

            title: "Get Displayed",

            subtitle: "",

            debug: {
                breakpoint: false,
            },

            locatorStrategy: "id",

            locator: "login_button",

            variableName: "isVisible",
        },
    } as FlowNode & {
        data: GetDisplayedNodeData;
    };
}

describe("GetDisplayedRunner", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("calls appiumClient.isDisplayed()", async () => {
        vi.mocked(
            appiumClient.isDisplayed,
        ).mockResolvedValue(true);

        await getDisplayedRunner.run(
            createGetDisplayedNode(),
            context,
        );

        expect(
            appiumClient.isDisplayed,
        ).toHaveBeenCalledWith(
            "id",
            "login_button",
        );
    });

    it("stores result into variable", async () => {
        vi.mocked(
            appiumClient.isDisplayed,
        ).mockResolvedValue(true);

        await getDisplayedRunner.run(
            createGetDisplayedNode(),
            context,
        );

        expect(storeResult).toHaveBeenCalledWith(
            "isVisible",
            true,
        );
    });

    it("returns next output", async () => {
        vi.mocked(
            appiumClient.isDisplayed,
        ).mockResolvedValue(true);

        const result =
            await getDisplayedRunner.run(
                createGetDisplayedNode(),
                context,
            );

        expect(result).toEqual({
            outputs: ["next"],
        });
    });

    it("returns undefined when action does not match", async () => {
        const result = await getDisplayedRunner.run(
            {
                ...createGetDisplayedNode(),
                data: {
                    ...createGetDisplayedNode().data,
                    action: "tap",
                },
            } as never,
            context,
        );

        expect(result).toBeUndefined();

        expect(
            appiumClient.isDisplayed,
        ).not.toHaveBeenCalled();

        expect(storeResult).not.toHaveBeenCalled();
    });

    it("throws when appiumClient.isDisplayed throws Error", async () => {
        const error = new Error("Appium failed");

        vi.mocked(
            appiumClient.isDisplayed,
        ).mockRejectedValue(error);

        await expect(
            getDisplayedRunner.run(
                createGetDisplayedNode(),
                context,
            ),
        ).rejects.toThrow("Appium failed");

        expect(storeResult).not.toHaveBeenCalled();
    });

    it("throws when appiumClient.isDisplayed throws string", async () => {
        vi.mocked(
            appiumClient.isDisplayed,
        ).mockRejectedValue("Unknown error");

        await expect(
            getDisplayedRunner.run(
                createGetDisplayedNode(),
                context,
            ),
        ).rejects.toBe("Unknown error");

        expect(storeResult).not.toHaveBeenCalled();
    });
});