import {
    describe,
    expect,
    it,
} from "vitest";

import { doubleTapEmitter } from "./DoubleTapEmitter";

import type {
    DoubleTapNodeData,
    FlowNode,
} from "../../flow/types/flowNode";

import type { GeneratorContext } from "../types/GeneratorContext";

const context: GeneratorContext = {
    framework:
        "selenium-python-mobile",

    indent: "    ",

    newline: "\n",
};

function createNode(): FlowNode & {
    data: DoubleTapNodeData;
} {
    return {
        id: "double-tap-1",

        type: "default",

        position: {
            x: 0,
            y: 0,
        },

        data: {
            action: "doubleTap",

            title: "Double Tap",

            subtitle: "",

            debug: {
                breakpoint: false,
            },

            locatorStrategy: "id",

            locator: "login_button",
        },
    } as FlowNode & {
        data: DoubleTapNodeData;
    };
}

describe("DoubleTapEmitter", () => {
    it("generates python double_tap()", () => {
        const code =
            doubleTapEmitter.emit(
                createNode(),
                context,
            );

        expect(code).toBe(
            `double_tap(
    AppiumBy.ID,
    "login_button",
)`
        );
    });
});