import {
    describe,
    expect,
    it,
} from "vitest";

import {
    getPlatformVersionEmitter,
} from "./GetPlatformVersionEmitter";

import type {
    FlowNode,
    GetPlatformVersionNodeData,
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
    variableName = "platformVersion",
): FlowNode & {
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

            variableName,
        },
    } as FlowNode & {
        data: GetPlatformVersionNodeData;
    };
}

describe(
    "GetPlatformVersionEmitter",
    () => {
        it(
            "generates get_platform_version()",
            () => {
                const code =
                    getPlatformVersionEmitter.emit(
                        createNode(),
                        context,
                    );

                expect(code).toBe(
                    `variables["platformVersion"] = get_platform_version()`,
                );
            },
        );

        it(
            "supports a custom variable name",
            () => {
                const code =
                    getPlatformVersionEmitter.emit(
                        createNode(
                            "version",
                        ),
                        context,
                    );

                expect(code).toBe(
                    `variables["version"] = get_platform_version()`,
                );
            },
        );

        it(
            "supports camelCase variable names",
            () => {
                const code =
                    getPlatformVersionEmitter.emit(
                        createNode(
                            "currentPlatformVersion",
                        ),
                        context,
                    );

                expect(code).toBe(
                    `variables["currentPlatformVersion"] = get_platform_version()`,
                );
            },
        );

        it(
            "supports underscore variable names",
            () => {
                const code =
                    getPlatformVersionEmitter.emit(
                        createNode(
                            "platform_version",
                        ),
                        context,
                    );

                expect(code).toBe(
                    `variables["platform_version"] = get_platform_version()`,
                );
            },
        );

        it(
            "escapes double quotes in variable name",
            () => {
                const code =
                    getPlatformVersionEmitter.emit(
                        createNode(
                            'platform"Version',
                        ),
                        context,
                    );

                expect(code).toBe(
                    `variables["platform\\"Version"] = get_platform_version()`,
                );
            },
        );

        it(
            "supports an empty variable name",
            () => {
                const code =
                    getPlatformVersionEmitter.emit(
                        createNode(""),
                        context,
                    );

                expect(code).toBe(
                    `variables[""] = get_platform_version()`,
                );
            },
        );

        it(
            "does not generate unexpected arguments",
            () => {
                const code =
                    getPlatformVersionEmitter.emit(
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
                    getPlatformVersionEmitter.emit(
                        createNode(),
                        context,
                    );

                expect(
                    code.split("\n"),
                ).toHaveLength(1);

                expect(code).toBe(
                    `variables["platformVersion"] = get_platform_version()`,
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
                    getPlatformVersionEmitter.emit(
                        node,
                        context,
                    );

                expect(code).toBe(
                    `variables["platformVersion"] = get_platform_version()`,
                );
            },
        );

        it(
            "produces the same output consistently",
            () => {
                const first =
                    getPlatformVersionEmitter.emit(
                        createNode(),
                        context,
                    );

                const second =
                    getPlatformVersionEmitter.emit(
                        createNode(),
                        context,
                    );

                expect(first).toBe(
                    second,
                );

                expect(first).toBe(
                    `variables["platformVersion"] = get_platform_version()`,
                );
            },
        );
    },
);