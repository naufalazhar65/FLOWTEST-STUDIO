import {
    describe,
    expect,
    it,
} from "vitest";

import { homeEmitter } from "./HomeEmitter";

import type {
    FlowNode,
    HomeNodeData,
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
    data: HomeNodeData;
} {
    return {
        id: "home-1",

        type: "default",

        position: {
            x: 0,
            y: 0,
        },

        data: {
            action: "home",

            title: "Home",

            subtitle: "",

            debug: {
                breakpoint: false,
            },
        },
    } as FlowNode & {
        data: HomeNodeData;
    };
}

describe(
    "HomeEmitter",
    () => {
        it(
            "generates home()",
            () => {
                const code =
                    homeEmitter.emit(
                        createNode(),
                        context,
                    );

                expect(code).toBe(
                    "home()",
                );
            },
        );

        it(
            "generates an empty argument list",
            () => {
                const code =
                    homeEmitter.emit(
                        createNode(),
                        context,
                    );

                expect(code).toBe(
                    "home()",
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
                    homeEmitter.emit(
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
                    homeEmitter.emit(
                        node,
                        context,
                    );

                expect(code).toBe(
                    "home()",
                );
            },
        );

        it(
            "produces the same output consistently",
            () => {
                const first =
                    homeEmitter.emit(
                        createNode(),
                        context,
                    );

                const second =
                    homeEmitter.emit(
                        createNode(),
                        context,
                    );

                expect(first).toBe(
                    second,
                );

                expect(first).toBe(
                    "home()",
                );
            },
        );
    },
);