import {
    describe,
    expect,
    it,
} from "vitest";

import {
    getDeviceTimeEmitter,
} from "./GetDeviceTimeEmitter";

import type {
    FlowNode,
    GetDeviceTimeNodeData,
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
    variableName = "deviceTime",
): FlowNode & {
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

            variableName,
        },
    } as FlowNode & {
        data: GetDeviceTimeNodeData;
    };
}

describe(
    "GetDeviceTimeEmitter",
    () => {
        it(
            "generates get_device_time()",
            () => {
                const code =
                    getDeviceTimeEmitter.emit(
                        createNode(),
                        context,
                    );

                expect(code).toBe(
                    `variables["deviceTime"] = get_device_time()`,
                );
            },
        );

        it(
            "supports a custom variable name",
            () => {
                const code =
                    getDeviceTimeEmitter.emit(
                        createNode(
                            "time",
                        ),
                        context,
                    );

                expect(code).toBe(
                    `variables["time"] = get_device_time()`,
                );
            },
        );

        it(
            "supports camelCase variable names",
            () => {
                const code =
                    getDeviceTimeEmitter.emit(
                        createNode(
                            "currentDeviceTime",
                        ),
                        context,
                    );

                expect(code).toBe(
                    `variables["currentDeviceTime"] = get_device_time()`,
                );
            },
        );

        it(
            "supports underscore variable names",
            () => {
                const code =
                    getDeviceTimeEmitter.emit(
                        createNode(
                            "device_time",
                        ),
                        context,
                    );

                expect(code).toBe(
                    `variables["device_time"] = get_device_time()`,
                );
            },
        );

        it(
            "escapes double quotes in variable name",
            () => {
                const code =
                    getDeviceTimeEmitter.emit(
                        createNode(
                            'device"time',
                        ),
                        context,
                    );

                expect(code).toBe(
                    `variables["device\\"time"] = get_device_time()`,
                );
            },
        );

        it(
            "supports an empty variable name",
            () => {
                const code =
                    getDeviceTimeEmitter.emit(
                        createNode(""),
                        context,
                    );

                expect(code).toBe(
                    `variables[""] = get_device_time()`,
                );
            },
        );

        it(
            "does not generate unexpected arguments",
            () => {
                const code =
                    getDeviceTimeEmitter.emit(
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
                    getDeviceTimeEmitter.emit(
                        createNode(),
                        context,
                    );

                expect(
                    code.split("\n"),
                ).toHaveLength(1);

                expect(code).toBe(
                    `variables["deviceTime"] = get_device_time()`,
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
                    getDeviceTimeEmitter.emit(
                        node,
                        context,
                    );

                expect(code).toBe(
                    `variables["deviceTime"] = get_device_time()`,
                );
            },
        );

        it(
            "produces the same output consistently",
            () => {
                const first =
                    getDeviceTimeEmitter.emit(
                        createNode(),
                        context,
                    );

                const second =
                    getDeviceTimeEmitter.emit(
                        createNode(),
                        context,
                    );

                expect(first).toBe(
                    second,
                );

                expect(first).toBe(
                    `variables["deviceTime"] = get_device_time()`,
                );
            },
        );
    },
);