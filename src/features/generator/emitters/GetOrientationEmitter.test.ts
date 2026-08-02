import { describe, expect, it } from "vitest";

import { getOrientationEmitter } from "./GetOrientationEmitter";

import type {
    FlowNode,
    GetOrientationNodeData,
} from "../../flow/types/flowNode";

import type { GeneratorContext } from "../types/GeneratorContext";

const context: GeneratorContext = {
    framework: "selenium-python-mobile",
    indent: "    ",
    newline: "\n",
};

function createNode(): FlowNode & {
    data: GetOrientationNodeData;
} {
    return {
        id: "get-orientation-1",

        type: "default",

        position: {
            x: 0,
            y: 0,
        },

        data: {
            action: "getOrientation",

            title: "Get Orientation",

            subtitle: "",

            debug: {
                breakpoint: false,
            },

            variableName: "orientation",
        },
    } as FlowNode & {
        data: GetOrientationNodeData;
    };
}

describe("GetOrientationEmitter", () => {
    it("generates get_orientation()", () => {
        const code = getOrientationEmitter.emit(
            createNode(),
            context,
        );

        expect(code).toBe(
`variables["orientation"] = get_orientation()`
        );
    });
});