import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("../services/AppiumClient", () => ({
    appiumClient: {
        scroll: vi.fn(),
    },
}));

import { appiumClient } from "../services/appium/AppiumClient";
import { scrollRunner } from "./ScrollRunner";

import type { ExecutionContext } from "../types/ExecutionContext";
import type { FlowNode } from "../../flow/types/flowNode";

const scrollMock = vi.mocked(appiumClient.scroll);

const context: ExecutionContext = {
    device: "Android",
    edges: [],
};

function createScrollNode(): FlowNode {
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
            amount: 0.8,
        },
    } as FlowNode;
}

describe("ScrollRunner", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("calls appiumClient.scroll with node data", async () => {
        await scrollRunner.run(
            createScrollNode(),
            context,
        );

        expect(scrollMock).toHaveBeenCalledTimes(1);

        expect(scrollMock).toHaveBeenCalledWith(
            "down",
            0.8,
        );
    });
});