import {
    describe,
    expect,
    it,
} from "vitest";

import { swipeEmitter } from "./SwipeEmitter";

import type {
    FlowNode,
    SwipeNodeData,
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
    direction = "left",
    distance = 300,
    duration = 500,
): FlowNode & {
    data: SwipeNodeData;
} {
    return {
        id: "swipe-1",

        type: "default",

        position: {
            x: 0,
            y: 0,
        },

        data: {
            action: "swipe",

            title: "Swipe",

            subtitle: "",

            debug: {
                breakpoint: false,
            },

            direction,

            distance,

            duration,
        },
    } as FlowNode & {
        data: SwipeNodeData;
    };
}

describe(
    "SwipeEmitter",
    () => {
        it(
            "generates swipe()",
            () => {
                const code =
                    swipeEmitter.emit(
                        createNode(),
                        context,
                    );

                expect(code).toBe(
                    `swipe(
    "left",
    300,
    500,
)`,
                );
            },
        );

        it(
            "supports right direction",
            () => {
                const code =
                    swipeEmitter.emit(
                        createNode(
                            "right",
                            400,
                            600,
                        ),
                        context,
                    );

                expect(code).toBe(
                    `swipe(
    "right",
    400,
    600,
)`,
                );
            },
        );

        it(
            "supports up direction",
            () => {
                const code =
                    swipeEmitter.emit(
                        createNode(
                            "up",
                            250,
                            750,
                        ),
                        context,
                    );

                expect(code).toBe(
                    `swipe(
    "up",
    250,
    750,
)`,
                );
            },
        );

        it(
            "supports down direction",
            () => {
                const code =
                    swipeEmitter.emit(
                        createNode(
                            "down",
                            500,
                            1000,
                        ),
                        context,
                    );

                expect(code).toBe(
                    `swipe(
    "down",
    500,
    1000,
)`,
                );
            },
        );

        it(
            "preserves decimal distance",
            () => {
                const code =
                    swipeEmitter.emit(
                        createNode(
                            "left",
                            250.5,
                            500,
                        ),
                        context,
                    );

                expect(code).toBe(
                    `swipe(
    "left",
    250.5,
    500,
)`,
                );
            },
        );

        it(
            "preserves decimal duration",
            () => {
                const code =
                    swipeEmitter.emit(
                        createNode(
                            "left",
                            300,
                            250.5,
                        ),
                        context,
                    );

                expect(code).toBe(
                    `swipe(
    "left",
    300,
    250.5,
)`,
                );
            },
        );

        it(
            "supports zero distance and duration",
            () => {
                const code =
                    swipeEmitter.emit(
                        createNode(
                            "left",
                            0,
                            0,
                        ),
                        context,
                    );

                expect(code).toBe(
                    `swipe(
    "left",
    0,
    0,
)`,
                );
            },
        );

        it(
            "does not quote numeric arguments",
            () => {
                const code =
                    swipeEmitter.emit(
                        createNode(
                            "left",
                            300,
                            500,
                        ),
                        context,
                    );

                expect(code).not.toContain(
                    '"300"',
                );

                expect(code).not.toContain(
                    '"500"',
                );

                expect(code).toContain(
                    "300",
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
                    swipeEmitter.emit(
                        createNode(
                            'left "test"',
                            300,
                            500,
                        ),
                        context,
                    );

                expect(code).toBe(
                    `swipe(
    "left \\"test\\"",
    300,
    500,
)`,
                );
            },
        );
    },
);