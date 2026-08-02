import {
    describe,
    expect,
    it,
} from "vitest";

import { dragEmitter } from "./DragEmitter";

import type {
    DragNodeData,
    FlowNode,
} from "../../flow/types/flowNode";

import type { GeneratorContext } from "../types/GeneratorContext";

const context: GeneratorContext = {
    framework: "selenium-python-mobile",
    indent: "    ",
    newline: "\n",
};

function createNode(): FlowNode & {
    data: DragNodeData;
} {
    return {
        id: "drag-1",

        type: "default",

        position: {
            x: 0,
            y: 0,
        },

        data: {
            action: "drag",

            title: "Drag",

            subtitle: "",

            debug: {
                breakpoint: false,
            },

            locatorStrategy: "id",

            locator: "slider",

            direction: "right",

            distance: 400,

            duration: 800,
        },
    } as FlowNode & {
        data: DragNodeData;
    };
}

describe("DragEmitter", () => {
    it("generates python drag()", () => {
        const code =
            dragEmitter.emit(
                createNode(),
                context,
            );

        expect(code).toBe(
            `drag(
    AppiumBy.ID,
    "slider",
    "right",
    400,
    800,
)`
        );
    });
});