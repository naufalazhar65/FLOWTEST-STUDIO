import {
    beforeEach,
    describe,
    expect,
    it,
    vi,
} from "vitest";

vi.mock("../services/appium/AppiumClient", () => ({
    appiumClient: {
        fling: vi.fn(),
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
import { flingRunner } from "./FlingRunner";

import type {
    FlowNode,
    FlingNodeData,
} from "../../flow/types/flowNode";

import type { ExecutionContext } from "../types/ExecutionContext";

const flingMock = vi.mocked(
    appiumClient.fling,
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

function createFlingNode(): FlowNode & {
    data: FlingNodeData;
} {
    return {
        id: "fling-1",

        type: "default",

        position: {
            x: 0,
            y: 0,
        },

        data: {
            action: "fling",

            title: "Fling",

            subtitle: "",

            debug: {
                breakpoint: false,
            },

            locatorStrategy: "id",

            locator: "list_view",

            direction: "down",

            speed: 800,
        },
    } as FlowNode & {
        data: FlingNodeData;
    };
}

describe("FlingRunner", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("calls appiumClient.fling()", async () => {
        const result =
            await flingRunner.run(
                createFlingNode(),
                context,
            );

        expect(flingMock).toHaveBeenCalledTimes(
            1,
        );

        expect(flingMock).toHaveBeenCalledWith(
            "id",
            "list_view",
            "down",
            800,
        );

        expect(successMock).toHaveBeenCalledTimes(
            1,
        );

        expect(result).toEqual({
            outputs: ["next"],
        });
    });

    it("throws when appiumClient.fling() fails with Error", async () => {
        flingMock.mockRejectedValueOnce(
            new Error("Fling failed"),
        );

        await expect(
            flingRunner.run(
                createFlingNode(),
                context,
            ),
        ).rejects.toThrow(
            "Fling failed",
        );

        expect(errorMock).toHaveBeenCalledTimes(
            1,
        );
    });

    it("throws when appiumClient.fling() fails with non-Error", async () => {
        flingMock.mockRejectedValueOnce(
            "Unknown error",
        );

        await expect(
            flingRunner.run(
                createFlingNode(),
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