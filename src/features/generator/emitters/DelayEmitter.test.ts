import {
    describe,
    expect,
    it,
} from "vitest";

import { delayEmitter } from "./DelayEmitter";

import type {
    DelayNodeData,
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

function createNode(
    duration = 3000,
): FlowNode & {
    data: DelayNodeData;
} {
    return {
        id: "delay-1",

        type: "default",

        position: {
            x: 0,
            y: 0,
        },

        data: {
            action: "delay",

            title: "Delay",

            subtitle: "",

            debug: {
                breakpoint: false,
            },

            duration,
        },
    } as FlowNode & {
        data: DelayNodeData;
    };
}

describe(
    "DelayEmitter",
    () => {
        it(
            "generates delay() with numeric duration",
            () => {
                const code =
                    delayEmitter.emit(
                        createNode(),
                        context,
                    );

                expect(code).toBe(
                    `delay(
    3000,
)`,
                );
            },
        );

        it(
            "preserves zero duration",
            () => {
                const code =
                    delayEmitter.emit(
                        createNode(0),
                        context,
                    );

                expect(code).toBe(
                    `delay(
    0,
)`,
                );
            },
        );

        it(
            "preserves a small duration",
            () => {
                const code =
                    delayEmitter.emit(
                        createNode(100),
                        context,
                    );

                expect(code).toBe(
                    `delay(
    100,
)`,
                );
            },
        );

        it(
            "preserves large duration",
            () => {
                const code =
                    delayEmitter.emit(
                        createNode(60000),
                        context,
                    );

                expect(code).toBe(
                    `delay(
    60000,
)`,
                );
            },
        );

        it(
            "does not quote numeric duration",
            () => {
                const code =
                    delayEmitter.emit(
                        createNode(1500),
                        context,
                    );

                expect(code).not.toContain(
                    '"1500"',
                );

                expect(code).toContain(
                    "1500",
                );
            },
        );
    },
);