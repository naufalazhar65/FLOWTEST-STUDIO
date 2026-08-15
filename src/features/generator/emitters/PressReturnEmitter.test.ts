import {
    describe,
    expect,
    it,
} from "vitest";

import { pressReturnEmitter } from "./PressReturnEmitter";

import type {
    FlowNode,
    PressReturnNodeData,
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
    data: PressReturnNodeData;
} {
    return {
        id: "press-return-1",

        type: "default",

        position: {
            x: 0,
            y: 0,
        },

        data: {
            action: "pressReturn",

            title: "Press Return",

            subtitle: "",

            debug: {
                breakpoint: false,
            },
        },
    } as FlowNode & {
        data: PressReturnNodeData;
    };
}

describe(
    "PressReturnEmitter",
    () => {
        it(
            "generates press_return()",
            () => {
                const code =
                    pressReturnEmitter.emit(
                        createNode(),
                        context,
                    );

                expect(code).toBe(
                    "press_return()",
                );
            },
        );

        it(
            "generates an empty argument list",
            () => {
                const code =
                    pressReturnEmitter.emit(
                        createNode(),
                        context,
                    );

                expect(code).toBe(
                    "press_return()",
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
                    pressReturnEmitter.emit(
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
            "is independent of node position",
            () => {
                const node =
                    createNode();

                node.position = {
                    x: 500,
                    y: 300,
                };

                const code =
                    pressReturnEmitter.emit(
                        node,
                        context,
                    );

                expect(code).toBe(
                    "press_return()",
                );
            },
        );

        it(
            "produces the same output consistently",
            () => {
                const first =
                    pressReturnEmitter.emit(
                        createNode(),
                        context,
                    );

                const second =
                    pressReturnEmitter.emit(
                        createNode(),
                        context,
                    );

                expect(first).toBe(
                    second,
                );

                expect(first).toBe(
                    "press_return()",
                );
            },
        );
    },
);