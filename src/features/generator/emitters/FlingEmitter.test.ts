import {
    describe,
    expect,
    it,
} from "vitest";

import { flingEmitter } from "./FlingEmitter";

import type {
    FlingNodeData,
    FlowNode,
} from "../../flow/types/flowNode";

import type { GeneratorContext } from "../types/GeneratorContext";

const context: GeneratorContext = {
    framework: "selenium-python-mobile",
    indent: "    ",
    newline: "\n",
};

function createNode(): FlowNode & {
    data: FlingNodeData;
} {
    return {
        id: "fling-1",

        type: "default",

        position: {
            x: 0,
            y: 0,
        },

        data: {
            action: "fling",

            title: "Fling",

            subtitle: "",

            debug: {
                breakpoint: false,
            },

            locatorStrategy: "id",

            locator: "scroll_container",

            direction: "up",

            speed: 5000,
        },
    } as FlowNode & {
        data: FlingNodeData;
    };
}

describe("FlingEmitter", () => {
    it("generates fling()", () => {
        const code =
            flingEmitter.emit(
                createNode(),
                context,
            );

        expect(code).toBe(
            `fling(
    AppiumBy.ID,
    "scroll_container",
    "up",
    5000,
)`
        );
    });
});