import {
    beforeEach,
    describe,
    expect,
    it,
    vi,
} from "vitest";

vi.mock("../services/appium/AppiumClient", () => ({
    appiumClient: {
        swipe: vi.fn(),
    },
}));

vi.mock("../services/executionLogger", () => ({
    executionLogger: {
        success: vi.fn(),
        error: vi.fn(),
    },
}));

import { appiumClient } from "../services/appium/AppiumClient";
import { executionLogger } from "../services/executionLogger";
import { swipeRunner } from "./SwipeRunner";

import type { ExecutionContext } from "../types/ExecutionContext";
import type {
    FlowNode,
    SwipeNodeData,
} from "../../flow/types/flowNode";

const swipeMock = vi.mocked(
    appiumClient.swipe,
);

const successMock = vi.mocked(
    executionLogger.success,
);

const errorMock = vi.mocked(
    executionLogger.error,
);

const context: ExecutionContext = {
    edges: [],
};

function createSwipeNode(): FlowNode & {
    data: SwipeNodeData;
} {
    return {
        id: "swipe-1",

        type: "default",

        position: {
            x: 0,
            y: 0,
        },

        data: {
            action: "swipe",

            title: "Swipe",

            subtitle: "",

            debug: {
                breakpoint: false,
            },

            direction: "up",

            distance: 500,

            duration: 300,
        },
    } as FlowNode & {
        data: SwipeNodeData;
    };
}

describe("SwipeRunner", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("calls appiumClient.swipe with node data", async () => {
        const result =
            await swipeRunner.run(
                createSwipeNode(),
                context,
            );

        expect(swipeMock).toHaveBeenCalledTimes(
            1,
        );

        expect(swipeMock).toHaveBeenCalledWith(
            "up",
            500,
            300,
        );

        expect(successMock).toHaveBeenCalledTimes(
            1,
        );

        expect(result).toEqual({
            outputs: ["next"],
        });
    });

    it("returns immediately when action is not swipe", async () => {
        const node =
            createSwipeNode();

        node.data = {
            ...node.data,
            action: "tap",
        } as never;

        const result =
            await swipeRunner.run(
                node,
                context,
            );

        expect(result).toBeUndefined();

        expect(swipeMock)
            .not.toHaveBeenCalled();

        expect(successMock)
            .not.toHaveBeenCalled();

        expect(errorMock)
            .not.toHaveBeenCalled();
    });

    it("throws when swipe rejects with Error", async () => {
        swipeMock.mockRejectedValueOnce(
            new Error("Swipe failed"),
        );

        await expect(
            swipeRunner.run(
                createSwipeNode(),
                context,
            ),
        ).rejects.toThrow(
            "Swipe failed",
        );

        expect(errorMock).toHaveBeenCalledTimes(
            1,
        );
    });

    it("throws when swipe rejects with non-Error", async () => {
        swipeMock.mockRejectedValueOnce(
            "Unknown error",
        );

        await expect(
            swipeRunner.run(
                createSwipeNode(),
                context,
            ),
        ).rejects.toBe(
            "Unknown error",
        );

        expect(errorMock).toHaveBeenCalledTimes(
            1,
        );
    });
});