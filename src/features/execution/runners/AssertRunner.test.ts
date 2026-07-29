import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("../services/AppiumClient", () => ({
    appiumClient: {
        assert: vi.fn(),
    },
}));

vi.mock("../variables/resolveVariable", () => ({
    resolveVariables: vi.fn(),
}));

import { appiumClient } from "../services/AppiumClient";
import { resolveVariables } from "../variables/resolveVariable";
import { assertRunner } from "./AssertRunner";

import type { FlowNode } from "../../flow/types/flowNode";
import type { ExecutionContext } from "../types/ExecutionContext";

const context: ExecutionContext = {
    device: "Android",
    edges: [],
};

const assertMock = vi.mocked(appiumClient.assert);
const resolveVariablesMock = vi.mocked(resolveVariables);

function createAssertNode(): FlowNode {
    return {
        id: "assert-1",
        type: "default",
        position: {
            x: 0,
            y: 0,
        },
        data: {
            action: "assert",
            title: "Assert",
            subtitle: "",
            debug: {
                breakpoint: false,
            },
            locatorStrategy: "id",
            locator: "message",
            expected: "${expectedMessage}",
        },
    } as FlowNode;
}

describe("AssertRunner", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("calls appiumClient.assert with resolved expected value", async () => {
        resolveVariablesMock.mockReturnValue("Login Success");

        await assertRunner.run(
            createAssertNode(),
            context,
        );

        expect(resolveVariablesMock).toHaveBeenCalledWith(
            "${expectedMessage}",
        );

        expect(assertMock).toHaveBeenCalledTimes(1);

        expect(assertMock).toHaveBeenCalledWith(
            "id",
            "message",
            "Login Success",
        );
    });

    it("returns immediately when action is not assert", async () => {
        const node = createAssertNode();

        node.data = {
            ...node.data,
            action: "tap",
        } as never;

        const result = await assertRunner.run(
            node,
            context,
        );

        expect(result).toBeUndefined();

        expect(resolveVariablesMock).not.toHaveBeenCalled();
        expect(assertMock).not.toHaveBeenCalled();
    });
});