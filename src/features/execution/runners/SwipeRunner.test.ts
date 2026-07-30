import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("../services/AppiumClient", () => ({
    appiumClient: {
        swipe: vi.fn(),
    },
}));

import { appiumClient } from "../services/appium/AppiumClient";
import { swipeRunner } from "./SwipeRunner";

import type { ExecutionContext } from "../types/ExecutionContext";
import type { FlowNode } from "../../flow/types/flowNode";

const swipeMock = vi.mocked(appiumClient.swipe);

const context: ExecutionContext = {
    device: "Android",
    edges: [],
};

function createSwipeNode(): FlowNode {
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
    } as FlowNode;
}

describe("SwipeRunner", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("calls appiumClient.swipe with node data", async () => {
        await swipeRunner.run(
            createSwipeNode(),
            context,
        );

        expect(swipeMock).toHaveBeenCalledTimes(1);

        expect(swipeMock).toHaveBeenCalledWith(
            "up",
            500,
            300,
        );
    });
});