import {
    describe,
    expect,
    it,
} from "vitest";

import { flingEmitter } from "./FlingEmitter";

import type {
    FlingNodeData,
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
    locatorStrategy:
        FlingNodeData["locatorStrategy"] =
        "id",
    locator = "scroll_container",
    direction = "up",
    speed = 5000,
): FlowNode & {
    data: FlingNodeData;
} {
    return {
        id: "fling-1",

        type: "default",

        position: {
            x: 0,
            y: 0,
        },

        data: {
            action: "fling",

            title: "Fling",

            subtitle: "",

            debug: {
                breakpoint: false,
            },

            locatorStrategy,

            locator,

            direction,

            speed,
        },
    } as FlowNode & {
        data: FlingNodeData;
    };
}

describe(
    "FlingEmitter",
    () => {
        it(
            "generates fling()",
            () => {
                const code =
                    flingEmitter.emit(
                        createNode(),
                        context,
                    );

                expect(code).toBe(
                    `fling(
    AppiumBy.ID,
    "scroll_container",
    "up",
    5000,
)`,
                );
            },
        );

        it(
            "supports accessibility id locator",
            () => {
                const code =
                    flingEmitter.emit(
                        createNode(
                            "accessibilityId",
                            "Scroll Container",
                            "down",
                            3000,
                        ),
                        context,
                    );

                expect(code).toBe(
                    `fling(
    AppiumBy.ACCESSIBILITY_ID,
    "Scroll Container",
    "down",
    3000,
)`,
                );
            },
        );

        it(
            "supports xpath locator",
            () => {
                const code =
                    flingEmitter.emit(
                        createNode(
                            "xpath",
                            '//XCUIElementTypeScrollView[@name="Content"]',
                            "up",
                            7500,
                        ),
                        context,
                    );

                expect(code).toBe(
                    `fling(
    AppiumBy.XPATH,
    "//XCUIElementTypeScrollView[@name=\\\"Content\\\"]",
    "up",
    7500,
)`,
                );
            },
        );

        it(
            "supports left direction",
            () => {
                const code =
                    flingEmitter.emit(
                        createNode(
                            "id",
                            "scroll_container",
                            "left",
                            4000,
                        ),
                        context,
                    );

                expect(code).toBe(
                    `fling(
    AppiumBy.ID,
    "scroll_container",
    "left",
    4000,
)`,
                );
            },
        );

        it(
            "supports right direction",
            () => {
                const code =
                    flingEmitter.emit(
                        createNode(
                            "id",
                            "scroll_container",
                            "right",
                            4000,
                        ),
                        context,
                    );

                expect(code).toBe(
                    `fling(
    AppiumBy.ID,
    "scroll_container",
    "right",
    4000,
)`,
                );
            },
        );

        it(
            "supports down direction",
            () => {
                const code =
                    flingEmitter.emit(
                        createNode(
                            "id",
                            "scroll_container",
                            "down",
                            6000,
                        ),
                        context,
                    );

                expect(code).toBe(
                    `fling(
    AppiumBy.ID,
    "scroll_container",
    "down",
    6000,
)`,
                );
            },
        );

        it(
            "preserves decimal speed",
            () => {
                const code =
                    flingEmitter.emit(
                        createNode(
                            "id",
                            "scroll_container",
                            "up",
                            2500.5,
                        ),
                        context,
                    );

                expect(code).toBe(
                    `fling(
    AppiumBy.ID,
    "scroll_container",
    "up",
    2500.5,
)`,
                );
            },
        );

        it(
            "supports zero speed",
            () => {
                const code =
                    flingEmitter.emit(
                        createNode(
                            "id",
                            "scroll_container",
                            "up",
                            0,
                        ),
                        context,
                    );

                expect(code).toBe(
                    `fling(
    AppiumBy.ID,
    "scroll_container",
    "up",
    0,
)`,
                );
            },
        );

        it(
            "does not quote numeric speed",
            () => {
                const code =
                    flingEmitter.emit(
                        createNode(
                            "id",
                            "scroll_container",
                            "up",
                            5000,
                        ),
                        context,
                    );

                expect(code).not.toContain(
                    '"5000"',
                );

                expect(code).toContain(
                    "5000",
                );
            },
        );

        it(
            "escapes special characters in locator",
            () => {
                const code =
                    flingEmitter.emit(
                        createNode(
                            "id",
                            'scroll "container"',
                            "up",
                            5000,
                        ),
                        context,
                    );

                expect(code).toBe(
                    `fling(
    AppiumBy.ID,
    "scroll \\"container\\"",
    "up",
    5000,
)`,
                );
            },
        );
    },
);