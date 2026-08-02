import { describe, expect, it } from "vitest";

import { getRectEmitter } from "./GetRectEmitter";

import type {
    FlowNode,
    GetRectNodeData,
} from "../../flow/types/flowNode";

import type { GeneratorContext } from "../types/GeneratorContext";

const context: GeneratorContext = {
    framework: "selenium-python-mobile",
    indent: "    ",
    newline: "\n",
};

function createNode(): FlowNode & {
    data: GetRectNodeData;
} {
    return {
        id: "get-rect-1",

        type: "default",

        position: {
            x: 0,
            y: 0,
        },

        data: {
            action: "getRect",

            title: "Get Rect",

            subtitle: "",

            debug: {
                breakpoint: false,
            },

            locatorStrategy: "id",

            locator: "login_button",

            variableName: "rect",
        },
    } as FlowNode & {
        data: GetRectNodeData;
    };
}

describe("GetRectEmitter", () => {
    it("generates get_rect()", () => {
        const code = getRectEmitter.emit(
            createNode(),
            context,
        );

        expect(code).toBe(
            `variables["rect"] = get_rect(
    AppiumBy.ID,
    "login_button",
)`
        );
    });
});