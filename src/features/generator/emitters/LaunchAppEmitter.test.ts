import {
    describe,
    expect,
    it,
} from "vitest";

import { launchAppEmitter } from "./LaunchAppEmitter";

import type {
    FlowNode,
    LaunchAppNodeData,
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
    noReset = true,
): FlowNode & {
    data: LaunchAppNodeData;
} {
    return {
        id: "launch-android",

        type: "default",

        position: {
            x: 0,
            y: 0,
        },

        data: {
            action: "launchApp",

            title: "Launch App",

            subtitle: "",

            debug: {
                breakpoint: false,
            },

            platform: "Android",

            appPackage: "com.demo.app",

            appActivity: ".MainActivity",

            bundleId: "",

            app: "",

            noReset,
        },
    } as FlowNode & {
        data: LaunchAppNodeData;
    };
}

function createIOSNode(
    noReset = false,
): FlowNode & {
    data: LaunchAppNodeData;
} {
    return {
        id: "launch-ios",

        type: "default",

        position: {
            x: 0,
            y: 0,
        },

        data: {
            action: "launchApp",

            title: "Launch App",

            subtitle: "",

            debug: {
                breakpoint: false,
            },

            platform: "iOS",

            appPackage: "",

            appActivity: "",

            bundleId: "com.demo.app",

            app: "/apps/Demo.app",

            noReset,
        },
    } as FlowNode & {
        data: LaunchAppNodeData;
    };
}

describe(
    "LaunchAppEmitter",
    () => {
        it(
            "generates Android launch_app()",
            () => {
                const code =
                    launchAppEmitter.emit(
                        createAndroidNode(),
                        context,
                    );

                expect(code).toBe(
                    `launch_app(
    "Android",
    "com.demo.app",
    ".MainActivity",
    True,
)`,
                );
            },
        );

        it(
            "generates iOS launch_app()",
            () => {
                const code =
                    launchAppEmitter.emit(
                        createIOSNode(),
                        context,
                    );

                expect(code).toBe(
                    `launch_app(
    "iOS",
    "com.demo.app",
    "/apps/Demo.app",
    False,
)`,
                );
            },
        );

        it(
            "generates Android with noReset false",
            () => {
                const code =
                    launchAppEmitter.emit(
                        createAndroidNode(
                            false,
                        ),
                        context,
                    );

                expect(code).toBe(
                    `launch_app(
    "Android",
    "com.demo.app",
    ".MainActivity",
    False,
)`,
                );
            },
        );

        it(
            "generates iOS with noReset true",
            () => {
                const code =
                    launchAppEmitter.emit(
                        createIOSNode(
                            true,
                        ),
                        context,
                    );

                expect(code).toBe(
                    `launch_app(
    "iOS",
    "com.demo.app",
    "/apps/Demo.app",
    True,
)`,
                );
            },
        );

        it(
            "uses Android package and activity",
            () => {
                const node =
                    createAndroidNode();

                node.data.appPackage =
                    "com.example.myapp";

                node.data.appActivity =
                    ".MainActivity";

                const code =
                    launchAppEmitter.emit(
                        node,
                        context,
                    );

                expect(code).toBe(
                    `launch_app(
    "Android",
    "com.example.myapp",
    ".MainActivity",
    True,
)`,
                );
            },
        );

        it(
            "uses iOS bundle id and app path",
            () => {
                const node =
                    createIOSNode();

                node.data.bundleId =
                    "com.example.myapp";

                node.data.app =
                    "/Applications/MyApp.app";

                const code =
                    launchAppEmitter.emit(
                        node,
                        context,
                    );

                expect(code).toBe(
                    `launch_app(
    "iOS",
    "com.example.myapp",
    "/Applications/MyApp.app",
    False,
)`,
                );
            },
        );

        it(
            "does not use Android fields for iOS",
            () => {
                const node =
                    createIOSNode();

                node.data.appPackage =
                    "com.should.not.be.used";

                node.data.appActivity =
                    ".ShouldNotBeUsed";

                const code =
                    launchAppEmitter.emit(
                        node,
                        context,
                    );

                expect(code).not.toContain(
                    "com.should.not.be.used",
                );

                expect(code).not.toContain(
                    ".ShouldNotBeUsed",
                );

                expect(code).toContain(
                    "com.demo.app",
                );

                expect(code).toContain(
                    "/apps/Demo.app",
                );
            },
        );

        it(
            "does not use iOS fields for Android",
            () => {
                const node =
                    createAndroidNode();

                node.data.bundleId =
                    "com.should.not.be.used";

                node.data.app =
                    "/should/not/be/used.app";

                const code =
                    launchAppEmitter.emit(
                        node,
                        context,
                    );

                expect(code).not.toContain(
                    "com.should.not.be.used",
                );

                expect(code).not.toContain(
                    "/should/not/be/used.app",
                );

                expect(code).toContain(
                    "com.demo.app",
                );

                expect(code).toContain(
                    ".MainActivity",
                );
            },
        );

        it(
            "escapes Android application values",
            () => {
                const node =
                    createAndroidNode();

                node.data.appPackage =
                    'com.example."demo"';

                node.data.appActivity =
                    '.Main"Activity';

                const code =
                    launchAppEmitter.emit(
                        node,
                        context,
                    );

                expect(code).toBe(
                    `launch_app(
    "Android",
    "com.example.\\"demo\\"",
    ".Main\\"Activity",
    True,
)`,
                );
            },
        );

        it(
            "escapes iOS application values",
            () => {
                const node =
                    createIOSNode();

                node.data.bundleId =
                    'com.example."demo"';

                node.data.app =
                    '/apps/Demo "Test".app';

                const code =
                    launchAppEmitter.emit(
                        node,
                        context,
                    );

                expect(code).toBe(
                    `launch_app(
    "iOS",
    "com.example.\\"demo\\"",
    "/apps/Demo \\"Test\\".app",
    False,
)`,
                );
            },
        );
    },
);