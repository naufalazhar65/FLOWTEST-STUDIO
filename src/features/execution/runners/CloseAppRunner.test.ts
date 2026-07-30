import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("../services/AppiumClient", () => ({
    appiumClient: {
        closeApp: vi.fn(),
    },
}));

import { appiumClient } from "../services/appium/AppiumClient";
import { closeAppRunner } from "./CloseAppRunner";

import type { ExecutionContext } from "../types/ExecutionContext";
import type { FlowNode } from "../../flow/types/flowNode";

const closeAppMock = vi.mocked(appiumClient.closeApp);

const context: ExecutionContext = {
    device: "Android",
    edges: [],
};

function createCloseAppNode(): FlowNode {
    return {
        id: "close-app-1",
        type: "default",
        position: {
            x: 0,
            y: 0,
        },
        data: {
            action: "closeApp",
            title: "Close App",
            subtitle: "",
            debug: {
                breakpoint: false,
            },
        },
    } as FlowNode;
}

describe("CloseAppRunner", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("calls appiumClient.closeApp", async () => {
        await closeAppRunner.run(
            createCloseAppNode(),
            context,
        );

        expect(closeAppMock).toHaveBeenCalledTimes(1);
    });
});