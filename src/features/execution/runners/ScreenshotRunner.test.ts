import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("../services/AppiumClient", () => ({
    appiumClient: {
        screenshot: vi.fn(),
    },
}));

import { appiumClient } from "../services/appium/AppiumClient";
import { screenshotRunner } from "./ScreenshotRunner";

import type { ExecutionContext } from "../types/ExecutionContext";
import type { FlowNode } from "../../flow/types/flowNode";

const screenshotMock = vi.mocked(
    appiumClient.screenshot,
);

const context: ExecutionContext = {
    device: "Android",
    edges: [],
};

function createScreenshotNode(): FlowNode {
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
    } as FlowNode;
}

describe("ScreenshotRunner", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("calls appiumClient.screenshot with file name", async () => {
        await screenshotRunner.run(
            createScreenshotNode(),
            context,
        );

        expect(screenshotMock).toHaveBeenCalledTimes(1);

        expect(screenshotMock).toHaveBeenCalledWith(
            "login-page.png",
        );
    });
});