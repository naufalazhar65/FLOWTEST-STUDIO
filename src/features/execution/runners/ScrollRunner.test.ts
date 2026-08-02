import {
    beforeEach,
    describe,
    expect,
    it,
    vi,
} from "vitest";

vi.mock("../services/appium/AppiumClient", () => ({
    appiumClient: {
        scroll: vi.fn(),
    },
}));

vi.mock("../services/executionLogger", () => ({
    executionLogger: {
        info: vi.fn(),
        success: vi.fn(),
        warning: vi.fn(),
        error: vi.fn(),
        clear: vi.fn(),
    },
}));

import { appiumClient } from "../services/appium/AppiumClient";
import { executionLogger } from "../services/executionLogger";
import { scrollRunner } from "./ScrollRunner";

import type {
    FlowNode,
    ScrollNodeData,
} from "../../flow/types/flowNode";

import type { ExecutionContext } from "../types/ExecutionContext";

const scrollMock = vi.mocked(
    appiumClient.scroll,
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

function createScrollNode(): FlowNode & {
    data: ScrollNodeData;
} {
    return {
        id: "scroll-1",

        type: "default",

        position: {
            x: 0,
            y: 0,
        },

        data: {
            action: "scroll",

            title: "Scroll",

            subtitle: "",

            debug: {
                breakpoint: false,
            },

            direction: "down",

            amount: 500,
        },
    } as FlowNode & {
        data: ScrollNodeData;
    };
}

describe("ScrollRunner", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("calls appiumClient.scroll()", async () => {
        const result =
            await scrollRunner.run(
                createScrollNode(),
                context,
            );

        expect(scrollMock)
            .toHaveBeenCalledTimes(1);

        expect(scrollMock)
            .toHaveBeenCalledWith(
                "down",
                500,
            );

        expect(successMock)
            .toHaveBeenCalledTimes(1);

        expect(result).toEqual({
            outputs: ["next"],
        });
    });

    it("throws when appiumClient.scroll() fails with Error", async () => {
        scrollMock.mockRejectedValueOnce(
            new Error("Scroll failed"),
        );

        await expect(
            scrollRunner.run(
                createScrollNode(),
                context,
            ),
        ).rejects.toThrow(
            "Scroll failed",
        );

        expect(errorMock)
            .toHaveBeenCalledTimes(1);
    });

    it("throws when appiumClient.scroll() fails with non-Error", async () => {
        scrollMock.mockRejectedValueOnce(
            "Unknown error",
        );

        await expect(
            scrollRunner.run(
                createScrollNode(),
                context,
            ),
        ).rejects.toBe(
            "Unknown error",
        );

        expect(errorMock)
            .toHaveBeenCalledTimes(1);
    });

    it("returns undefined when action is not scroll", async () => {
        const node =
            createScrollNode();

        node.data = {
            ...node.data,
            action: "tap",
        } as never;

        const result =
            await scrollRunner.run(
                node,
                context,
            );

        expect(result)
            .toBeUndefined();

        expect(scrollMock)
            .not.toHaveBeenCalled();

        expect(successMock)
            .not.toHaveBeenCalled();

        expect(errorMock)
            .not.toHaveBeenCalled();
    });
});