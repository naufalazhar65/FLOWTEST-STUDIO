import { describe, expect, it } from "vitest";

import { getCurrentActivityEmitter } from "./GetCurrentActivityEmitter";

import type {
    FlowNode,
    GetCurrentActivityNodeData,
} from "../../flow/types/flowNode";

import type { GeneratorContext } from "../types/GeneratorContext";

const context: GeneratorContext = {
    framework: "selenium-python-mobile",
    indent: "    ",
    newline: "\n",
};

function createNode(): FlowNode & {
    data: GetCurrentActivityNodeData;
} {
    return {
        id: "get-current-activity-1",

        type: "default",

        position: {
            x: 0,
            y: 0,
        },

        data: {
            action: "getCurrentActivity",

            title: "Get Current Activity",

            subtitle: "",

            debug: {
                breakpoint: false,
            },

            variableName: "currentActivity",
        },
    } as FlowNode & {
        data: GetCurrentActivityNodeData;
    };
}

describe("GetCurrentActivityEmitter", () => {
    it("generates get_current_activity()", () => {
        const code = getCurrentActivityEmitter.emit(
            createNode(),
            context,
        );

        expect(code).toBe(
`variables["currentActivity"] = get_current_activity()`
        );
    });
});