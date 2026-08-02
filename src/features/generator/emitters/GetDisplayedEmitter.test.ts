import { describe, expect, it } from "vitest";

import { getDisplayedEmitter } from "./GetDisplayedEmitter";

import type {
    FlowNode,
    GetDisplayedNodeData,
} from "../../flow/types/flowNode";

import type { GeneratorContext } from "../types/GeneratorContext";

const context: GeneratorContext = {
    framework: "selenium-python-mobile",
    indent: "    ",
    newline: "\n",
};

function createNode(): FlowNode & {
    data: GetDisplayedNodeData;
} {
    return {
        id: "get-displayed-1",

        type: "default",

        position: {
            x: 0,
            y: 0,
        },

        data: {
            action: "getDisplayed",

            title: "Get Displayed",

            subtitle: "",

            debug: {
                breakpoint: false,
            },

            locatorStrategy: "id",

            locator: "login_button",

            variableName: "isDisplayed",
        },
    } as FlowNode & {
        data: GetDisplayedNodeData;
    };
}

describe("GetDisplayedEmitter", () => {
    it("generates get_displayed()", () => {
        const code = getDisplayedEmitter.emit(
            createNode(),
            context,
        );

        expect(code).toBe(
`variables["isDisplayed"] = get_displayed(
    AppiumBy.ID,
    "login_button",
)`
        );
    });
});