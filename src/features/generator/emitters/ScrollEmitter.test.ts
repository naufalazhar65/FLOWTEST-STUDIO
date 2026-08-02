import { describe, expect, it } from "vitest";

import { scrollEmitter } from "./ScrollEmitter";

import type {
    FlowNode,
    ScrollNodeData,
} from "../../flow/types/flowNode";

import type { GeneratorContext } from "../types/GeneratorContext";

const context: GeneratorContext = {
    framework: "selenium-python-mobile",
    indent: "    ",
    newline: "\n",
};

function createNode(): FlowNode & {
    data: ScrollNodeData;
} {
    return {
        id: "scroll-1",

        type: "default",

        position: {
            x: 0,
            y: 0,
        },

        data: {
            action: "scroll",

            title: "Scroll",

            subtitle: "",

            debug: {
                breakpoint: false,
            },

            direction: "down",

            amount: 500,
        },
    } as FlowNode & {
        data: ScrollNodeData;
    };
}

describe("ScrollEmitter", () => {
    it("generates scroll()", () => {
        const code = scrollEmitter.emit(
            createNode(),
            context,
        );

        expect(code).toBe(
`scroll(
    "down",
    500,
)`
        );
    });
});