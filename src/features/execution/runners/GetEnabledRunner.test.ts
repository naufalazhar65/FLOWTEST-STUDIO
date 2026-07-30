import { beforeEach, describe, expect, it, vi } from "vitest";

import type {
    FlowNode,
    GetEnabledNodeData,
} from "../../flow/types/flowNode";
import type { ExecutionContext } from "../types/ExecutionContext";

import { getEnabledRunner } from "./GetEnabledRunner";
import { appiumClient } from "../services/AppiumClient";
import { executeGetter } from "../utils/executeGetter";

vi.mock("../services/AppiumClient", () => ({
    appiumClient: {
        isEnabled: vi.fn(),
    },
}));

vi.mock("../utils/executeGetter", () => ({
    executeGetter: vi.fn(),
}));

describe("GetEnabledRunner", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    const context = {} as ExecutionContext;

    const node: FlowNode & {
        data: GetEnabledNodeData;
    } = {
        id: "node-1",
        type: "flowNode",
        position: {
            x: 0,
            y: 0,
        },
        data: {
            action: "getEnabled",
            title: "Get Enabled",
            subtitle: "",
            debug: {
                breakpoint: false,
            },
            locatorStrategy: "id",
            locator: "login_button",
            variableName: "isEnabled",
        },
    };

    it("should delegate execution to executeGetter()", async () => {
        vi.mocked(executeGetter).mockResolvedValue({
            outputs: ["next"],
        });

        await getEnabledRunner.run(node, context);

        expect(executeGetter).toHaveBeenCalledTimes(1);
    });

    it("should pass variable name and label", async () => {
        vi.mocked(executeGetter).mockResolvedValue({
            outputs: ["next"],
        });

        await getEnabledRunner.run(node, context);

        expect(executeGetter).toHaveBeenCalledWith(
            expect.any(Function),
            {
                variableName: "isEnabled",
                label: "Element Enabled",
            }
        );
    });

    it("should call appiumClient.isEnabled()", async () => {
        vi.mocked(appiumClient.isEnabled).mockResolvedValue(true);

        vi.mocked(executeGetter).mockImplementation(async (getter) => {
            await getter();

            return {
                outputs: ["next"],
            };
        });

        await getEnabledRunner.run(node, context);

        expect(appiumClient.isEnabled).toHaveBeenCalledWith(
            "id",
            "login_button"
        );
    });

    it("returns undefined when action does not match", async () => {
        const result = await getEnabledRunner.run(
            {
                ...node,
                data: {
                    ...node.data,
                    action: "tap",
                },
            } as never,
            context
        );

        expect(result).toBeUndefined();
        expect(executeGetter).not.toHaveBeenCalled();
    });
});