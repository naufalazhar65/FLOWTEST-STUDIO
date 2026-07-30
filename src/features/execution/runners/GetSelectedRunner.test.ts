import { beforeEach, describe, expect, it, vi } from "vitest";

import type {
    FlowNode,
    GetSelectedNodeData,
} from "../../flow/types/flowNode";
import type { ExecutionContext } from "../types/ExecutionContext";

import { getSelectedRunner } from "./GetSelectedRunner";
import { appiumClient } from "../services/AppiumClient";
import { executeGetter } from "../utils/executeGetter";

vi.mock("../services/AppiumClient", () => ({
    appiumClient: {
        isSelected: vi.fn(),
    },
}));

vi.mock("../utils/executeGetter", () => ({
    executeGetter: vi.fn(),
}));

describe("GetSelectedRunner", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    const context = {} as ExecutionContext;

    const node: FlowNode & {
        data: GetSelectedNodeData;
    } = {
        id: "node-1",
        type: "flowNode",
        position: {
            x: 0,
            y: 0,
        },
        data: {
            action: "getSelected",
            title: "Get Selected",
            subtitle: "",
            debug: {
                breakpoint: false,
            },
            locatorStrategy: "id",
            locator: "remember_me_checkbox",
            variableName: "isSelected",
        },
    };

    it("should delegate execution to executeGetter()", async () => {
        vi.mocked(executeGetter).mockResolvedValue({
            outputs: ["next"],
        });

        await getSelectedRunner.run(node, context);

        expect(executeGetter).toHaveBeenCalledTimes(1);
    });

    it("should pass variable name and label", async () => {
        vi.mocked(executeGetter).mockResolvedValue({
            outputs: ["next"],
        });

        await getSelectedRunner.run(node, context);

        expect(executeGetter).toHaveBeenCalledWith(
            expect.any(Function),
            {
                variableName: "isSelected",
                label: "Element Selected",
            }
        );
    });

    it("should call appiumClient.isSelected()", async () => {
        vi.mocked(appiumClient.isSelected).mockResolvedValue(true);

        vi.mocked(executeGetter).mockImplementation(async (getter) => {
            await getter();

            return {
                outputs: ["next"],
            };
        });

        await getSelectedRunner.run(node, context);

        expect(appiumClient.isSelected).toHaveBeenCalledWith(
            "id",
            "remember_me_checkbox"
        );
    });

    it("returns undefined when action does not match", async () => {
    const result = await getSelectedRunner.run(
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