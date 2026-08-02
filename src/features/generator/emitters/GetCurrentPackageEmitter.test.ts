import { describe, expect, it } from "vitest";

import { getCurrentPackageEmitter } from "./GetCurrentPackageEmitter";

import type {
    FlowNode,
    GetCurrentPackageNodeData,
} from "../../flow/types/flowNode";

import type { GeneratorContext } from "../types/GeneratorContext";

const context: GeneratorContext = {
    framework: "selenium-python-mobile",
    indent: "    ",
    newline: "\n",
};

function createNode(): FlowNode & {
    data: GetCurrentPackageNodeData;
} {
    return {
        id: "get-current-package-1",

        type: "default",

        position: {
            x: 0,
            y: 0,
        },

        data: {
            action: "getCurrentPackage",

            title: "Get Current Package",

            subtitle: "",

            debug: {
                breakpoint: false,
            },

            variableName: "currentPackage",
        },
    } as FlowNode & {
        data: GetCurrentPackageNodeData;
    };
}

describe("GetCurrentPackageEmitter", () => {
    it("generates get_current_package()", () => {
        const code = getCurrentPackageEmitter.emit(
            createNode(),
            context,
        );

        expect(code).toBe(
`variables["currentPackage"] = get_current_package()`
        );
    });
});