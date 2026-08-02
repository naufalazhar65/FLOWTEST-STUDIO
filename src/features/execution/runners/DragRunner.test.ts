import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("../services/appium/AppiumClient", () => ({
    appiumClient: {
        drag: vi.fn(),
    },
}));

import { appiumClient } from "../services/appium/AppiumClient";
import { dragRunner } from "./DragRunner";

import type { FlowNode } from "../../flow/types/flowNode";
import type { ExecutionContext } from "../types/ExecutionContext";


const context: ExecutionContext = {
    edges: [],
};

const dragMock = vi.mocked(
    appiumClient.drag,
);

function createDragNode(): FlowNode {
    return {
        id: "drag-1",

        type: "default",

        position: {
            x: 0,
            y: 0,
        },

        data: {
            action: "drag",

            title: "Drag",

            subtitle: "",

            debug: {
                breakpoint: false,
            },

            locatorStrategy: "id",

            locator: "login_button",

            direction: "down",

            distance: 500,

            duration: 800,
        },
    } as FlowNode;
}

describe("DragRunner", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("calls appiumClient.drag", async () => {
        await dragRunner.run(
            createDragNode(),
            context,
        );

        expect(dragMock).toHaveBeenCalledTimes(1);

        expect(dragMock).toHaveBeenCalledWith(
            "id",
            "login_button",
            "down",
            500,
            800,
        );
    });

    it("returns immediately when action is not drag", async () => {
        const node = createDragNode();

        node.data = {
            ...node.data,
            action: "tap",
        } as never;

        const result =
            await dragRunner.run(
                node,
                context,
            );

        expect(result).toBeUndefined();

        expect(dragMock).not.toHaveBeenCalled();
    });

    it("throws when appiumClient.drag throws Error", async () => {
        const error = new Error("Drag failed");

        dragMock.mockRejectedValue(error);

        await expect(
            dragRunner.run(
                createDragNode(),
                context,
            ),
        ).rejects.toThrow("Drag failed");
    });

    it("throws when appiumClient.drag throws string", async () => {
        dragMock.mockRejectedValue("Unknown error");

        await expect(
            dragRunner.run(
                createDragNode(),
                context,
            ),
        ).rejects.toBe("Unknown error");
    });
});