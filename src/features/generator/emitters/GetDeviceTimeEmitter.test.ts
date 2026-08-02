import { describe, expect, it } from "vitest";

import { getDeviceTimeEmitter } from "./GetDeviceTimeEmitter";

import type {
    FlowNode,
    GetDeviceTimeNodeData,
} from "../../flow/types/flowNode";

import type { GeneratorContext } from "../types/GeneratorContext";

const context: GeneratorContext = {
    framework: "selenium-python-mobile",
    indent: "    ",
    newline: "\n",
};

function createNode(): FlowNode & {
    data: GetDeviceTimeNodeData;
} {
    return {
        id: "get-device-time-1",

        type: "default",

        position: {
            x: 0,
            y: 0,
        },

        data: {
            action: "getDeviceTime",

            title: "Get Device Time",

            subtitle: "",

            debug: {
                breakpoint: false,
            },

            variableName: "deviceTime",
        },
    } as FlowNode & {
        data: GetDeviceTimeNodeData;
    };
}

describe("GetDeviceTimeEmitter", () => {
    it("generates get_device_time()", () => {
        const code = getDeviceTimeEmitter.emit(
            createNode(),
            context,
        );

        expect(code).toBe(
            `variables["deviceTime"] = get_device_time()`
        );
    });
});