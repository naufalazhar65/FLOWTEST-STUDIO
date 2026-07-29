import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("../services/AppiumClient", () => ({
    appiumClient: {
        launchApp: vi.fn(),
    },
}));

import { appiumClient } from "../services/AppiumClient";
import { launchAppRunner } from "./LaunchAppRunner";

import type { ExecutionContext } from "../types/ExecutionContext";
import type { FlowNode } from "../../flow/types/flowNode";

const launchAppMock = vi.mocked(appiumClient.launchApp);

const context: ExecutionContext = {
    device: "Android",
    edges: [],
};

function createLaunchAppNode(): FlowNode {
    return {
        id: "launch-app-1",
        type: "default",
        position: {
            x: 0,
            y: 0,
        },
        data: {
            action: "launchApp",
            title: "Launch App",
            subtitle: "",
            debug: {
                breakpoint: false,
            },
            appPackage: "com.demo.app",
            appActivity: ".MainActivity",
            noReset: true,
        },
    } as FlowNode;
}

describe("LaunchAppRunner", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("calls appiumClient.launchApp with node data", async () => {
        await launchAppRunner.run(
            createLaunchAppNode(),
            context,
        );

        expect(launchAppMock).toHaveBeenCalledTimes(1);

        expect(launchAppMock).toHaveBeenCalledWith(
            "com.demo.app",
            ".MainActivity",
            true,
        );
    });
});