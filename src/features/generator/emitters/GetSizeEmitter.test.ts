import { describe, expect, it } from "vitest";

import { getSizeEmitter } from "./GetSizeEmitter";

import type {
    FlowNode,
    GetSizeNodeData,
} from "../../flow/types/flowNode";

import type { GeneratorContext } from "../types/GeneratorContext";

const context: GeneratorContext = {
    framework: "selenium-python-mobile",
    indent: "    ",
    newline: "\n",
};

function createNode(): FlowNode & {
    data: GetSizeNodeData;
} {
    return {
        id: "get-size-1",

        type: "default",

        position: {
            x: 0,
            y: 0,
        },

        data: {
            action: "getSize",

            title: "Get Size",

            subtitle: "",

            debug: {
                breakpoint: false,
            },

            locatorStrategy: "id",

            locator: "login_button",

            variableName: "size",
        },
    } as FlowNode & {
        data: GetSizeNodeData;
    };
}

describe("GetSizeEmitter", () => {
    it("generates get_size() with set_variable()", () => {
        const code =
            getSizeEmitter.emit(
                createNode(),
                context,
            );

        expect(code).toBe(
            `set_variable(
    "size",
    get_size(
        AppiumBy.ID,
        "login_button",
    ),
)`,
        );
    });
});