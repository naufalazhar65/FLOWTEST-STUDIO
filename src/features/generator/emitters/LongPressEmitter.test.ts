import {
    describe,
    expect,
    it,
} from "vitest";

import { longPressEmitter } from "./LongPressEmitter";

import type {
    FlowNode,
    LongPressNodeData,
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
        LongPressNodeData["locatorStrategy"] =
        "id",
    locator = "login_button",
    duration = 1000,
): FlowNode & {
    data: LongPressNodeData;
} {
    return {
        id: "long-press-1",

        type: "default",

        position: {
            x: 0,
            y: 0,
        },

        data: {
            action: "longPress",

            title: "Long Press",

            subtitle: "",

            debug: {
                breakpoint: false,
            },

            locatorStrategy,

            locator,

            duration,
        },
    } as FlowNode & {
        data: LongPressNodeData;
    };
}

describe(
    "LongPressEmitter",
    () => {
        it(
            "generates python long_press()",
            () => {
                const code =
                    longPressEmitter.emit(
                        createNode(),
                        context,
                    );

                expect(code).toBe(
                    `long_press(
    AppiumBy.ID,
    "login_button",
    1000,
)`,
                );
            },
        );

        it(
            "supports accessibility id locator",
            () => {
                const code =
                    longPressEmitter.emit(
                        createNode(
                            "accessibilityId",
                            "Login Button",
                            1500,
                        ),
                        context,
                    );

                expect(code).toBe(
                    `long_press(
    AppiumBy.ACCESSIBILITY_ID,
    "Login Button",
    1500,
)`,
                );
            },
        );

        it(
            "supports xpath locator",
            () => {
                const code =
                    longPressEmitter.emit(
                        createNode(
                            "xpath",
                            '//XCUIElementTypeButton[@name="Login"]',
                            2000,
                        ),
                        context,
                    );

                expect(code).toBe(
                    `long_press(
    AppiumBy.XPATH,
    "//XCUIElementTypeButton[@name=\\"Login\\"]",
    2000,
)`,
                );
            },
        );

        it(
            "preserves decimal duration",
            () => {
                const code =
                    longPressEmitter.emit(
                        createNode(
                            "id",
                            "login_button",
                            1500.5,
                        ),
                        context,
                    );

                expect(code).toBe(
                    `long_press(
    AppiumBy.ID,
    "login_button",
    1500.5,
)`,
                );
            },
        );

        it(
            "supports zero duration",
            () => {
                const code =
                    longPressEmitter.emit(
                        createNode(
                            "id",
                            "login_button",
                            0,
                        ),
                        context,
                    );

                expect(code).toBe(
                    `long_press(
    AppiumBy.ID,
    "login_button",
    0,
)`,
                );
            },
        );

        it(
            "supports large duration",
            () => {
                const code =
                    longPressEmitter.emit(
                        createNode(
                            "id",
                            "login_button",
                            10000,
                        ),
                        context,
                    );

                expect(code).toBe(
                    `long_press(
    AppiumBy.ID,
    "login_button",
    10000,
)`,
                );
            },
        );

        it(
            "does not quote numeric duration",
            () => {
                const code =
                    longPressEmitter.emit(
                        createNode(
                            "id",
                            "login_button",
                            2000,
                        ),
                        context,
                    );

                expect(code).not.toContain(
                    '"2000"',
                );

                expect(code).toContain(
                    "2000",
                );
            },
        );

        it(
            "escapes special characters in locator",
            () => {
                const code =
                    longPressEmitter.emit(
                        createNode(
                            "id",
                            'login "button"',
                            1000,
                        ),
                        context,
                    );

                expect(code).toBe(
                    `long_press(
    AppiumBy.ID,
    "login \\"button\\"",
    1000,
)`,
                );
            },
        );
    },
);