import {
    beforeEach,
    describe,
    expect,
    it,
    vi,
} from "vitest";

vi.mock("../services/appium/AppiumClient", () => ({
    appiumClient: {
        pinch: vi.fn(),
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
import { pinchRunner } from "./PinchRunner";

import type {
    FlowNode,
    PinchNodeData,
} from "../../flow/types/flowNode";

import type { ExecutionContext } from "../types/ExecutionContext";

const context: ExecutionContext = {
    edges: [],
};

const pinchMock = vi.mocked(
    appiumClient.pinch,
);

const successMock = vi.mocked(
    executionLogger.success,
);

const errorMock = vi.mocked(
    executionLogger.error,
);

function createPinchNode(): FlowNode & {
    data: PinchNodeData;
} {
    return {
        id: "pinch-1",

        type: "default",

        position: {
            x: 0,
            y: 0,
        },

        data: {
            action: "pinch",

            title: "Pinch",

            subtitle: "",

            debug: {
                breakpoint: false,
            },

            locatorStrategy: "id",

            locator: "image",

            percent: 0.75,

            duration: 300,
        },
    } as FlowNode & {
        data: PinchNodeData;
    };
}

describe("PinchRunner", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("calls appiumClient.pinch()", async () => {
        const result =
            await pinchRunner.run(
                createPinchNode(),
                context,
            );

        expect(result).toBeUndefined();

        expect(pinchMock)
            .toHaveBeenCalledWith(
                "id",
                "image",
                0.75,
                300,
            );

        expect(successMock)
            .toHaveBeenCalledTimes(1);
    });

    it("throws when pinch rejects with Error", async () => {
        pinchMock.mockRejectedValueOnce(
            new Error("Pinch failed"),
        );

        await expect(
            pinchRunner.run(
                createPinchNode(),
                context,
            ),
        ).rejects.toThrow(
            "Pinch failed",
        );

        expect(errorMock)
            .toHaveBeenCalledTimes(1);
    });

    it("throws when pinch rejects with non-Error", async () => {
        pinchMock.mockRejectedValueOnce(
            "Unknown error",
        );

        await expect(
            pinchRunner.run(
                createPinchNode(),
                context,
            ),
        ).rejects.toBe(
            "Unknown error",
        );

        expect(errorMock)
            .toHaveBeenCalledTimes(1);
    });
});