import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("../services/AppiumClient", () => ({
    appiumClient: {
        waitUntilElement: vi.fn(),
    },
}));

import { appiumClient } from "../services/AppiumClient";
import { waitRunner } from "./WaitRunner";

import type { ExecutionContext } from "../types/ExecutionContext";
import type { FlowNode } from "../../flow/types/flowNode";

const waitUntilElementMock = vi.mocked(
    appiumClient.waitUntilElement,
);

const context: ExecutionContext = {
    device: "Android",
    edges: [],
};

function createWaitNode(): FlowNode {
    return {
        id: "wait-1",
        type: "default",
        position: {
            x: 0,
            y: 0,
        },
        data: {
            action: "wait",
            title: "Wait",
            subtitle: "",
            debug: {
                breakpoint: false,
            },
            locatorStrategy: "id",
            locator: "login_button",
            timeout: 10000,
            pollingInterval: 500,
        },
    } as FlowNode;
}

describe("WaitRunner", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("calls appiumClient.waitUntilElement with node data", async () => {
        await waitRunner.run(
            createWaitNode(),
            context,
        );

        expect(waitUntilElementMock).toHaveBeenCalledTimes(1);

        expect(waitUntilElementMock).toHaveBeenCalledWith(
            "id",
            "login_button",
            10000,
            500,
        );
    });
});