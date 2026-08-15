import {
    describe,
    expect,
    it,
} from "vitest";

import {
    getDeviceNameEmitter,
} from "./GetDeviceNameEmitter";

import type {
    FlowNode,
    GetDeviceNameNodeData,
} from "../../flow/types/flowNode";

import type {
    GeneratorContext,
} from "../types/GeneratorContext";

const context: GeneratorContext = {
    framework:
        "selenium-python-mobile",

    indent: "    ",

    newline: "\n",
};

function createNode(
    variableName = "deviceName",
): FlowNode & {
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

            variableName,
        },
    } as FlowNode & {
        data: GetDeviceNameNodeData;
    };
}

describe(
    "GetDeviceNameEmitter",
    () => {
        it(
            "generates get_device_name()",
            () => {
                const code =
                    getDeviceNameEmitter.emit(
                        createNode(),
                        context,
                    );

                expect(code).toBe(
                    `variables["deviceName"] = get_device_name()`,
                );
            },
        );

        it(
            "supports a custom variable name",
            () => {
                const code =
                    getDeviceNameEmitter.emit(
                        createNode(
                            "device",
                        ),
                        context,
                    );

                expect(code).toBe(
                    `variables["device"] = get_device_name()`,
                );
            },
        );

        it(
            "supports camelCase variable names",
            () => {
                const code =
                    getDeviceNameEmitter.emit(
                        createNode(
                            "currentDeviceName",
                        ),
                        context,
                    );

                expect(code).toBe(
                    `variables["currentDeviceName"] = get_device_name()`,
                );
            },
        );

        it(
            "supports underscore variable names",
            () => {
                const code =
                    getDeviceNameEmitter.emit(
                        createNode(
                            "device_name",
                        ),
                        context,
                    );

                expect(code).toBe(
                    `variables["device_name"] = get_device_name()`,
                );
            },
        );

        it(
            "escapes double quotes in variable name",
            () => {
                const code =
                    getDeviceNameEmitter.emit(
                        createNode(
                            'device"Name',
                        ),
                        context,
                    );

                expect(code).toBe(
                    `variables["device\\"Name"] = get_device_name()`,
                );
            },
        );

        it(
            "supports an empty variable name",
            () => {
                const code =
                    getDeviceNameEmitter.emit(
                        createNode(""),
                        context,
                    );

                expect(code).toBe(
                    `variables[""] = get_device_name()`,
                );
            },
        );

        it(
            "does not generate unexpected arguments",
            () => {
                const code =
                    getDeviceNameEmitter.emit(
                        createNode(),
                        context,
                    );

                expect(code).not.toContain(
                    "AppiumBy",
                );

                expect(code).not.toContain(
                    "True",
                );

                expect(code).not.toContain(
                    "False",
                );

                expect(code).not.toContain(
                    "None",
                );
            },
        );

        it(
            "produces a single assignment statement",
            () => {
                const code =
                    getDeviceNameEmitter.emit(
                        createNode(),
                        context,
                    );

                expect(
                    code.split("\n"),
                ).toHaveLength(1);

                expect(code).toBe(
                    `variables["deviceName"] = get_device_name()`,
                );
            },
        );

        it(
            "is independent of node position",
            () => {
                const node =
                    createNode();

                node.position = {
                    x: 500,
                    y: 300,
                };

                const code =
                    getDeviceNameEmitter.emit(
                        node,
                        context,
                    );

                expect(code).toBe(
                    `variables["deviceName"] = get_device_name()`,
                );
            },
        );

        it(
            "produces the same output consistently",
            () => {
                const first =
                    getDeviceNameEmitter.emit(
                        createNode(),
                        context,
                    );

                const second =
                    getDeviceNameEmitter.emit(
                        createNode(),
                        context,
                    );

                expect(first).toBe(
                    second,
                );

                expect(first).toBe(
                    `variables["deviceName"] = get_device_name()`,
                );
            },
        );
    },
);