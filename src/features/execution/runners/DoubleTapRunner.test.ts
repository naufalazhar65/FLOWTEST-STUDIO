import {
    beforeEach,
    describe,
    expect,
    it,
    vi,
} from "vitest";

vi.mock("../services/appium/AppiumClient", () => ({
    appiumClient: {
        doubleTap: vi.fn(),
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
import { doubleTapRunner } from "./DoubleTapRunner";

import type {
    DoubleTapNodeData,
    FlowNode,
} from "../../flow/types/flowNode";

import type { ExecutionContext } from "../types/ExecutionContext";

const doubleTapMock = vi.mocked(
    appiumClient.doubleTap,
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

function createDoubleTapNode(): FlowNode & {
    data: DoubleTapNodeData;
} {
    return {
        id: "double-tap-1",

        type: "default",

        position: {
            x: 0,
            y: 0,
        },

        data: {
            action: "doubleTap",

            title: "Double Tap",

            subtitle: "",

            debug: {
                breakpoint: false,
            },

            locatorStrategy: "id",

            locator: "login_button",
        },
    } as FlowNode & {
        data: DoubleTapNodeData;
    };
}

describe("DoubleTapRunner", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("calls appiumClient.doubleTap()", async () => {
        const result =
            await doubleTapRunner.run(
                createDoubleTapNode(),
                context,
            );

        expect(doubleTapMock).toHaveBeenCalledTimes(
            1,
        );

        expect(doubleTapMock).toHaveBeenCalledWith(
            "id",
            "login_button",
        );

        expect(successMock).toHaveBeenCalledTimes(
            1,
        );

        expect(result).toEqual({
            outputs: ["next"],
        });
    });

    it("throws when appiumClient.doubleTap() fails with Error", async () => {
        doubleTapMock.mockRejectedValueOnce(
            new Error("Double tap failed"),
        );

        await expect(
            doubleTapRunner.run(
                createDoubleTapNode(),
                context,
            ),
        ).rejects.toThrow(
            "Double tap failed",
        );

        expect(errorMock).toHaveBeenCalledTimes(
            1,
        );
    });

    it("throws when appiumClient.doubleTap() fails with non-Error", async () => {
        doubleTapMock.mockRejectedValueOnce(
            "Unknown error",
        );

        await expect(
            doubleTapRunner.run(
                createDoubleTapNode(),
                context,
            ),
        ).rejects.toBe(
            "Unknown error",
        );

        expect(errorMock).toHaveBeenCalledTimes(
            1,
        );
    });

    it("returns undefined when node is not DoubleTap", async () => {
        const node =
            createDoubleTapNode();

        node.data = {
            ...node.data,
            action: "tap",
        } as never;

        const result =
            await doubleTapRunner.run(
                node,
                context,
            );

        expect(result).toBeUndefined();

        expect(doubleTapMock)
            .not.toHaveBeenCalled();

        expect(successMock)
            .not.toHaveBeenCalled();

        expect(errorMock)
            .not.toHaveBeenCalled();
    });
});