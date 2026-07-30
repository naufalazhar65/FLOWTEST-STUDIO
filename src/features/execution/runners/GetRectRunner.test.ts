import { beforeEach, describe, expect, it, vi } from "vitest";

import type {
    FlowNode,
    GetRectNodeData,
} from "../../flow/types/flowNode";
import type { ExecutionContext } from "../types/ExecutionContext";

import { getRectRunner } from "./GetRectRunner";
import { appiumClient } from "../services/AppiumClient";
import { executeGetter } from "../utils/executeGetter";

vi.mock("../services/AppiumClient", () => ({
    appiumClient: {
        getRect: vi.fn(),
    },
}));

vi.mock("../utils/executeGetter", () => ({
    executeGetter: vi.fn(),
}));

describe("GetRectRunner", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    const context = {} as ExecutionContext;

    const node: FlowNode & {
        data: GetRectNodeData;
    } = {
        id: "node-1",
        type: "flowNode",
        position: {
            x: 0,
            y: 0,
        },
        data: {
            action: "getRect",
            title: "Get Rect",
            subtitle: "",
            debug: {
                breakpoint: false,
            },
            locatorStrategy: "id",
            locator: "login_button",
            variableName: "rect",
        },
    };

    it("should delegate execution to executeGetter()", async () => {
        vi.mocked(executeGetter).mockResolvedValue({
            outputs: ["next"],
        });

        await getRectRunner.run(node, context);

        expect(executeGetter).toHaveBeenCalledTimes(1);
    });

    it("should pass variable name and label", async () => {
        vi.mocked(executeGetter).mockResolvedValue({
            outputs: ["next"],
        });

        await getRectRunner.run(node, context);

        expect(executeGetter).toHaveBeenCalledWith(
            expect.any(Function),
            {
                variableName: "rect",
                label: "Rect",
            },
        );
    });

    it("should call appiumClient.getRect()", async () => {
        vi.mocked(appiumClient.getRect).mockResolvedValue({
            x: 120,
            y: 300,
            width: 180,
            height: 52,
        });

        vi.mocked(executeGetter).mockImplementation(
            async (getter) => {
                await getter();

                return {
                    outputs: ["next"],
                };
            },
        );

        await getRectRunner.run(node, context);

        expect(appiumClient.getRect).toHaveBeenCalledWith(
            "id",
            "login_button",
        );
    });
});