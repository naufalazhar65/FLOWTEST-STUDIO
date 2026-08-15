import {
    beforeEach,
    describe,
    expect,
    it,
    vi,
} from "vitest";

vi.mock("../services/appium/AppiumClient", () => ({
    appiumClient: {
        screenshot: vi.fn(),
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
import { screenshotRunner } from "./ScreenshotRunner";

import type { ExecutionContext } from "../types/ExecutionContext";
import type {
    FlowNode,
    ScreenshotNodeData,
} from "../../flow/types/flowNode";

const screenshotMock = vi.mocked(
    appiumClient.screenshot,
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

function createScreenshotNode(): FlowNode & {
    data: ScreenshotNodeData;
} {
    return {
        id: "screenshot-1",

        type: "default",

        position: {
            x: 0,
            y: 0,
        },

        data: {
            action: "screenshot",

            title: "Screenshot",

            subtitle: "",

            debug: {
                breakpoint: false,
            },

            fileName: "login-page.png",
        },
    } as FlowNode & {
        data: ScreenshotNodeData;
    };
}

describe("ScreenshotRunner", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it(
        "calls appiumClient.screenshot with file name",
        async () => {
            const result =
                await screenshotRunner.run(
                    createScreenshotNode(),
                    context,
                );

            expect(
                screenshotMock,
            ).toHaveBeenCalledTimes(
                1,
            );

            expect(
                screenshotMock,
            ).toHaveBeenCalledWith(
                "login-page.png",
            );

            expect(
                successMock,
            ).toHaveBeenCalledTimes(
                1,
            );

            expect(result).toEqual({
                outputs: ["next"],

                screenshot: undefined,

                screenshotFileName:
                    "login-page.png",
            });
        },
    );

    it("returns immediately when action is not screenshot", async () => {
        const node =
            createScreenshotNode();

        node.data = {
            ...node.data,
            action: "tap",
        } as never;

        const result =
            await screenshotRunner.run(
                node,
                context,
            );

        expect(result).toBeUndefined();

        expect(
            screenshotMock,
        ).not.toHaveBeenCalled();

        expect(
            successMock,
        ).not.toHaveBeenCalled();

        expect(
            errorMock,
        ).not.toHaveBeenCalled();
    });

    it("throws when screenshot rejects with Error", async () => {
        screenshotMock.mockRejectedValueOnce(
            new Error(
                "Failed to capture screenshot",
            ),
        );

        await expect(
            screenshotRunner.run(
                createScreenshotNode(),
                context,
            ),
        ).rejects.toThrow(
            "Failed to capture screenshot",
        );

        expect(errorMock).toHaveBeenCalledTimes(
            1,
        );
    });

    it("throws when screenshot rejects with non-Error", async () => {
        screenshotMock.mockRejectedValueOnce(
            "Unknown error",
        );

        await expect(
            screenshotRunner.run(
                createScreenshotNode(),
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