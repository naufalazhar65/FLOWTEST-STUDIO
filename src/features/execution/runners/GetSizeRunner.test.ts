import { beforeEach, describe, expect, it, vi } from "vitest";

import type {
    FlowNode,
    GetSizeNodeData,
} from "../../flow/types/flowNode";
import type { ExecutionContext } from "../types/ExecutionContext";

import { getSizeRunner } from "./GetSizeRunner";
import { appiumClient } from "../services/appium/AppiumClient";
import { executeGetter } from "../utils/executeGetter";

vi.mock("../services/AppiumClient", () => ({
    appiumClient: {
        getSize: vi.fn(),
    },
}));

vi.mock("../utils/executeGetter", () => ({
    executeGetter: vi.fn(),
}));

describe("GetSizeRunner", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    const context = {} as ExecutionContext;

    const node: FlowNode & {
        data: GetSizeNodeData;
    } = {
        id: "node-1",
        type: "flowNode",
        position: {
            x: 0,
            y: 0,
        },
        data: {
            action: "getSize",
            title: "Get Size",
            subtitle: "",
            debug: {
                breakpoint: false,
            },
            locatorStrategy: "id",
            locator: "login_button",
            variableName: "size",
        },
    };

    it("should delegate execution to executeGetter()", async () => {
        vi.mocked(executeGetter).mockResolvedValue({
            outputs: ["next"],
        });

        await getSizeRunner.run(node, context);

        expect(executeGetter).toHaveBeenCalledTimes(1);
    });

    it("should pass variable name and label", async () => {
        vi.mocked(executeGetter).mockResolvedValue({
            outputs: ["next"],
        });

        await getSizeRunner.run(node, context);

        expect(executeGetter).toHaveBeenCalledWith(
            expect.any(Function),
            {
                variableName: "size",
                label: "Size",
            },
        );
    });

    it("should call appiumClient.getSize()", async () => {
        vi.mocked(appiumClient.getSize).mockResolvedValue({
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

        await getSizeRunner.run(node, context);

        expect(appiumClient.getSize).toHaveBeenCalledWith(
            "id",
            "login_button",
        );
    });
});