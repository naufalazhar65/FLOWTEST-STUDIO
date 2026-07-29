import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("../services/AppiumClient", () => ({
    appiumClient: {
        back: vi.fn(),
    },
}));

import { appiumClient } from "../services/AppiumClient";
import { backRunner } from "./BackRunner";

import type { ExecutionContext } from "../types/ExecutionContext";
import type { FlowNode } from "../../flow/types/flowNode";

const backMock = vi.mocked(appiumClient.back);

const context: ExecutionContext = {
    device: "Android",
    edges: [],
};

const node = {} as FlowNode;

describe("BackRunner", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("calls appiumClient.back", async () => {
        await backRunner.run(node, context);

        expect(backMock).toHaveBeenCalledTimes(1);
    });
});