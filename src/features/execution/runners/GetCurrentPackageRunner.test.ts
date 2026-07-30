import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("../services/AppiumClient", () => ({
    appiumClient: {
        getCurrentPackage: vi.fn(),
    },
}));

import { appiumClient } from "../services/appium/AppiumClient";
import { getCurrentPackageRunner } from "./GetCurrentPackageRunner";

import type { ExecutionContext } from "../types/ExecutionContext";
import {
    clearVariables,
    getVariable,
} from "../variables/VariableStore";
import type {
    FlowNode,
    GetCurrentPackageNodeData,
} from "../../flow/types/flowNode";

const context: ExecutionContext = {
    device: "Android",
    edges: [],
};

const getCurrentPackageMock = vi.mocked(
    appiumClient.getCurrentPackage,
);

function createGetCurrentPackageNode(): FlowNode {
    return {
        id: "get-current-package-1",
        type: "default",
        position: {
            x: 0,
            y: 0,
        },
        data: {
            action: "getCurrentPackage",
            title: "Get Current Package",
            subtitle: "",
            debug: {
                breakpoint: false,
            },
            variableName: "currentPackage",
        },
    } as FlowNode;
}

describe("GetCurrentPackageRunner", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        clearVariables();
    });

    it("calls appiumClient.getCurrentPackage", async () => {
        getCurrentPackageMock.mockResolvedValue(
            "com.demo.app",
        );

        const result = await getCurrentPackageRunner.run(
            createGetCurrentPackageNode(),
            context,
        );

        expect(
            getCurrentPackageMock,
        ).toHaveBeenCalledTimes(1);

        expect(result).toEqual({
            outputs: ["next"],
        });
    });

    it("returns immediately when action is not getCurrentPackage", async () => {
        const node = createGetCurrentPackageNode();

        node.data = {
            ...node.data,
            action: "tap",
        } as never;

        const result = await getCurrentPackageRunner.run(
            node,
            context,
        );

        expect(result).toBeUndefined();

        expect(
            getCurrentPackageMock,
        ).not.toHaveBeenCalled();
    });

    it("stores package into VariableStore", async () => {
        getCurrentPackageMock.mockResolvedValue(
            "com.demo.app",
        );

        await getCurrentPackageRunner.run(
            createGetCurrentPackageNode(),
            context,
        );

        expect(
            getVariable("currentPackage"),
        ).toBe("com.demo.app");
    });

    it("does not store variable when variableName is empty", async () => {
        getCurrentPackageMock.mockResolvedValue(
            "com.demo.app",
        );

        const node = createGetCurrentPackageNode();

        (
            node.data as GetCurrentPackageNodeData
        ).variableName = "";

        await getCurrentPackageRunner.run(
            node,
            context,
        );

        expect(
            getVariable("currentPackage"),
        ).toBeUndefined();
    });
});