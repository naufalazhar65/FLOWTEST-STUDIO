import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("../services/AppiumClient", () => ({
    appiumClient: {
        home: vi.fn(),
    },
}));

import { appiumClient } from "../services/appium/AppiumClient";
import { homeRunner } from "./HomeRunner";

import type { ExecutionContext } from "../types/ExecutionContext";
import type { FlowNode } from "../../flow/types/flowNode";

const homeMock = vi.mocked(appiumClient.home);

const context: ExecutionContext = {
    device: "Android",
    edges: [],
};

const node = {} as FlowNode;

describe("HomeRunner", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("calls appiumClient.home", async () => {
        await homeRunner.run(node, context);

        expect(homeMock).toHaveBeenCalledTimes(1);
    });
});