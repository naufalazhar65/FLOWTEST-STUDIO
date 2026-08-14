import {
    describe,
    expect,
    it,
} from "vitest";

import { hideKeyboardEmitter } from "./HideKeyboardEmitter";

import type {
    FlowNode,
    HideKeyboardNodeData,
} from "../../flow/types/flowNode";

import type { GeneratorContext } from "../types/GeneratorContext";

const context: GeneratorContext = {
    framework:
        "selenium-python-mobile",

    indent: "    ",

    newline: "\n",
};

function createNode(): FlowNode & {
    data: HideKeyboardNodeData;
} {
    return {
        id: "hide-keyboard-1",

        type: "default",

        position: {
            x: 0,
            y: 0,
        },

        data: {
            action: "hideKeyboard",

            title: "Hide Keyboard",

            subtitle: "",

            debug: {
                breakpoint: false,
            },
        },
    } as FlowNode & {
        data: HideKeyboardNodeData;
    };
}

describe("HideKeyboardEmitter", () => {
    it("generates hide_keyboard()", () => {
        const code =
            hideKeyboardEmitter.emit(
                createNode(),
                context,
            );

        expect(code).toBe(
            "hide_keyboard()",
        );
    });
});