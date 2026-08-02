import { describe, expect, it } from "vitest";

import { screenshotEmitter } from "./ScreenshotEmitter";

import type {
    FlowNode,
    ScreenshotNodeData,
} from "../../flow/types/flowNode";

import type { GeneratorContext } from "../types/GeneratorContext";

const context: GeneratorContext = {
    framework: "selenium-python-mobile",
    indent: "    ",
    newline: "\n",
};

function createNode(): FlowNode & {
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

            fileName: "login-page.png",
        },
    } as FlowNode & {
        data: ScreenshotNodeData;
    };
}

describe("ScreenshotEmitter", () => {
    it("generates screenshot()", () => {
        const code = screenshotEmitter.emit(
            createNode(),
            context,
        );

        expect(code).toBe(
`screenshot(
    "login-page.png",
)`
        );
    });
});