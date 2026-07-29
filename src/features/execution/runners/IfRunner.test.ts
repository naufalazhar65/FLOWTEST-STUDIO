import { beforeEach, describe, expect, it } from "vitest";

import { ifRunner } from "./IfRunner";
import { clearVariables, setVariable } from "../variables/VariableStore";

import type { FlowNode } from "../../flow/types/flowNode";
import type { ExecutionContext } from "../types/ExecutionContext";

const context = {
    device: "Android",
    edges: [],
    services: {
        driver: {} as never,
        logger: {} as never,
        variables: {} as never,
    },
} as ExecutionContext;

function createTapNode(): FlowNode {
    return {
        ...createIfNode('${status} === "success"'),
        data: {
            ...createIfNode('${status} === "success"').data,
            action: "tap",
        },
    } as FlowNode;
}

function createIfNode(
    condition: string
): FlowNode {
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
            condition,
        },
    } as FlowNode;
}

describe("IfRunner", () => {
    beforeEach(() => {
        clearVariables();
    });

    it("returns true output", async () => {
        setVariable(
            "status",
            "success"
        );

        const result =
            await ifRunner.run(
                createIfNode(
                    '${status} === "success"'
                ),
                context
            );

        expect(result).toEqual({
            outputs: ["true"],
        });
    });

    it("returns false output", async () => {
        setVariable(
            "status",
            "failed"
        );

        const result =
            await ifRunner.run(
                createIfNode(
                    '${status} === "success"'
                ),
                context
            );

        expect(result).toEqual({
            outputs: ["false"],
        });
    });

    it("returns false for invalid expression", async () => {
        const result =
            await ifRunner.run(
                createIfNode(
                    "${status} =="
                ),
                context
            );

        expect(result).toEqual({
            outputs: ["false"],
        });
    });

    it("returns undefined when action is not if", async () => {
        const result = await ifRunner.run(
            createTapNode(),
            context,
        );

        expect(result).toBeUndefined();
    });
});