import {
    describe,
    expect,
    it,
} from "vitest";

import { closeAppEmitter } from "./CloseAppEmitter";

import type {
    CloseAppNodeData,
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

function createAndroidNode(
    appPackage = "com.demo.app",
): FlowNode & {
    data: CloseAppNodeData;
} {
    return {
        id: "close-android",

        type: "default",

        position: {
            x: 0,
            y: 0,
        },

        data: {
            action: "closeApp",

            title: "Close App",

            subtitle: "",

            debug: {
                breakpoint: false,
            },

            platform: "Android",

            appPackage,

            bundleId: "",
        },
    } as FlowNode & {
        data: CloseAppNodeData;
    };
}

function createIOSNode(
    bundleId = "com.demo.ios",
): FlowNode & {
    data: CloseAppNodeData;
} {
    return {
        id: "close-ios",

        type: "default",

        position: {
            x: 0,
            y: 0,
        },

        data: {
            action: "closeApp",

            title: "Close App",

            subtitle: "",

            debug: {
                breakpoint: false,
            },

            platform: "iOS",

            appPackage: "",

            bundleId,
        },
    } as FlowNode & {
        data: CloseAppNodeData;
    };
}

describe(
    "CloseAppEmitter",
    () => {
        it(
            "generates Android close_app()",
            () => {
                const code =
                    closeAppEmitter.emit(
                        createAndroidNode(),
                        context,
                    );

                expect(code).toBe(
                    `close_app(
    "Android",
    "com.demo.app",
)`,
                );
            },
        );

        it(
            "generates iOS close_app()",
            () => {
                const code =
                    closeAppEmitter.emit(
                        createIOSNode(),
                        context,
                    );

                expect(code).toBe(
                    `close_app(
    "iOS",
    "com.demo.ios",
)`,
                );
            },
        );

        it(
            "uses appPackage for Android",
            () => {
                const code =
                    closeAppEmitter.emit(
                        createAndroidNode(
                            "com.example.android",
                        ),
                        context,
                    );

                expect(code).toBe(
                    `close_app(
    "Android",
    "com.example.android",
)`,
                );
            },
        );

        it(
            "uses bundleId for iOS",
            () => {
                const code =
                    closeAppEmitter.emit(
                        createIOSNode(
                            "com.example.ios",
                        ),
                        context,
                    );

                expect(code).toBe(
                    `close_app(
    "iOS",
    "com.example.ios",
)`,
                );
            },
        );

        it(
            "does not use bundleId for Android",
            () => {
                const node =
                    createAndroidNode();

                node.data.bundleId =
                    "com.should.not.be.used";

                const code =
                    closeAppEmitter.emit(
                        node,
                        context,
                    );

                expect(code).not.toContain(
                    "com.should.not.be.used",
                );

                expect(code).toContain(
                    "com.demo.app",
                );
            },
        );

        it(
            "does not use appPackage for iOS",
            () => {
                const node =
                    createIOSNode();

                node.data.appPackage =
                    "com.should.not.be.used";

                const code =
                    closeAppEmitter.emit(
                        node,
                        context,
                    );

                expect(code).not.toContain(
                    "com.should.not.be.used",
                );

                expect(code).toContain(
                    "com.demo.ios",
                );
            },
        );

        it(
            "escapes special characters in Android package",
            () => {
                const code =
                    closeAppEmitter.emit(
                        createAndroidNode(
                            'com.demo."app"',
                        ),
                        context,
                    );

                expect(code).toBe(
                    `close_app(
    "Android",
    "com.demo.\\"app\\"",
)`,
                );
            },
        );

        it(
            "escapes special characters in iOS bundle id",
            () => {
                const code =
                    closeAppEmitter.emit(
                        createIOSNode(
                            'com.demo."ios"',
                        ),
                        context,
                    );

                expect(code).toBe(
                    `close_app(
    "iOS",
    "com.demo.\\"ios\\"",
)`,
                );
            },
        );

        it(
            "supports an empty Android package",
            () => {
                const code =
                    closeAppEmitter.emit(
                        createAndroidNode(
                            "",
                        ),
                        context,
                    );

                expect(code).toBe(
                    `close_app(
    "Android",
    "",
)`,
                );
            },
        );

        it(
            "supports an empty iOS bundle id",
            () => {
                const code =
                    closeAppEmitter.emit(
                        createIOSNode(
                            "",
                        ),
                        context,
                    );

                expect(code).toBe(
                    `close_app(
    "iOS",
    "",
)`,
                );
            },
        );
    },
);