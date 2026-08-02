import { describe, expect, it } from "vitest";

import { delayEmitter } from "./DelayEmitter";

import type {
    DelayNodeData,
    FlowNode,
} from "../../flow/types/flowNode";

import type { GeneratorContext } from "../types/GeneratorContext";

const context: GeneratorContext = {
    framework: "selenium-python-mobile",
    indent: "    ",
    newline: "\n",
};

function createNode(): FlowNode & {
    data: DelayNodeData;
} {
    return {
        id: "delay-1",

        type: "default",

        position: {
            x: 0,
            y: 0,
        },

        data: {
            action: "delay",

            title: "Delay",

            subtitle: "",

            debug: {
                breakpoint: false,
            },

            duration: 3000,
        },
    } as FlowNode & {
        data: DelayNodeData;
    };
}

describe("DelayEmitter", () => {
    it("generates delay()", () => {
        const code = delayEmitter.emit(
            createNode(),
            context,
        );

        expect(code).toBe(
            `delay(
    3000,
)`
        );
    });
});