import {
    describe,
    expect,
    it,
} from "vitest";

import { generateNode } from "./generateNode";

import type {
    FlowNode,
    TapNodeData,
} from "../../flow/types/flowNode";

import type { GeneratorContext } from "../types/GeneratorContext";

const context: GeneratorContext = {
    framework:
        "selenium-python-mobile",

    indent: "    ",

    newline: "\n",
};

function createTapNode(): FlowNode & {
    data: TapNodeData;
} {
    return {
        id: "tap-1",

        type: "default",

        position: {
            x: 0,
            y: 0,
        },

        data: {
            action: "tap",

            title: "Tap",

            subtitle: "",

            debug: {
                breakpoint: false,
            },

            locatorStrategy: "id",

            locator: "login_button",
        },
    } as FlowNode & {
        data: TapNodeData;
    };
}

describe("generateNode", () => {
    it("delegates generation to TapEmitter", () => {
        const code =
            generateNode(
                createTapNode(),
                context,
            );

        expect(code).toContain("tap(");

        expect(code).toContain(
            "AppiumBy.ID",
        );

        expect(code).toContain(
            '"login_button"',
        );
    });

    it("generates input node", () => {
        const node = {
            ...createTapNode(),

            data: {
                action: "input",

                title: "Input",

                subtitle: "",

                debug: {
                    breakpoint: false,
                },

                locatorStrategy: "id",

                locator: "username",

                text: "admin",
            },
        } as FlowNode;

        const code =
            generateNode(
                node,
                context,
            );

        expect(code).toContain(
            "input(",
        );

        expect(code).toContain(
            '"admin"',
        );
    });

    it("generates double tap node", () => {
        const node = {
            ...createTapNode(),

            data: {
                action: "doubleTap",

                title: "Double Tap",

                subtitle: "",

                debug: {
                    breakpoint: false,
                },

                locatorStrategy: "id",

                locator: "login_button",
            },
        } as FlowNode;

        const code =
            generateNode(
                node,
                context,
            );

        expect(code).toContain(
            "double_tap(",
        );

        expect(code).toContain(
            '"login_button"',
        );
    });

    it("generates long press node", () => {
        const node = {
            ...createTapNode(),

            data: {
                action: "longPress",

                title: "Long Press",

                subtitle: "",

                debug: {
                    breakpoint: false,
                },

                locatorStrategy: "id",

                locator: "login_button",

                duration: 1000,
            },
        } as FlowNode;

        const code =
            generateNode(
                node,
                context,
            );

        expect(code).toContain(
            "long_press(",
        );

        expect(code).toContain(
            "1000",
        );
    });
});