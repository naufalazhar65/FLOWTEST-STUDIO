import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("../variables/resolveVariable", () => ({
    resolveVariables: vi.fn(),
}));

vi.mock("../utils/assertCompare", () => ({
    compare: vi.fn(),
}));

vi.mock("../services/executionLogger", () => ({
    executionLogger: {
        success: vi.fn(),
        error: vi.fn(),
    },
}));

import { compare } from "../utils/assertCompare";
import { executionLogger } from "../services/executionLogger";
import { resolveVariables } from "../variables/resolveVariable";

import { assertRunner } from "./AssertRunner";

import type { FlowNode } from "../../flow/types/flowNode";
import type { ExecutionContext } from "../types/ExecutionContext";

const context: ExecutionContext = {
    device: "Android",
    edges: [],
};

const resolveVariablesMock = vi.mocked(resolveVariables);
const compareMock = vi.mocked(compare);

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
            actual: "${actualMessage}",
            expected: "${expectedMessage}",
            operator: "equals",
        },
    } as FlowNode;
}

describe("AssertRunner", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("passes assertion", async () => {
        resolveVariablesMock.mockImplementation((value) => {
            if (value === "${actualMessage}") {
                return "Login Success";
            }

            if (value === "${expectedMessage}") {
                return "Login Success";
            }

            return value;
        });

        compareMock.mockReturnValue(true);

        await assertRunner.run(
            createAssertNode(),
            context,
        );

        expect(resolveVariablesMock).toHaveBeenCalledWith(
            "${actualMessage}",
        );

        expect(resolveVariablesMock).toHaveBeenCalledWith(
            "${expectedMessage}",
        );

        expect(compareMock).toHaveBeenCalledWith(
            "Login Success",
            "Login Success",
            "equals",
        );

        expect(executionLogger.success).toHaveBeenCalledTimes(1);
        expect(executionLogger.error).not.toHaveBeenCalled();
    });

    it("throws when assertion fails", async () => {
        resolveVariablesMock.mockImplementation((value) => {
            if (value === "${actualMessage}") {
                return "Login Failed";
            }

            if (value === "${expectedMessage}") {
                return "Login Success";
            }

            return value;
        });

        compareMock.mockReturnValue(false);

        await expect(
            assertRunner.run(
                createAssertNode(),
                context,
            ),
        ).rejects.toThrow("Assertion failed");

        expect(compareMock).toHaveBeenCalledWith(
            "Login Failed",
            "Login Success",
            "equals",
        );

        expect(executionLogger.error).toHaveBeenCalledTimes(1);
        expect(executionLogger.success).not.toHaveBeenCalled();
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
        expect(compareMock).not.toHaveBeenCalled();
    });
});