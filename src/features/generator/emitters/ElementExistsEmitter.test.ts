import {
    describe,
    expect,
    it,
} from "vitest";

import { elementExistsEmitter } from "./ElementExistsEmitter";

import type {
    ElementExistsNodeData,
    FlowNode,
} from "../../flow/types/flowNode";

import type { GeneratorContext } from "../types/GeneratorContext";

const context: GeneratorContext = {
    framework: "selenium-python-mobile",
    indent: "    ",
    newline: "\n",
};

function createNode(): FlowNode & {
    data: ElementExistsNodeData;
} {
    return {
        id: "element-exists-1",

        type: "default",

        position: {
            x: 0,
            y: 0,
        },

        data: {
            action: "elementExists",

            title: "Element Exists",

            subtitle: "",

            debug: {
                breakpoint: false,
            },

            locatorStrategy: "id",

            locator: "login_button",

            variableName: "elementExists",
        },
    } as FlowNode & {
        data: ElementExistsNodeData;
    };
}

describe("ElementExistsEmitter", () => {
    it("generates element_exists() with set_variable()", () => {
        const code =
            elementExistsEmitter.emit(
                createNode(),
                context,
            );

        expect(code).toBe(
            `set_variable(
    "elementExists",
    element_exists(
        AppiumBy.ID,
        "login_button",
    ),
)`,
        );
    });
});