import {
    beforeEach,
    describe,
    expect,
    it,
    vi,
} from "vitest";

vi.mock("../services/appium/AppiumClient", () => ({
    appiumClient: {
        zoom: vi.fn(),
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
import { zoomRunner } from "./ZoomRunner";

import type { ExecutionContext } from "../types/ExecutionContext";
import type {
    FlowNode,
    ZoomNodeData,
} from "../../flow/types/flowNode";

const context: ExecutionContext = {
    edges: [],
};

const zoomMock = vi.mocked(
    appiumClient.zoom,
);

const successMock = vi.mocked(
    executionLogger.success,
);

const errorMock = vi.mocked(
    executionLogger.error,
);

function createZoomNode(): FlowNode & {
    data: ZoomNodeData;
} {
    return {
        id: "zoom-1",

        type: "default",

        position: {
            x: 0,
            y: 0,
        },

        data: {
            action: "zoom",

            title: "Zoom",

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
        data: ZoomNodeData;
    };
}

describe("ZoomRunner", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("calls appiumClient.zoom()", async () => {
        const result =
            await zoomRunner.run(
                createZoomNode(),
                context,
            );

        expect(result).toBeUndefined();

        expect(zoomMock)
            .toHaveBeenCalledTimes(1);

        expect(zoomMock)
            .toHaveBeenCalledWith(
                "id",
                "image",
                0.75,
                300,
            );

        expect(successMock)
            .toHaveBeenCalledTimes(1);
    });

    it("throws when zoom rejects with Error", async () => {
        zoomMock.mockRejectedValueOnce(
            new Error("Zoom failed"),
        );

        await expect(
            zoomRunner.run(
                createZoomNode(),
                context,
            ),
        ).rejects.toThrow(
            "Zoom failed",
        );

        expect(errorMock)
            .toHaveBeenCalledTimes(1);
    });

    it("throws when zoom rejects with non-Error", async () => {
        zoomMock.mockRejectedValueOnce(
            "Unknown error",
        );

        await expect(
            zoomRunner.run(
                createZoomNode(),
                context,
            ),
        ).rejects.toBe(
            "Unknown error",
        );

        expect(errorMock)
            .toHaveBeenCalledTimes(1);
    });
});