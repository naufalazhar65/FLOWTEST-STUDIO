import { describe, expect, it } from "vitest";

import { swipeEmitter } from "./SwipeEmitter";

import type {
    FlowNode,
    SwipeNodeData,
} from "../../flow/types/flowNode";

import type { GeneratorContext } from "../types/GeneratorContext";

const context: GeneratorContext = {
    framework: "selenium-python-mobile",
    indent: "    ",
    newline: "\n",
};

function createNode(): FlowNode & {
    data: SwipeNodeData;
} {
    return {
        id: "swipe-1",

        type: "default",

        position: {
            x: 0,
            y: 0,
        },

        data: {
            action: "swipe",

            title: "Swipe",

            subtitle: "",

            debug: {
                breakpoint: false,
            },

            direction: "left",

            distance: 300,

            duration: 500,
        },
    } as FlowNode & {
        data: SwipeNodeData;
    };
}

describe("SwipeEmitter", () => {
    it("generates swipe()", () => {
        const code = swipeEmitter.emit(
            createNode(),
            context,
        );

        expect(code).toBe(
`swipe(
    "left",
    300,
    500,
)`
        );
    });
});