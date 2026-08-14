import { describe, expect, it } from "vitest";

import { getTextEmitter } from "./GetTextEmitter";

import type {
    FlowNode,
    GetTextNodeData,
} from "../../flow/types/flowNode";

import type { GeneratorContext } from "../types/GeneratorContext";

const context: GeneratorContext = {
    framework: "selenium-python-mobile",
    indent: "    ",
    newline: "\n",
};

function createNode(): FlowNode & {
    data: GetTextNodeData;
} {
    return {
        id: "get-text-1",

        type: "default",

        position: {
            x: 0,
            y: 0,
        },

        data: {
            action: "getText",

            title: "Get Text",

            subtitle: "",

            debug: {
                breakpoint: false,
            },

            locatorStrategy: "id",

            locator: "login_button",

            variableName: "text",
        },
    } as FlowNode & {
        data: GetTextNodeData;
    };
}

describe("GetTextEmitter", () => {
    it("generates get_text() with set_variable()", () => {
        const code = getTextEmitter.emit(
            createNode(),
            context,
        );

        expect(code).toBe(
            `set_variable(
    "text",
    get_text(
        AppiumBy.ID,
        "login_button",
    ),
)`,
        );
    });
});