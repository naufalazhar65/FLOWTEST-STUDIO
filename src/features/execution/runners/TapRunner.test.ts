import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("../services/AppiumClient", () => ({
    appiumClient: {
        tap: vi.fn(),
    },
}));

import { appiumClient } from "../services/appium/AppiumClient";
import { tapRunner } from "./TapRunner";

import type { FlowNode } from "../../flow/types/flowNode";
import type { ExecutionContext } from "../types/ExecutionContext";

const context: ExecutionContext = {
    device: "Android",
    edges: [],
};

const tapMock = vi.mocked(appiumClient.tap);

function createTapNode(): FlowNode {
    return {
        id: "tap-1",
        type: "default",
        position: {
            x: 0,
            y: 0,
        },
        data: {
            action: "tap",
            title: "Tap",
            subtitle: "",
            debug: {
                breakpoint: false,
            },
            locatorStrategy: "id",
            locator: "login_button",
        },
    } as FlowNode;
}

describe("TapRunner", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("calls appiumClient.tap", async () => {
        await tapRunner.run(
            createTapNode(),
            context,
        );

        expect(tapMock).toHaveBeenCalledTimes(1);

        expect(tapMock).toHaveBeenCalledWith(
            "id",
            "login_button",
        );
    });

    it("returns immediately when action is not tap", async () => {
        const node = createTapNode();

        node.data = {
            ...node.data,
            action: "input",
        } as never;

        const result = await tapRunner.run(
            node,
            context,
        );

        expect(result).toBeUndefined();
        expect(tapMock).not.toHaveBeenCalled();
    });
});