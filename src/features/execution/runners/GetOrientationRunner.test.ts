import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("../services/AppiumClient", () => ({
    appiumClient: {
        getOrientation: vi.fn(),
    },
}));

import { appiumClient } from "../services/AppiumClient";
import { getOrientationRunner } from "./GetOrientationRunner";

import type { ExecutionContext } from "../types/ExecutionContext";
import {
    clearVariables,
    getVariable,
} from "../variables/VariableStore";
import type {
    FlowNode,
    GetOrientationNodeData,
} from "../../flow/types/flowNode";

const context: ExecutionContext = {
    device: "Android",
    edges: [],
};

const getOrientationMock = vi.mocked(
    appiumClient.getOrientation,
);

function createGetOrientationNode(): FlowNode {
    return {
        id: "get-orientation-1",
        type: "default",
        position: {
            x: 0,
            y: 0,
        },
        data: {
            action: "getOrientation",
            title: "Get Orientation",
            subtitle: "",
            debug: {
                breakpoint: false,
            },
            variableName: "orientation",
        },
    } as FlowNode;
}

describe("GetOrientationRunner", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        clearVariables();
    });

    it("calls appiumClient.getOrientation", async () => {
        getOrientationMock.mockResolvedValue(
            "PORTRAIT",
        );

        const result = await getOrientationRunner.run(
            createGetOrientationNode(),
            context,
        );

        expect(
            getOrientationMock,
        ).toHaveBeenCalledTimes(1);

        expect(result).toEqual({
            outputs: ["next"],
        });
    });

    it("returns immediately when action is not getOrientation", async () => {
        const node = createGetOrientationNode();

        node.data = {
            ...node.data,
            action: "tap",
        } as never;

        const result = await getOrientationRunner.run(
            node,
            context,
        );

        expect(result).toBeUndefined();

        expect(
            getOrientationMock,
        ).not.toHaveBeenCalled();
    });

    it("stores orientation into VariableStore", async () => {
        getOrientationMock.mockResolvedValue(
            "PORTRAIT",
        );

        await getOrientationRunner.run(
            createGetOrientationNode(),
            context,
        );

        expect(
            getVariable("orientation"),
        ).toBe("PORTRAIT");
    });

    it("does not store variable when variableName is empty", async () => {
        getOrientationMock.mockResolvedValue(
            "PORTRAIT",
        );

        const node = createGetOrientationNode();

        (
            node.data as GetOrientationNodeData
        ).variableName = "";

        await getOrientationRunner.run(
            node,
            context,
        );

        expect(
            getVariable("orientation"),
        ).toBeUndefined();
    });
});