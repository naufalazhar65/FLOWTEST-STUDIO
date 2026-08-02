import { describe, expect, it } from "vitest";

import { getDeviceNameEmitter } from "./GetDeviceNameEmitter";

import type {
    FlowNode,
    GetDeviceNameNodeData,
} from "../../flow/types/flowNode";

import type { GeneratorContext } from "../types/GeneratorContext";

const context: GeneratorContext = {
    framework: "selenium-python-mobile",
    indent: "    ",
    newline: "\n",
};

function createNode(): FlowNode & {
    data: GetDeviceNameNodeData;
} {
    return {
        id: "get-device-name-1",

        type: "default",

        position: {
            x: 0,
            y: 0,
        },

        data: {
            action: "getDeviceName",

            title: "Get Device Name",

            subtitle: "",

            debug: {
                breakpoint: false,
            },

            variableName: "deviceName",
        },
    } as FlowNode & {
        data: GetDeviceNameNodeData;
    };
}

describe("GetDeviceNameEmitter", () => {
    it("generates get_device_name()", () => {
        const code = getDeviceNameEmitter.emit(
            createNode(),
            context,
        );

        expect(code).toBe(
`variables["deviceName"] = get_device_name()`
        );
    });
});