import {
    describe,
    expect,
    it,
} from "vitest";

import { doubleTapEmitter } from "./DoubleTapEmitter";

import type {
    DoubleTapNodeData,
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
        DoubleTapNodeData["locatorStrategy"] =
        "id",
    locator = "login_button",
): FlowNode & {
    data: DoubleTapNodeData;
} {
    return {
        id: "double-tap-1",

        type: "default",

        position: {
            x: 0,
            y: 0,
        },

        data: {
            action: "doubleTap",

            title: "Double Tap",

            subtitle: "",

            debug: {
                breakpoint: false,
            },

            locatorStrategy,

            locator,
        },
    } as FlowNode & {
        data: DoubleTapNodeData;
    };
}

describe(
    "DoubleTapEmitter",
    () => {
        it(
            "generates python double_tap()",
            () => {
                const code =
                    doubleTapEmitter.emit(
                        createNode(),
                        context,
                    );

                expect(code).toBe(
                    `double_tap(
    AppiumBy.ID,
    "login_button",
)`,
                );
            },
        );

        it(
            "supports accessibility id locator",
            () => {
                const code =
                    doubleTapEmitter.emit(
                        createNode(
                            "accessibilityId",
                            "Login Button",
                        ),
                        context,
                    );

                expect(code).toBe(
                    `double_tap(
    AppiumBy.ACCESSIBILITY_ID,
    "Login Button",
)`,
                );
            },
        );

        it(
            "supports xpath locator",
            () => {
                const code =
                    doubleTapEmitter.emit(
                        createNode(
                            "xpath",
                            '//XCUIElementTypeButton[@name="Login"]',
                        ),
                        context,
                    );

                expect(code).toBe(
                    `double_tap(
    AppiumBy.XPATH,
    "//XCUIElementTypeButton[@name=\\\"Login\\\"]",
)`,
                );
            },
        );

        it(
            "supports class name locator",
            () => {
                const code =
                    doubleTapEmitter.emit(
                        createNode(
                            "className",
                            "XCUIElementTypeButton",
                        ),
                        context,
                    );

                expect(code).toBe(
                    `double_tap(
    AppiumBy.CLASS_NAME,
    "XCUIElementTypeButton",
)`,
                );
            },
        );

        it(
            "supports empty locator",
            () => {
                const code =
                    doubleTapEmitter.emit(
                        createNode(
                            "id",
                            "",
                        ),
                        context,
                    );

                expect(code).toBe(
                    `double_tap(
    AppiumBy.ID,
    "",
)`,
                );
            },
        );

        it(
            "escapes special characters in locator",
            () => {
                const code =
                    doubleTapEmitter.emit(
                        createNode(
                            "id",
                            'login "button"',
                        ),
                        context,
                    );

                expect(code).toBe(
                    `double_tap(
    AppiumBy.ID,
    "login \\"button\\"",
)`,
                );
            },
        );
    },
);