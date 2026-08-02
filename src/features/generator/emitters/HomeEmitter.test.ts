import { describe, expect, it } from "vitest";

import { homeEmitter } from "./HomeEmitter";

import type {
    FlowNode,
    HomeNodeData,
} from "../../flow/types/flowNode";

import type { GeneratorContext } from "../types/GeneratorContext";

const context: GeneratorContext = {
    framework: "selenium-python-mobile",
    indent: "    ",
    newline: "\n",
};

function createNode(): FlowNode & {
    data: HomeNodeData;
} {
    return {
        id: "home-1",

        type: "default",

        position: {
            x: 0,
            y: 0,
        },

        data: {
            action: "home",

            title: "Home",

            subtitle: "",

            debug: {
                breakpoint: false,
            },
        },
    } as FlowNode & {
        data: HomeNodeData;
    };
}

describe("HomeEmitter", () => {
    it("generates home()", () => {
        const code = homeEmitter.emit(
            createNode(),
            context,
        );

        expect(code).toBe(
            `home()`
        );
    });
});