import { describe, expect, it } from "vitest";

import { getLocationEmitter } from "./GetLocationEmitter";

import type {
    FlowNode,
    GetLocationNodeData,
} from "../../flow/types/flowNode";

import type { GeneratorContext } from "../types/GeneratorContext";

const context: GeneratorContext = {
    framework: "selenium-python-mobile",
    indent: "    ",
    newline: "\n",
};

function createNode(): FlowNode & {
    data: GetLocationNodeData;
} {
    return {
        id: "get-location-1",

        type: "default",

        position: {
            x: 0,
            y: 0,
        },

        data: {
            action: "getLocation",

            title: "Get Location",

            subtitle: "",

            debug: {
                breakpoint: false,
            },

            locatorStrategy: "id",

            locator: "login_button",

            variableName: "location",
        },
    } as FlowNode & {
        data: GetLocationNodeData;
    };
}

describe("GetLocationEmitter", () => {
    it("generates get_location()", () => {
        const code = getLocationEmitter.emit(
            createNode(),
            context,
        );

        expect(code).toBe(
`variables["location"] = get_location(
    AppiumBy.ID,
    "login_button",
)`
        );
    });
});