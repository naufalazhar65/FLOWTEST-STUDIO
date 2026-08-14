import { describe, expect, it } from "vitest";

import { getAttributeEmitter } from "./GetAttributeEmitter";

import type {
    FlowNode,
    GetAttributeNodeData,
} from "../../flow/types/flowNode";

import type { GeneratorContext } from "../types/GeneratorContext";

const context: GeneratorContext = {
    framework: "selenium-python-mobile",
    indent: "    ",
    newline: "\n",
};

function createNode(): FlowNode & {
    data: GetAttributeNodeData;
} {
    return {
        id: "get-attribute-1",

        type: "default",

        position: {
            x: 0,
            y: 0,
        },

        data: {
            action: "getAttribute",

            title: "Get Attribute",

            subtitle: "",

            debug: {
                breakpoint: false,
            },

            locatorStrategy: "id",

            locator: "username",

            attribute: "content-desc",

            variableName: "usernameAttribute",
        },
    } as FlowNode & {
        data: GetAttributeNodeData;
    };
}

describe("GetAttributeEmitter", () => {
    it("generates get_attribute() with set_variable()", () => {
        const code =
            getAttributeEmitter.emit(
                createNode(),
                context,
            );

        expect(code).toBe(
            `set_variable(
    "usernameAttribute",
    get_attribute(
        AppiumBy.ID,
        "username",
        "content-desc",
    ),
)`,
        );
    });
});