import {
    describe,
    expect,
    it,
} from "vitest";

import { pinchEmitter } from "./PinchEmitter";

import type {
    FlowNode,
    PinchNodeData,
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
        PinchNodeData["locatorStrategy"] =
        "id",
    locator = "image",
    percent = 0.8,
    duration = 500,
): FlowNode & {
    data: PinchNodeData;
} {
    return {
        id: "pinch-1",

        type: "default",

        position: {
            x: 0,
            y: 0,
        },

        data: {
            action: "pinch",

            title: "Pinch",

            subtitle: "",

            debug: {
                breakpoint: false,
            },

            locatorStrategy,

            locator,

            percent,

            duration,
        },
    } as FlowNode & {
        data: PinchNodeData;
    };
}

describe(
    "PinchEmitter",
    () => {
        it(
            "generates pinch()",
            () => {
                const code =
                    pinchEmitter.emit(
                        createNode(),
                        context,
                    );

                expect(code).toBe(
                    `pinch(
    AppiumBy.ID,
    "image",
    0.8,
    500,
)`,
                );
            },
        );

        it(
            "supports accessibility id locator",
            () => {
                const code =
                    pinchEmitter.emit(
                        createNode(
                            "accessibilityId",
                            "Image",
                            0.5,
                            750,
                        ),
                        context,
                    );

                expect(code).toBe(
                    `pinch(
    AppiumBy.ACCESSIBILITY_ID,
    "Image",
    0.5,
    750,
)`,
                );
            },
        );

        it(
            "supports xpath locator",
            () => {
                const code =
                    pinchEmitter.emit(
                        createNode(
                            "xpath",
                            '//XCUIElementTypeImage[@name="Photo"]',
                            0.75,
                            1000,
                        ),
                        context,
                    );

                expect(code).toBe(
                    `pinch(
    AppiumBy.XPATH,
    "//XCUIElementTypeImage[@name=\\\"Photo\\\"]",
    0.75,
    1000,
)`,
                );
            },
        );

        it(
            "preserves decimal percent",
            () => {
                const code =
                    pinchEmitter.emit(
                        createNode(
                            "id",
                            "image",
                            0.25,
                            500,
                        ),
                        context,
                    );

                expect(code).toBe(
                    `pinch(
    AppiumBy.ID,
    "image",
    0.25,
    500,
)`,
                );
            },
        );

        it(
            "preserves decimal duration",
            () => {
                const code =
                    pinchEmitter.emit(
                        createNode(
                            "id",
                            "image",
                            0.8,
                            750.5,
                        ),
                        context,
                    );

                expect(code).toBe(
                    `pinch(
    AppiumBy.ID,
    "image",
    0.8,
    750.5,
)`,
                );
            },
        );

        it(
            "supports zero values",
            () => {
                const code =
                    pinchEmitter.emit(
                        createNode(
                            "id",
                            "image",
                            0,
                            0,
                        ),
                        context,
                    );

                expect(code).toBe(
                    `pinch(
    AppiumBy.ID,
    "image",
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
                    pinchEmitter.emit(
                        createNode(
                            "id",
                            "image",
                            0.8,
                            500,
                        ),
                        context,
                    );

                expect(code).not.toContain(
                    '"0.8"',
                );

                expect(code).not.toContain(
                    '"500"',
                );

                expect(code).toContain(
                    "0.8",
                );

                expect(code).toContain(
                    "500",
                );
            },
        );

        it(
            "escapes special characters in locator",
            () => {
                const code =
                    pinchEmitter.emit(
                        createNode(
                            "id",
                            'image "photo"',
                            0.8,
                            500,
                        ),
                        context,
                    );

                expect(code).toBe(
                    `pinch(
    AppiumBy.ID,
    "image \\"photo\\"",
    0.8,
    500,
)`,
                );
            },
        );
    },
);