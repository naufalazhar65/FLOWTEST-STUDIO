import {
    describe,
    expect,
    it,
} from "vitest";

import { screenshotEmitter } from "./ScreenshotEmitter";

import type {
    FlowNode,
    ScreenshotNodeData,
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
    fileName = "login-page.png",
): FlowNode & {
    data: ScreenshotNodeData;
} {
    return {
        id: "screenshot-1",

        type: "default",

        position: {
            x: 0,
            y: 0,
        },

        data: {
            action: "screenshot",

            title: "Screenshot",

            subtitle: "",

            debug: {
                breakpoint: false,
            },

            fileName,
        },
    } as FlowNode & {
        data: ScreenshotNodeData;
    };
}

describe(
    "ScreenshotEmitter",
    () => {
        it(
            "generates screenshot()",
            () => {
                const code =
                    screenshotEmitter.emit(
                        createNode(),
                        context,
                    );

                expect(code).toBe(
                    `screenshot(
    "login-page.png",
)`,
                );
            },
        );

        it(
            "supports a file name with spaces",
            () => {
                const code =
                    screenshotEmitter.emit(
                        createNode(
                            "Login Page.png",
                        ),
                        context,
                    );

                expect(code).toBe(
                    `screenshot(
    "Login Page.png",
)`,
                );
            },
        );

        it(
            "supports nested file paths",
            () => {
                const code =
                    screenshotEmitter.emit(
                        createNode(
                            "screenshots/login/home.png",
                        ),
                        context,
                    );

                expect(code).toBe(
                    `screenshot(
    "screenshots/login/home.png",
)`,
                );
            },
        );

        it(
            "supports absolute file paths",
            () => {
                const code =
                    screenshotEmitter.emit(
                        createNode(
                            "/tmp/screenshots/login.png",
                        ),
                        context,
                    );

                expect(code).toBe(
                    `screenshot(
    "/tmp/screenshots/login.png",
)`,
                );
            },
        );

        it(
            "supports an empty file name",
            () => {
                const code =
                    screenshotEmitter.emit(
                        createNode(""),
                        context,
                    );

                expect(code).toBe(
                    `screenshot(
    "",
)`,
                );
            },
        );

        it(
            "escapes double quotes",
            () => {
                const code =
                    screenshotEmitter.emit(
                        createNode(
                            'login "page".png',
                        ),
                        context,
                    );

                expect(code).toBe(
                    `screenshot(
    "login \\"page\\".png",
)`,
                );
            },
        );

        it(
            "escapes backslashes",
            () => {
                const code =
                    screenshotEmitter.emit(
                        createNode(
                            "screenshots\\login.png",
                        ),
                        context,
                    );

                expect(code).toBe(
                    `screenshot(
    "screenshots\\\\login.png",
)`,
                );
            },
        );

        it(
            "supports special characters",
            () => {
                const code =
                    screenshotEmitter.emit(
                        createNode(
                            "login-page_01@2x.png",
                        ),
                        context,
                    );

                expect(code).toBe(
                    `screenshot(
    "login-page_01@2x.png",
)`,
                );
            },
        );

        it(
            "produces only one screenshot argument",
            () => {
                const code =
                    screenshotEmitter.emit(
                        createNode(),
                        context,
                    );

                expect(code).toBe(
                    `screenshot(
    "login-page.png",
)`,
                );

                expect(
                    code.split(
                        "\n",
                    ).length,
                ).toBe(3);
            },
        );

        it(
            "does not generate unexpected arguments",
            () => {
                const code =
                    screenshotEmitter.emit(
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
    },
);