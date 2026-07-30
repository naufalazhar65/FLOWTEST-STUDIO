import { beforeEach, describe, expect, it, vi } from "vitest";

import type {
    FlowNode,
    GetDisplayedNodeData,
} from "../../flow/types/flowNode";
import type { ExecutionContext } from "../types/ExecutionContext";

import { getDisplayedRunner } from "./GetDisplayedRunner";
import { appiumClient } from "../services/appium/AppiumClient";
import { executeGetter } from "../utils/executeGetter";

vi.mock("../services/AppiumClient", () => ({
    appiumClient: {
        isDisplayed: vi.fn(),
    },
}));

vi.mock("../utils/executeGetter", () => ({
    executeGetter: vi.fn(),
}));

describe("GetDisplayedRunner", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    const context = {} as ExecutionContext;

    const node: FlowNode & {
        data: GetDisplayedNodeData;
    } = {
        id: "node-1",
        type: "flowNode",
        position: {
            x: 0,
            y: 0,
        },
        data: {
            action: "getDisplayed",
            title: "Get Displayed",
            subtitle: "",
            debug: {
                breakpoint: false,
            },
            locatorStrategy: "id",
            locator: "login_button",
            variableName: "isVisible",
        },
    };

    it("should delegate execution to executeGetter()", async () => {
        vi.mocked(executeGetter).mockResolvedValue({
            outputs: ["next"],
        });

        await getDisplayedRunner.run(node, context);

        expect(executeGetter).toHaveBeenCalledTimes(1);
    });

    it("should pass variable name and label", async () => {
        vi.mocked(executeGetter).mockResolvedValue({
            outputs: ["next"],
        });

        await getDisplayedRunner.run(node, context);

        expect(executeGetter).toHaveBeenCalledWith(
            expect.any(Function),
            {
                variableName: "isVisible",
                label: "Element Displayed",
            }
        );
    });

    it("should call appiumClient.isDisplayed()", async () => {
        vi.mocked(appiumClient.isDisplayed).mockResolvedValue(
            true
        );

        vi.mocked(executeGetter).mockImplementation(
            async (getter) => {
                await getter();

                return {
                    outputs: ["next"],
                };
            }
        );

        await getDisplayedRunner.run(node, context);

        expect(appiumClient.isDisplayed).toHaveBeenCalledWith(
            "id",
            "login_button"
        );
    });
});