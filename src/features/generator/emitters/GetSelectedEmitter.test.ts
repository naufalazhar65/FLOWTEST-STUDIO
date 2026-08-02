import { describe, expect, it } from "vitest";

import { getSelectedEmitter } from "./GetSelectedEmitter";

import type {
    FlowNode,
    GetSelectedNodeData,
} from "../../flow/types/flowNode";

import type { GeneratorContext } from "../types/GeneratorContext";

const context: GeneratorContext = {
    framework: "selenium-python-mobile",
    indent: "    ",
    newline: "\n",
};

function createNode(): FlowNode & {
    data: GetSelectedNodeData;
} {
    return {
        id: "get-selected-1",

        type: "default",

        position: {
            x: 0,
            y: 0,
        },

        data: {
            action: "getSelected",

            title: "Get Selected",

            subtitle: "",

            debug: {
                breakpoint: false,
            },

            locatorStrategy: "id",

            locator: "remember_me",

            variableName: "isSelected",
        },
    } as FlowNode & {
        data: GetSelectedNodeData;
    };
}

describe("GetSelectedEmitter", () => {
    it("generates get_selected()", () => {
        const code = getSelectedEmitter.emit(
            createNode(),
            context,
        );

        expect(code).toBe(
`variables["isSelected"] = get_selected(
    AppiumBy.ID,
    "remember_me",
)`
        );
    });
});