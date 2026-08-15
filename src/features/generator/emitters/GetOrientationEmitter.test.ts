import {
    describe,
    expect,
    it,
} from "vitest";

import {
    getOrientationEmitter,
} from "./GetOrientationEmitter";

import type {
    FlowNode,
    GetOrientationNodeData,
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
    variableName = "orientation",
): FlowNode & {
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

            variableName,
        },
    } as FlowNode & {
        data: GetOrientationNodeData;
    };
}

describe(
    "GetOrientationEmitter",
    () => {
        it(
            "generates get_orientation()",
            () => {
                const code =
                    getOrientationEmitter.emit(
                        createNode(),
                        context,
                    );

                expect(code).toBe(
                    `variables["orientation"] = get_orientation()`,
                );
            },
        );

        it(
            "supports a custom variable name",
            () => {
                const code =
                    getOrientationEmitter.emit(
                        createNode(
                            "deviceOrientation",
                        ),
                        context,
                    );

                expect(code).toBe(
                    `variables["deviceOrientation"] = get_orientation()`,
                );
            },
        );

        it(
            "supports camelCase variable names",
            () => {
                const code =
                    getOrientationEmitter.emit(
                        createNode(
                            "currentOrientation",
                        ),
                        context,
                    );

                expect(code).toBe(
                    `variables["currentOrientation"] = get_orientation()`,
                );
            },
        );

        it(
            "supports underscore variable names",
            () => {
                const code =
                    getOrientationEmitter.emit(
                        createNode(
                            "device_orientation",
                        ),
                        context,
                    );

                expect(code).toBe(
                    `variables["device_orientation"] = get_orientation()`,
                );
            },
        );

        it(
            "escapes double quotes in variable name",
            () => {
                const code =
                    getOrientationEmitter.emit(
                        createNode(
                            'device"Orientation',
                        ),
                        context,
                    );

                expect(code).toBe(
                    `variables["device\\"Orientation"] = get_orientation()`,
                );
            },
        );

        it(
            "supports an empty variable name",
            () => {
                const code =
                    getOrientationEmitter.emit(
                        createNode(""),
                        context,
                    );

                expect(code).toBe(
                    `variables[""] = get_orientation()`,
                );
            },
        );

        it(
            "does not generate unexpected arguments",
            () => {
                const code =
                    getOrientationEmitter.emit(
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
                    getOrientationEmitter.emit(
                        createNode(),
                        context,
                    );

                expect(
                    code.split("\n"),
                ).toHaveLength(1);

                expect(code).toBe(
                    `variables["orientation"] = get_orientation()`,
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
                    getOrientationEmitter.emit(
                        node,
                        context,
                    );

                expect(code).toBe(
                    `variables["orientation"] = get_orientation()`,
                );
            },
        );

        it(
            "produces the same output consistently",
            () => {
                const first =
                    getOrientationEmitter.emit(
                        createNode(),
                        context,
                    );

                const second =
                    getOrientationEmitter.emit(
                        createNode(),
                        context,
                    );

                expect(first).toBe(
                    second,
                );

                expect(first).toBe(
                    `variables["orientation"] = get_orientation()`,
                );
            },
        );
    },
);