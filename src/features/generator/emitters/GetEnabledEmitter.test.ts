import { describe, expect, it } from "vitest";

import { getEnabledEmitter } from "./GetEnabledEmitter";

import type {
    FlowNode,
    GetEnabledNodeData,
} from "../../flow/types/flowNode";

import type { GeneratorContext } from "../types/GeneratorContext";

const context: GeneratorContext = {
    framework: "selenium-python-mobile",
    indent: "    ",
    newline: "\n",
};

function createNode(): FlowNode & {
    data: GetEnabledNodeData;
} {
    return {
        id: "get-enabled-1",

        type: "default",

        position: {
            x: 0,
            y: 0,
        },

        data: {
            action: "getEnabled",

            title: "Get Enabled",

            subtitle: "",

            debug: {
                breakpoint: false,
            },

            locatorStrategy: "id",

            locator: "login_button",

            variableName: "isEnabled",
        },
    } as FlowNode & {
        data: GetEnabledNodeData;
    };
}

describe("GetEnabledEmitter", () => {
    it("generates get_enabled() with set_variable()", () => {
        const code =
            getEnabledEmitter.emit(
                createNode(),
                context,
            );

        expect(code).toBe(
            `set_variable(
    "isEnabled",
    get_enabled(
        AppiumBy.ID,
        "login_button",
    ),
)`,
        );
    });
});