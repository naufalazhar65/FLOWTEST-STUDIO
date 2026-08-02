import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("../services/appium/AppiumClient", () => ({
    appiumClient: {
        getRect: vi.fn(),
    },
}));

vi.mock("../utils/storeResult", () => ({
    storeResult: vi.fn(),
}));

import { appiumClient } from "../services/appium/AppiumClient";
import { storeResult } from "../utils/storeResult";
import { getRectRunner } from "./GetRectRunner";

import type {
    FlowNode,
    GetRectNodeData,
} from "../../flow/types/flowNode";

import type { ExecutionContext } from "../types/ExecutionContext";

const context: ExecutionContext = {
    edges: [],
};

function createGetRectNode(): FlowNode & {
    data: GetRectNodeData;
} {
    return {
        id: "node-1",

        type: "flowNode",

        position: {
            x: 0,
            y: 0,
        },

        data: {
            action: "getRect",

            title: "Get Rect",

            subtitle: "",

            debug: {
                breakpoint: false,
            },

            locatorStrategy: "id",

            locator: "login_button",

            variableName: "rect",
        },
    } as FlowNode & {
        data: GetRectNodeData;
    };
}

describe("GetRectRunner", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("calls appiumClient.getRect()", async () => {
        vi.mocked(
            appiumClient.getRect,
        ).mockResolvedValue({
            x: 120,
            y: 300,
            width: 180,
            height: 52,
        });

        await getRectRunner.run(
            createGetRectNode(),
            context,
        );

        expect(
            appiumClient.getRect,
        ).toHaveBeenCalledWith(
            "id",
            "login_button",
        );
    });

    it("stores result into variable", async () => {
        vi.mocked(
            appiumClient.getRect,
        ).mockResolvedValue({
            x: 120,
            y: 300,
            width: 180,
            height: 52,
        });

        await getRectRunner.run(
            createGetRectNode(),
            context,
        );

        expect(storeResult).toHaveBeenCalledWith(
            "rect",
            {
                x: 120,
                y: 300,
                width: 180,
                height: 52,
            },
        );
    });

    it("returns next output", async () => {
        vi.mocked(
            appiumClient.getRect,
        ).mockResolvedValue({
            x: 120,
            y: 300,
            width: 180,
            height: 52,
        });

        const result =
            await getRectRunner.run(
                createGetRectNode(),
                context,
            );

        expect(result).toEqual({
            outputs: ["next"],
        });
    });

    it("returns undefined when action does not match", async () => {
    const result = await getRectRunner.run(
        {
            ...createGetRectNode(),
            data: {
                ...createGetRectNode().data,
                action: "tap",
            },
        } as never,
        context,
    );

    expect(result).toBeUndefined();

    expect(
        appiumClient.getRect,
    ).not.toHaveBeenCalled();

    expect(storeResult).not.toHaveBeenCalled();
});

it("throws when appiumClient.getRect throws Error", async () => {
    const error = new Error("Appium failed");

    vi.mocked(
        appiumClient.getRect,
    ).mockRejectedValue(error);

    await expect(
        getRectRunner.run(
            createGetRectNode(),
            context,
        ),
    ).rejects.toThrow("Appium failed");

    expect(storeResult).not.toHaveBeenCalled();
});

it("throws when appiumClient.getRect throws string", async () => {
    vi.mocked(
        appiumClient.getRect,
    ).mockRejectedValue("Unknown error");

    await expect(
        getRectRunner.run(
            createGetRectNode(),
            context,
        ),
    ).rejects.toBe("Unknown error");

    expect(storeResult).not.toHaveBeenCalled();
});
});