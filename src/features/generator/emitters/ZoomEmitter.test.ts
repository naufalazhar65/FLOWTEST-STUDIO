import { describe, expect, it } from "vitest";

import { zoomEmitter } from "./ZoomEmitter";

import type {
    FlowNode,
    ZoomNodeData,
} from "../../flow/types/flowNode";

import type { GeneratorContext } from "../types/GeneratorContext";

const context: GeneratorContext = {
    framework: "selenium-python-mobile",
    indent: "    ",
    newline: "\n",
};

function createNode(): FlowNode & {
    data: ZoomNodeData;
} {
    return {
        id: "zoom-1",

        type: "default",

        position: {
            x: 0,
            y: 0,
        },

        data: {
            action: "zoom",

            title: "Zoom",

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
        data: ZoomNodeData;
    };
}

describe("ZoomEmitter", () => {
    it("generates zoom()", () => {
        const code = zoomEmitter.emit(
            createNode(),
            context,
        );

        expect(code).toBe(
            `zoom(
    AppiumBy.ID,
    "image",
    0.8,
    500,
)`
        );
    });
});