import {
    describe,
    expect,
    it,
} from "vitest";

import {
    getCurrentActivityEmitter,
} from "./GetCurrentActivityEmitter";

import type {
    FlowNode,
    GetCurrentActivityNodeData,
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
    variableName = "currentActivity",
): FlowNode & {
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

            variableName,
        },
    } as FlowNode & {
        data: GetCurrentActivityNodeData;
    };
}

describe(
    "GetCurrentActivityEmitter",
    () => {
        it(
            "generates get_current_activity()",
            () => {
                const code =
                    getCurrentActivityEmitter.emit(
                        createNode(),
                        context,
                    );

                expect(code).toBe(
                    `variables["currentActivity"] = get_current_activity()`,
                );
            },
        );

        it(
            "supports a custom variable name",
            () => {
                const code =
                    getCurrentActivityEmitter.emit(
                        createNode(
                            "activity",
                        ),
                        context,
                    );

                expect(code).toBe(
                    `variables["activity"] = get_current_activity()`,
                );
            },
        );

        it(
            "supports camelCase variable names",
            () => {
                const code =
                    getCurrentActivityEmitter.emit(
                        createNode(
                            "currentActivityName",
                        ),
                        context,
                    );

                expect(code).toBe(
                    `variables["currentActivityName"] = get_current_activity()`,
                );
            },
        );

        it(
            "supports underscore variable names",
            () => {
                const code =
                    getCurrentActivityEmitter.emit(
                        createNode(
                            "current_activity",
                        ),
                        context,
                    );

                expect(code).toBe(
                    `variables["current_activity"] = get_current_activity()`,
                );
            },
        );

        it(
            "escapes double quotes in variable name",
            () => {
                const code =
                    getCurrentActivityEmitter.emit(
                        createNode(
                            'current"Activity',
                        ),
                        context,
                    );

                expect(code).toBe(
                    `variables["current\\"Activity"] = get_current_activity()`,
                );
            },
        );

        it(
            "supports an empty variable name",
            () => {
                const code =
                    getCurrentActivityEmitter.emit(
                        createNode(""),
                        context,
                    );

                expect(code).toBe(
                    `variables[""] = get_current_activity()`,
                );
            },
        );

        it(
            "does not generate unexpected arguments",
            () => {
                const code =
                    getCurrentActivityEmitter.emit(
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
                    getCurrentActivityEmitter.emit(
                        createNode(),
                        context,
                    );

                expect(
                    code.split("\n"),
                ).toHaveLength(1);

                expect(code).toBe(
                    `variables["currentActivity"] = get_current_activity()`,
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
                    getCurrentActivityEmitter.emit(
                        node,
                        context,
                    );

                expect(code).toBe(
                    `variables["currentActivity"] = get_current_activity()`,
                );
            },
        );

        it(
            "produces the same output consistently",
            () => {
                const first =
                    getCurrentActivityEmitter.emit(
                        createNode(),
                        context,
                    );

                const second =
                    getCurrentActivityEmitter.emit(
                        createNode(),
                        context,
                    );

                expect(first).toBe(
                    second,
                );

                expect(first).toBe(
                    `variables["currentActivity"] = get_current_activity()`,
                );
            },
        );
    },
);