import {
    describe,
    expect,
    it,
} from "vitest";

import { pressReturnEmitter } from "./PressReturnEmitter";

import type {
    FlowNode,
    PressReturnNodeData,
} from "../../flow/types/flowNode";

import type { GeneratorContext } from "../types/GeneratorContext";

const context: GeneratorContext = {
    framework:
        "selenium-python-mobile",

    indent: "    ",

    newline: "\n",
};

function createNode(): FlowNode & {
    data: PressReturnNodeData;
} {
    return {
        id: "press-return-1",

        type: "default",

        position: {
            x: 0,
            y: 0,
        },

        data: {
            action: "pressReturn",

            title: "Press Return",

            subtitle: "",

            debug: {
                breakpoint: false,
            },
        },
    } as FlowNode & {
        data: PressReturnNodeData;
    };
}

describe("PressReturnEmitter", () => {
    it("generates press_return()", () => {
        const code =
            pressReturnEmitter.emit(
                createNode(),
                context,
            );

        expect(code).toBe(
            "press_return()",
        );
    });
});