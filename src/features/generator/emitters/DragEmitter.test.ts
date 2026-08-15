import {
    describe,
    expect,
    it,
} from "vitest";

import { dragEmitter } from "./DragEmitter";

import type {
    DragNodeData,
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
        DragNodeData["locatorStrategy"] =
        "id",
    locator = "slider",
    direction = "right",
    distance = 400,
    duration = 800,
): FlowNode & {
    data: DragNodeData;
} {
    return {
        id: "drag-1",

        type: "default",

        position: {
            x: 0,
            y: 0,
        },

        data: {
            action: "drag",

            title: "Drag",

            subtitle: "",

            debug: {
                breakpoint: false,
            },

            locatorStrategy,

            locator,

            direction,

            distance,

            duration,
        },
    } as FlowNode & {
        data: DragNodeData;
    };
}

describe(
    "DragEmitter",
    () => {
        it(
            "generates python drag()",
            () => {
                const code =
                    dragEmitter.emit(
                        createNode(),
                        context,
                    );

                expect(code).toBe(
                    `drag(
    AppiumBy.ID,
    "slider",
    "right",
    400,
    800,
)`,
                );
            },
        );

        it(
            "supports accessibility id locator",
            () => {
                const code =
                    dragEmitter.emit(
                        createNode(
                            "accessibilityId",
                            "Slider",
                            "left",
                            300,
                            600,
                        ),
                        context,
                    );

                expect(code).toBe(
                    `drag(
    AppiumBy.ACCESSIBILITY_ID,
    "Slider",
    "left",
    300,
    600,
)`,
                );
            },
        );

        it(
            "supports xpath locator",
            () => {
                const code =
                    dragEmitter.emit(
                        createNode(
                            "xpath",
                            '//XCUIElementTypeSlider[@name="Volume"]',
                            "right",
                            500,
                            1000,
                        ),
                        context,
                    );

                expect(code).toBe(
                    `drag(
    AppiumBy.XPATH,
    "//XCUIElementTypeSlider[@name=\\\"Volume\\\"]",
    "right",
    500,
    1000,
)`,
                );
            },
        );

        it(
            "supports left direction",
            () => {
                const code =
                    dragEmitter.emit(
                        createNode(
                            "id",
                            "slider",
                            "left",
                            250,
                            500,
                        ),
                        context,
                    );

                expect(code).toBe(
                    `drag(
    AppiumBy.ID,
    "slider",
    "left",
    250,
    500,
)`,
                );
            },
        );

        it(
            "supports up direction",
            () => {
                const code =
                    dragEmitter.emit(
                        createNode(
                            "id",
                            "slider",
                            "up",
                            350,
                            700,
                        ),
                        context,
                    );

                expect(code).toBe(
                    `drag(
    AppiumBy.ID,
    "slider",
    "up",
    350,
    700,
)`,
                );
            },
        );

        it(
            "supports down direction",
            () => {
                const code =
                    dragEmitter.emit(
                        createNode(
                            "id",
                            "slider",
                            "down",
                            450,
                            900,
                        ),
                        context,
                    );

                expect(code).toBe(
                    `drag(
    AppiumBy.ID,
    "slider",
    "down",
    450,
    900,
)`,
                );
            },
        );

        it(
            "preserves decimal distance",
            () => {
                const code =
                    dragEmitter.emit(
                        createNode(
                            "id",
                            "slider",
                            "right",
                            250.5,
                            800,
                        ),
                        context,
                    );

                expect(code).toBe(
                    `drag(
    AppiumBy.ID,
    "slider",
    "right",
    250.5,
    800,
)`,
                );
            },
        );

        it(
            "preserves decimal duration",
            () => {
                const code =
                    dragEmitter.emit(
                        createNode(
                            "id",
                            "slider",
                            "right",
                            400,
                            750.5,
                        ),
                        context,
                    );

                expect(code).toBe(
                    `drag(
    AppiumBy.ID,
    "slider",
    "right",
    400,
    750.5,
)`,
                );
            },
        );

        it(
            "supports zero distance and duration",
            () => {
                const code =
                    dragEmitter.emit(
                        createNode(
                            "id",
                            "slider",
                            "right",
                            0,
                            0,
                        ),
                        context,
                    );

                expect(code).toBe(
                    `drag(
    AppiumBy.ID,
    "slider",
    "right",
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
                    dragEmitter.emit(
                        createNode(
                            "id",
                            "slider",
                            "right",
                            400,
                            800,
                        ),
                        context,
                    );

                expect(code).not.toContain(
                    '"400"',
                );

                expect(code).not.toContain(
                    '"800"',
                );

                expect(code).toContain(
                    "400",
                );

                expect(code).toContain(
                    "800",
                );
            },
        );

        it(
            "escapes special characters in locator",
            () => {
                const code =
                    dragEmitter.emit(
                        createNode(
                            "id",
                            'slider "volume"',
                            "right",
                            400,
                            800,
                        ),
                        context,
                    );

                expect(code).toBe(
                    `drag(
    AppiumBy.ID,
    "slider \\"volume\\"",
    "right",
    400,
    800,
)`,
                );
            },
        );
    },
);