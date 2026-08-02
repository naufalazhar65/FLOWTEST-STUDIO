import {
    describe,
    expect,
    it,
} from "vitest";

import { longPressEmitter } from "./LongPressEmitter";

import type {
    FlowNode,
    LongPressNodeData,
} from "../../flow/types/flowNode";

import type { GeneratorContext } from "../types/GeneratorContext";

const context: GeneratorContext = {
    framework:
        "selenium-python-mobile",

    indent: "    ",

    newline: "\n",
};

function createNode(): FlowNode & {
    data: LongPressNodeData;
} {
    return {
        id: "long-press-1",

        type: "default",

        position: {
            x: 0,
            y: 0,
        },

        data: {
            action: "longPress",

            title: "Long Press",

            subtitle: "",

            debug: {
                breakpoint: false,
            },

            locatorStrategy: "id",

            locator: "login_button",

            duration: 1000,
        },
    } as FlowNode & {
        data: LongPressNodeData;
    };
}

describe("LongPressEmitter", () => {
    it("generates python long_press()", () => {
        const code =
            longPressEmitter.emit(
                createNode(),
                context,
            );

        expect(code).toBe(
            `long_press(
    AppiumBy.ID,
    "login_button",
    1000,
)`
        );
    });
});