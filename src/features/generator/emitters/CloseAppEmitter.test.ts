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

import type { GeneratorContext } from "../types/GeneratorContext";

const context: GeneratorContext = {
    framework: "selenium-python-mobile",
    indent: "    ",
    newline: "\n",
};

function createAndroidNode(): FlowNode & {
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

            appPackage: "com.demo.app",

            bundleId: "",
        },
    } as FlowNode & {
        data: CloseAppNodeData;
    };
}

function createIOSNode(): FlowNode & {
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

            bundleId: "com.demo.ios",
        },
    } as FlowNode & {
        data: CloseAppNodeData;
    };
}

describe("CloseAppEmitter", () => {
    it("generates Android close_app()", () => {
        const code =
            closeAppEmitter.emit(
                createAndroidNode(),
                context,
            );

        expect(code).toBe(
            `close_app(
    "Android",
    "com.demo.app",
)`
        );
    });

    it("generates iOS close_app()", () => {
        const code =
            closeAppEmitter.emit(
                createIOSNode(),
                context,
            );

        expect(code).toBe(
            `close_app(
    "iOS",
    "com.demo.ios",
)`
        );
    });
});