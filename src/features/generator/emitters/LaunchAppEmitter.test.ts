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

import type { GeneratorContext } from "../types/GeneratorContext";

const context: GeneratorContext = {
    framework: "selenium-python-mobile",
    indent: "    ",
    newline: "\n",
};

function createAndroidNode(): FlowNode & {
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

            noReset: true,
        },
    } as FlowNode & {
        data: LaunchAppNodeData;
    };
}

function createIOSNode(): FlowNode & {
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

            noReset: false,
        },
    } as FlowNode & {
        data: LaunchAppNodeData;
    };
}

describe("LaunchAppEmitter", () => {
    it("generates Android launch_app()", () => {
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
    true,
)`
        );
    });

    it("generates iOS launch_app()", () => {
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
    false,
)`
        );
    });
});