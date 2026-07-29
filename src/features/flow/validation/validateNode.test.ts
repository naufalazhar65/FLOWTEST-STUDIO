import { describe, expect, it } from "vitest";

import { validateNode } from "./validateNode";

import type {
    AssertNodeData,
    DelayNodeData,
    InputNodeData,
    SetVariableNodeData,
    TapNodeData,
} from "../types/flowNode";

function createTapNode(
    overrides: Partial<TapNodeData> = {}
): TapNodeData {
    return {
        action: "tap",
        title: "Tap",
        subtitle: "",
        debug: {
            breakpoint: false,
        },
        locator: "id=username",
        locatorStrategy: "id",
        ...overrides,
    };
}

function createInputNode(
    overrides: Partial<InputNodeData> = {}
): InputNodeData {
    return {
        action: "input",
        title: "Input",
        subtitle: "",
        debug: {
            breakpoint: false,
        },
        locator: "id=username",
        locatorStrategy: "id",
        text: "admin",
        ...overrides,
    };
}

function createAssertNode(
    overrides: Partial<AssertNodeData> = {}
): AssertNodeData {
    return {
        action: "assert",
        title: "Assert",
        subtitle: "",
        debug: {
            breakpoint: false,
        },
        locator: "id=status",
        locatorStrategy: "id",
        expected: "success",
        ...overrides,
    };
}

function createSetVariableNode(
    overrides: Partial<SetVariableNodeData> = {}
): SetVariableNodeData {
    return {
        action: "setVariable",
        title: "Set Variable",
        subtitle: "",
        debug: {
            breakpoint: false,
        },
        variableName: "username",
        value: "admin",
        ...overrides,
    };
}

function createDelayNode(
    overrides: Partial<DelayNodeData> = {}
): DelayNodeData {
    return {
        action: "delay",
        title: "Delay",
        subtitle: "",
        debug: {
            breakpoint: false,
        },
        duration: 1000,
        ...overrides,
    };
}

describe("validateNode", () => {
    it("accepts valid tap node", () => {
        const result = validateNode(createTapNode());

        expect(result.valid).toBe(true);
        expect(result.errors).toEqual([]);
    });

    it("requires locator", () => {
        const result = validateNode(
            createTapNode({
                locator: "",
            })
        );

        expect(result.valid).toBe(false);
        expect(result.errors).toContain(
            "Locator is required."
        );
    });

    it("requires locator strategy", () => {
        const result = validateNode(
            createTapNode({
                locatorStrategy: "",
            })
        );

        expect(result.valid).toBe(false);
        expect(result.errors).toContain(
            "Locator strategy is required."
        );
    });

    it("requires input text", () => {
        const result = validateNode(
            createInputNode({
                text: "",
            })
        );

        expect(result.valid).toBe(false);
        expect(result.errors).toContain(
            "Text is required."
        );
    });

    it("requires expected value", () => {
        const result = validateNode(
            createAssertNode({
                expected: "",
            })
        );

        expect(result.valid).toBe(false);
        expect(result.errors).toContain(
            "Expected value is required."
        );
    });

    it("requires variable name", () => {
        const result = validateNode(
            createSetVariableNode({
                variableName: "",
            })
        );

        expect(result.valid).toBe(false);
        expect(result.errors).toContain(
            "Variable name is required."
        );
    });

    it("requires variable value", () => {
        const result = validateNode(
            createSetVariableNode({
                value: "",
            })
        );

        expect(result.valid).toBe(false);
        expect(result.errors).toContain(
            "Value is required."
        );
    });

    it("rejects zero duration", () => {
        const result = validateNode(
            createDelayNode({
                duration: 0,
            })
        );

        expect(result.valid).toBe(false);
        expect(result.errors).toContain(
            "Duration must be greater than 0."
        );
    });

    it("rejects negative duration", () => {
        const result = validateNode(
            createDelayNode({
                duration: -1,
            })
        );

        expect(result.valid).toBe(false);
        expect(result.errors).toContain(
            "Duration must be greater than 0."
        );
    });

    it("accepts valid delay node", () => {
        const result = validateNode(createDelayNode());

        expect(result.valid).toBe(true);
        expect(result.errors).toEqual([]);
    });

    it("accepts valid input node", () => {
        const result = validateNode(createInputNode());

        expect(result.valid).toBe(true);
        expect(result.errors).toEqual([]);
    });

    it("accepts valid assert node", () => {
        const result = validateNode(createAssertNode());

        expect(result.valid).toBe(true);
        expect(result.errors).toEqual([]);
    });
});