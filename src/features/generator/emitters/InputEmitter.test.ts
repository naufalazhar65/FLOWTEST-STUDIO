import {
    describe,
    expect,
    it,
} from "vitest";

import { inputEmitter } from "./InputEmitter";

import type {
    FlowNode,
    InputNodeData,
} from "../../flow/types/flowNode";

import type { GeneratorContext } from "../types/GeneratorContext";

const context: GeneratorContext = {
    framework:
        "selenium-python-mobile",

    indent: "    ",

    newline: "\n",
};

function createNode(): FlowNode & {
    data: InputNodeData;
} {
    return {
        id: "input-1",

        type: "default",

        position: {
            x: 0,
            y: 0,
        },

        data: {
            action: "input",

            title: "Input",

            subtitle: "",

            debug: {
                breakpoint: false,
            },

            locatorStrategy: "id",

            locator: "username",

            text: "admin",
        },
    } as FlowNode & {
        data: InputNodeData;
    };
}

describe("InputEmitter", () => {
    it("generates python input()", () => {
        const code =
            inputEmitter.emit(
                createNode(),
                context,
            );

        expect(code).toBe(
    `input_text(
    AppiumBy.ID,
    "username",
    "admin",
)`
        );
    });
});