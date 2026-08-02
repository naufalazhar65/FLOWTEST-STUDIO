import {
    describe,
    expect,
    it,
} from "vitest";

import { tapEmitter } from "./TapEmitter";

import type {
    FlowNode,
    TapNodeData,
} from "../../flow/types/flowNode";

import type { GeneratorContext } from "../types/GeneratorContext";

const context: GeneratorContext = {
    framework:
        "selenium-python-mobile",

    indent: "    ",

    newline: "\n",
};

function createTapNode(): FlowNode & {
    data: TapNodeData;
} {
    return {
        id: "tap-1",

        type: "default",

        position: {
            x: 0,
            y: 0,
        },

        data: {
            action: "tap",

            title: "Tap",

            subtitle: "",

            debug: {
                breakpoint: false,
            },

            locatorStrategy: "id",

            locator: "login_button",
        },
    } as FlowNode & {
        data: TapNodeData;
    };
}

describe("TapEmitter", () => {
    it("generates python tap command", () => {
        const code =
            tapEmitter.emit(
                createTapNode(),
                context,
            );

        expect(code).toBe(`
tap(
    AppiumBy.ID,
    "login_button",
)
`.trim());
    });
});