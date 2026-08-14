import { describe, expect, it } from "vitest";

import { pinchEmitter } from "./PinchEmitter";

import type {
    FlowNode,
    PinchNodeData,
} from "../../flow/types/flowNode";

import type { GeneratorContext } from "../types/GeneratorContext";

const context: GeneratorContext = {
    framework: "selenium-python-mobile",
    indent: "    ",
    newline: "\n",
};

function createNode(): FlowNode & {
    data: PinchNodeData;
} {
    return {
        id: "pinch-1",

        type: "default",

        position: {
            x: 0,
            y: 0,
        },

        data: {
            action: "pinch",

            title: "Pinch",

            subtitle: "",

            debug: {
                breakpoint: false,
            },

            locatorStrategy: "id",

            locator: "image",

            percent: 0.8,

            duration: 500,
        },
    } as FlowNode & {
        data: PinchNodeData;
    };
}

describe("PinchEmitter", () => {
    it("generates pinch()", () => {
        const code = pinchEmitter.emit(
            createNode(),
            context,
        );

        expect(code).toBe(
            `pinch(
    AppiumBy.ID,
    "image",
    0.8,
    500,
)`
        );
    });
});