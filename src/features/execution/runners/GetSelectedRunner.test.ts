import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("../services/appium/AppiumClient", () => ({
    appiumClient: {
        isSelected: vi.fn(),
    },
}));

vi.mock("../utils/storeResult", () => ({
    storeResult: vi.fn(),
}));

import { appiumClient } from "../services/appium/AppiumClient";
import { storeResult } from "../utils/storeResult";
import { getSelectedRunner } from "./GetSelectedRunner";

import type {
    FlowNode,
    GetSelectedNodeData,
} from "../../flow/types/flowNode";

import type { ExecutionContext } from "../types/ExecutionContext";

const context: ExecutionContext = {
    edges: [],
};

function createGetSelectedNode(): FlowNode & {
    data: GetSelectedNodeData;
} {
    return {
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
    } as FlowNode & {
        data: GetSelectedNodeData;
    };
}

describe("GetSelectedRunner", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("calls appiumClient.isSelected()", async () => {
        vi.mocked(
            appiumClient.isSelected,
        ).mockResolvedValue(true);

        await getSelectedRunner.run(
            createGetSelectedNode(),
            context,
        );

        expect(
            appiumClient.isSelected,
        ).toHaveBeenCalledWith(
            "id",
            "remember_me_checkbox",
        );
    });

    it("stores result into variable", async () => {
        vi.mocked(
            appiumClient.isSelected,
        ).mockResolvedValue(true);

        await getSelectedRunner.run(
            createGetSelectedNode(),
            context,
        );

        expect(storeResult).toHaveBeenCalledWith(
            "isSelected",
            true,
        );
    });

    it("returns next output", async () => {
        vi.mocked(
            appiumClient.isSelected,
        ).mockResolvedValue(true);

        const result =
            await getSelectedRunner.run(
                createGetSelectedNode(),
                context,
            );

        expect(result).toEqual({
            outputs: ["next"],
        });
    });

    it("returns undefined when action does not match", async () => {
        const result = await getSelectedRunner.run(
            {
                ...createGetSelectedNode(),
                data: {
                    ...createGetSelectedNode().data,
                    action: "tap",
                },
            } as never,
            context,
        );

        expect(result).toBeUndefined();

        expect(
            appiumClient.isSelected,
        ).not.toHaveBeenCalled();

        expect(storeResult).not.toHaveBeenCalled();
    });

    it("throws when appiumClient.isSelected throws Error", async () => {
        const error = new Error("Appium failed");

        vi.mocked(
            appiumClient.isSelected,
        ).mockRejectedValue(error);

        await expect(
            getSelectedRunner.run(
                createGetSelectedNode(),
                context,
            ),
        ).rejects.toThrow("Appium failed");

        expect(storeResult).not.toHaveBeenCalled();
    });

    it("throws when appiumClient.isSelected throws string", async () => {
        vi.mocked(
            appiumClient.isSelected,
        ).mockRejectedValue("Unknown error");

        await expect(
            getSelectedRunner.run(
                createGetSelectedNode(),
                context,
            ),
        ).rejects.toBe("Unknown error");

        expect(storeResult).not.toHaveBeenCalled();
    });
});