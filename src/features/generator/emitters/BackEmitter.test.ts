import { describe, expect, it } from "vitest";

import { backEmitter } from "./BackEmitter";

import type {
    BackNodeData,
    FlowNode,
} from "../../flow/types/flowNode";

import type { GeneratorContext } from "../types/GeneratorContext";

const context: GeneratorContext = {
    framework: "selenium-python-mobile",
    indent: "    ",
    newline: "\n",
};

function createNode(): FlowNode & {
    data: BackNodeData;
} {
    return {
        id: "back-1",

        type: "default",

        position: {
            x: 0,
            y: 0,
        },

        data: {
            action: "back",

            title: "Back",

            subtitle: "",

            debug: {
                breakpoint: false,
            },
        },
    } as FlowNode & {
        data: BackNodeData;
    };
}

describe("BackEmitter", () => {
    it("generates back()", () => {
        const code = backEmitter.emit(
            createNode(),
            context,
        );

        expect(code).toBe(
            `back()`
        );
    });
});