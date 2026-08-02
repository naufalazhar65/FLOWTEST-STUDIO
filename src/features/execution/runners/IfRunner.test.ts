import {
    beforeEach,
    describe,
    expect,
    it,
    vi,
} from "vitest";

vi.mock("../services/executionLogger", () => ({
    executionLogger: {
        success: vi.fn(),
        warning: vi.fn(),
    },
}));

import { executionLogger } from "../services/executionLogger";
import { ifRunner } from "./IfRunner";

import {
    clearVariables,
    setVariable,
} from "../variables/VariableStore";

import type { ExecutionContext } from "../types/ExecutionContext";

import type {
    FlowNode,
    IfNodeData,
} from "../../flow/types/flowNode";

const context: ExecutionContext = {
    edges: [],
};

const successMock = vi.mocked(
    executionLogger.success,
);

const warningMock = vi.mocked(
    executionLogger.warning,
);

function createIfNode(): FlowNode & {
    data: IfNodeData;
} {
    return {
        id: "if-1",

        type: "default",

        position: {
            x: 0,
            y: 0,
        },

        data: {
            action: "if",

            title: "If",

            subtitle: "",

            debug: {
                breakpoint: false,
            },

            actual: "${status}",

            expected: "success",

            operator: "equals",
        },
    } as FlowNode & {
        data: IfNodeData;
    };
}

describe("IfRunner", () => {
    beforeEach(() => {
        clearVariables();
        vi.clearAllMocks();
    });

    it("returns true output", async () => {
        setVariable(
            "status",
            "success",
        );

        const result =
            await ifRunner.run(
                createIfNode(),
                context,
            );

        expect(result).toEqual({
            outputs: ["true"],
        });

        expect(successMock)
            .toHaveBeenCalledTimes(1);
    });

    it("returns false output", async () => {
        setVariable(
            "status",
            "failed",
        );

        const result =
            await ifRunner.run(
                createIfNode(),
                context,
            );

        expect(result).toEqual({
            outputs: ["false"],
        });

        expect(successMock)
            .toHaveBeenCalledTimes(1);
    });

    it("returns false when variable is missing", async () => {
        const result =
            await ifRunner.run(
                createIfNode(),
                context,
            );

        expect(result).toEqual({
            outputs: ["false"],
        });

        expect(successMock)
            .toHaveBeenCalledTimes(1);
    });

    it("returns immediately when action is not if", async () => {
        const node =
            createIfNode();

        node.data = {
            ...node.data,
            action: "tap",
        } as never;

        const result =
            await ifRunner.run(
                node,
                context,
            );

        expect(result)
            .toBeUndefined();

        expect(successMock)
            .not.toHaveBeenCalled();
    });

    it("returns false when variable is missing", async () => {
    const result =
        await ifRunner.run(
            createIfNode(),
            context,
        );

    expect(result).toEqual({
        outputs: ["false"],
    });

    expect(warningMock)
        .toHaveBeenCalledTimes(1);

    expect(successMock)
        .toHaveBeenCalledTimes(1);
});
});