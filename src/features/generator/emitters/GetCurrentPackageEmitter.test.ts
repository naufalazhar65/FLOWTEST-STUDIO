import {
    describe,
    expect,
    it,
} from "vitest";

import {
    getCurrentPackageEmitter,
} from "./GetCurrentPackageEmitter";

import type {
    FlowNode,
    GetCurrentPackageNodeData,
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
    variableName = "currentPackage",
): FlowNode & {
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

            variableName,
        },
    } as FlowNode & {
        data: GetCurrentPackageNodeData;
    };
}

describe(
    "GetCurrentPackageEmitter",
    () => {
        it(
            "generates get_current_package()",
            () => {
                const code =
                    getCurrentPackageEmitter.emit(
                        createNode(),
                        context,
                    );

                expect(code).toBe(
                    `variables["currentPackage"] = get_current_package()`,
                );
            },
        );

        it(
            "supports a custom variable name",
            () => {
                const code =
                    getCurrentPackageEmitter.emit(
                        createNode(
                            "packageName",
                        ),
                        context,
                    );

                expect(code).toBe(
                    `variables["packageName"] = get_current_package()`,
                );
            },
        );

        it(
            "supports camelCase variable names",
            () => {
                const code =
                    getCurrentPackageEmitter.emit(
                        createNode(
                            "currentPackageName",
                        ),
                        context,
                    );

                expect(code).toBe(
                    `variables["currentPackageName"] = get_current_package()`,
                );
            },
        );

        it(
            "supports underscore variable names",
            () => {
                const code =
                    getCurrentPackageEmitter.emit(
                        createNode(
                            "current_package",
                        ),
                        context,
                    );

                expect(code).toBe(
                    `variables["current_package"] = get_current_package()`,
                );
            },
        );

        it(
            "escapes double quotes in variable name",
            () => {
                const code =
                    getCurrentPackageEmitter.emit(
                        createNode(
                            'current"Package',
                        ),
                        context,
                    );

                expect(code).toBe(
                    `variables["current\\"Package"] = get_current_package()`,
                );
            },
        );

        it(
            "supports an empty variable name",
            () => {
                const code =
                    getCurrentPackageEmitter.emit(
                        createNode(""),
                        context,
                    );

                expect(code).toBe(
                    `variables[""] = get_current_package()`,
                );
            },
        );

        it(
            "does not generate unexpected arguments",
            () => {
                const code =
                    getCurrentPackageEmitter.emit(
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
                    getCurrentPackageEmitter.emit(
                        createNode(),
                        context,
                    );

                expect(
                    code.split("\n"),
                ).toHaveLength(1);

                expect(code).toBe(
                    `variables["currentPackage"] = get_current_package()`,
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
                    getCurrentPackageEmitter.emit(
                        node,
                        context,
                    );

                expect(code).toBe(
                    `variables["currentPackage"] = get_current_package()`,
                );
            },
        );

        it(
            "produces the same output consistently",
            () => {
                const first =
                    getCurrentPackageEmitter.emit(
                        createNode(),
                        context,
                    );

                const second =
                    getCurrentPackageEmitter.emit(
                        createNode(),
                        context,
                    );

                expect(first).toBe(
                    second,
                );

                expect(first).toBe(
                    `variables["currentPackage"] = get_current_package()`,
                );
            },
        );
    },
);