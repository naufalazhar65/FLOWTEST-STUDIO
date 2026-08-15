import {
    describe,
    expect,
    it,
} from "vitest";

import { backEmitter } from "./BackEmitter";

import type {
    BackNodeData,
    FlowNode,
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

function createNode(): FlowNode & {
    data: BackNodeData;
} {
    return {
        id: "back-1",

        type: "default",

        position: {
            x: 0,
            y: 0,
        },

        data: {
            action: "back",

            title: "Back",

            subtitle: "",

            debug: {
                breakpoint: false,
            },
        },
    } as FlowNode & {
        data: BackNodeData;
    };
}

describe(
    "BackEmitter",
    () => {
        it(
            "generates back()",
            () => {
                const code =
                    backEmitter.emit(
                        createNode(),
                        context,
                    );

                expect(code).toBe(
                    "back()",
                );
            },
        );

        it(
            "generates an empty argument list",
            () => {
                const code =
                    backEmitter.emit(
                        createNode(),
                        context,
                    );

                expect(code).toBe(
                    "back()",
                );

                expect(code).not.toContain(
                    "\n",
                );
            },
        );

        it(
            "does not generate unexpected arguments",
            () => {
                const code =
                    backEmitter.emit(
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
                    backEmitter.emit(
                        node,
                        context,
                    );

                expect(code).toBe(
                    "back()",
                );
            },
        );

        it(
            "produces the same output consistently",
            () => {
                const first =
                    backEmitter.emit(
                        createNode(),
                        context,
                    );

                const second =
                    backEmitter.emit(
                        createNode(),
                        context,
                    );

                expect(first).toBe(
                    second,
                );

                expect(first).toBe(
                    "back()",
                );
            },
        );
    },
);