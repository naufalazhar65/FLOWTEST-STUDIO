import {
    describe,
    expect,
    it,
} from "vitest";

import { scrollEmitter } from "./ScrollEmitter";

import type {
    FlowNode,
    ScrollNodeData,
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
    direction = "down",
    amount = 500,
): FlowNode & {
    data: ScrollNodeData;
} {
    return {
        id: "scroll-1",

        type: "default",

        position: {
            x: 0,
            y: 0,
        },

        data: {
            action: "scroll",

            title: "Scroll",

            subtitle: "",

            debug: {
                breakpoint: false,
            },

            direction,

            amount,
        },
    } as FlowNode & {
        data: ScrollNodeData;
    };
}

describe(
    "ScrollEmitter",
    () => {
        it(
            "generates scroll()",
            () => {
                const code =
                    scrollEmitter.emit(
                        createNode(),
                        context,
                    );

                expect(code).toBe(
                    `scroll(
    "down",
    500,
)`,
                );
            },
        );

        it(
            "supports up direction",
            () => {
                const code =
                    scrollEmitter.emit(
                        createNode(
                            "up",
                            300,
                        ),
                        context,
                    );

                expect(code).toBe(
                    `scroll(
    "up",
    300,
)`,
                );
            },
        );

        it(
            "supports down direction",
            () => {
                const code =
                    scrollEmitter.emit(
                        createNode(
                            "down",
                            800,
                        ),
                        context,
                    );

                expect(code).toBe(
                    `scroll(
    "down",
    800,
)`,
                );
            },
        );

        it(
            "supports left direction",
            () => {
                const code =
                    scrollEmitter.emit(
                        createNode(
                            "left",
                            250,
                        ),
                        context,
                    );

                expect(code).toBe(
                    `scroll(
    "left",
    250,
)`,
                );
            },
        );

        it(
            "supports right direction",
            () => {
                const code =
                    scrollEmitter.emit(
                        createNode(
                            "right",
                            400,
                        ),
                        context,
                    );

                expect(code).toBe(
                    `scroll(
    "right",
    400,
)`,
                );
            },
        );

        it(
            "preserves decimal amount",
            () => {
                const code =
                    scrollEmitter.emit(
                        createNode(
                            "down",
                            250.5,
                        ),
                        context,
                    );

                expect(code).toBe(
                    `scroll(
    "down",
    250.5,
)`,
                );
            },
        );

        it(
            "supports zero amount",
            () => {
                const code =
                    scrollEmitter.emit(
                        createNode(
                            "down",
                            0,
                        ),
                        context,
                    );

                expect(code).toBe(
                    `scroll(
    "down",
    0,
)`,
                );
            },
        );

        it(
            "does not quote numeric amount",
            () => {
                const code =
                    scrollEmitter.emit(
                        createNode(
                            "down",
                            500,
                        ),
                        context,
                    );

                expect(code).not.toContain(
                    '"500"',
                );

                expect(code).toContain(
                    "500",
                );
            },
        );

        it(
            "escapes special characters in direction",
            () => {
                const code =
                    scrollEmitter.emit(
                        createNode(
                            'down "test"',
                            500,
                        ),
                        context,
                    );

                expect(code).toBe(
                    `scroll(
    "down \\"test\\"",
    500,
)`,
                );
            },
        );
    },
);