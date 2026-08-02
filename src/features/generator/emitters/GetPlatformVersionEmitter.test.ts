import { describe, expect, it } from "vitest";

import { getPlatformVersionEmitter } from "./GetPlatformVersionEmitter";

import type {
    FlowNode,
    GetPlatformVersionNodeData,
} from "../../flow/types/flowNode";

import type { GeneratorContext } from "../types/GeneratorContext";

const context: GeneratorContext = {
    framework: "selenium-python-mobile",
    indent: "    ",
    newline: "\n",
};

function createNode(): FlowNode & {
    data: GetPlatformVersionNodeData;
} {
    return {
        id: "get-platform-version-1",

        type: "default",

        position: {
            x: 0,
            y: 0,
        },

        data: {
            action: "getPlatformVersion",

            title: "Get Platform Version",

            subtitle: "",

            debug: {
                breakpoint: false,
            },

            variableName: "platformVersion",
        },
    } as FlowNode & {
        data: GetPlatformVersionNodeData;
    };
}

describe("GetPlatformVersionEmitter", () => {
    it("generates get_platform_version()", () => {
        const code = getPlatformVersionEmitter.emit(
            createNode(),
            context,
        );

        expect(code).toBe(
`variables["platformVersion"] = get_platform_version()`
        );
    });
});