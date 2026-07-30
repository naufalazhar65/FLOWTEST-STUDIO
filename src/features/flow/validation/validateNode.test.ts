import { describe, expect, it } from "vitest";

import { validateNode } from "./validateNode";

import type {
    AssertNodeData,
    DelayNodeData,
    ElementExistsNodeData,
    GetAttributeNodeData,
    GetCurrentActivityNodeData,
    GetCurrentPackageNodeData,
    GetDeviceNameNodeData,
    GetDeviceTimeNodeData,
    GetDisplayedNodeData,
    GetEnabledNodeData,
    GetOrientationNodeData,
    GetPlatformVersionNodeData,
    GetSelectedNodeData,
    GetTextNodeData,
    InputNodeData,
    SetVariableNodeData,
    TapNodeData,
} from "../types/flowNode";

function createTapNode(
    overrides: Partial<TapNodeData> = {},
): TapNodeData {
    return {
        action: "tap",
        title: "Tap",
        subtitle: "",
        debug: {
            breakpoint: false,
        },
        locatorStrategy: "id",
        locator: "id=username",
        ...overrides,
    };
}

function createInputNode(
    overrides: Partial<InputNodeData> = {},
): InputNodeData {
    return {
        action: "input",
        title: "Input",
        subtitle: "",
        debug: {
            breakpoint: false,
        },
        locatorStrategy: "id",
        locator: "id=username",
        text: "admin",
        ...overrides,
    };
}

function createAssertNode(
    overrides: Partial<AssertNodeData> = {},
): AssertNodeData {
    return {
        action: "assert",
        title: "Assert",
        subtitle: "",
        debug: {
            breakpoint: false,
        },
        locatorStrategy: "id",
        locator: "id=status",
        expected: "success",
        ...overrides,
    };
}

function createSetVariableNode(
    overrides: Partial<SetVariableNodeData> = {},
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
    overrides: Partial<DelayNodeData> = {},
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

/* -------------------------------------------------------------------------- */
/*                               Element Getters                              */
/* -------------------------------------------------------------------------- */

function createGetTextNode(
    overrides: Partial<GetTextNodeData> = {},
): GetTextNodeData {
    return {
        action: "getText",
        title: "Get Text",
        subtitle: "",
        debug: {
            breakpoint: false,
        },
        locatorStrategy: "id",
        locator: "login_button",
        variableName: "result",
        ...overrides,
    };
}

function createGetAttributeNode(
    overrides: Partial<GetAttributeNodeData> = {},
): GetAttributeNodeData {
    return {
        action: "getAttribute",
        title: "Get Attribute",
        subtitle: "",
        debug: {
            breakpoint: false,
        },
        locatorStrategy: "id",
        locator: "login_button",
        variableName: "result",
        attribute: "text",
        ...overrides,
    };
}

function createElementExistsNode(
    overrides: Partial<ElementExistsNodeData> = {},
): ElementExistsNodeData {
    return {
        action: "elementExists",
        title: "Element Exists",
        subtitle: "",
        debug: {
            breakpoint: false,
        },
        locatorStrategy: "id",
        locator: "login_button",
        variableName: "result",
        ...overrides,
    };
}

function createGetDisplayedNode(
    overrides: Partial<GetDisplayedNodeData> = {},
): GetDisplayedNodeData {
    return {
        action: "getDisplayed",
        title: "Get Displayed",
        subtitle: "",
        debug: {
            breakpoint: false,
        },
        locatorStrategy: "id",
        locator: "login_button",
        variableName: "result",
        ...overrides,
    };
}

function createGetEnabledNode(
    overrides: Partial<GetEnabledNodeData> = {},
): GetEnabledNodeData {
    return {
        action: "getEnabled",
        title: "Get Enabled",
        subtitle: "",
        debug: {
            breakpoint: false,
        },
        locatorStrategy: "id",
        locator: "login_button",
        variableName: "result",
        ...overrides,
    };
}

function createGetSelectedNode(
    overrides: Partial<GetSelectedNodeData> = {},
): GetSelectedNodeData {
    return {
        action: "getSelected",
        title: "Get Selected",
        subtitle: "",
        debug: {
            breakpoint: false,
        },
        locatorStrategy: "id",
        locator: "login_button",
        variableName: "result",
        ...overrides,
    };
}

/* -------------------------------------------------------------------------- */
/*                               Device Getters                               */
/* -------------------------------------------------------------------------- */

function createGetCurrentActivityNode(
    overrides: Partial<GetCurrentActivityNodeData> = {},
): GetCurrentActivityNodeData {
    return {
        action: "getCurrentActivity",
        title: "Get Current Activity",
        subtitle: "",
        debug: {
            breakpoint: false,
        },
        variableName: "result",
        ...overrides,
    };
}

function createGetCurrentPackageNode(
    overrides: Partial<GetCurrentPackageNodeData> = {},
): GetCurrentPackageNodeData {
    return {
        action: "getCurrentPackage",
        title: "Get Current Package",
        subtitle: "",
        debug: {
            breakpoint: false,
        },
        variableName: "result",
        ...overrides,
    };
}

function createGetOrientationNode(
    overrides: Partial<GetOrientationNodeData> = {},
): GetOrientationNodeData {
    return {
        action: "getOrientation",
        title: "Get Orientation",
        subtitle: "",
        debug: {
            breakpoint: false,
        },
        variableName: "result",
        ...overrides,
    };
}

function createGetPlatformVersionNode(
    overrides: Partial<GetPlatformVersionNodeData> = {},
): GetPlatformVersionNodeData {
    return {
        action: "getPlatformVersion",
        title: "Get Platform Version",
        subtitle: "",
        debug: {
            breakpoint: false,
        },
        variableName: "result",
        ...overrides,
    };
}

function createGetDeviceNameNode(
    overrides: Partial<GetDeviceNameNodeData> = {},
): GetDeviceNameNodeData {
    return {
        action: "getDeviceName",
        title: "Get Device Name",
        subtitle: "",
        debug: {
            breakpoint: false,
        },
        variableName: "result",
        ...overrides,
    };
}

function createGetDeviceTimeNode(
    overrides: Partial<GetDeviceTimeNodeData> = {},
): GetDeviceTimeNodeData {
    return {
        action: "getDeviceTime",
        title: "Get Device Time",
        subtitle: "",
        debug: {
            breakpoint: false,
        },
        variableName: "result",
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
            }),
        );

        expect(result.valid).toBe(false);
        expect(result.errors).toContain(
            "Locator is required.",
        );
    });

    it("requires locator strategy", () => {
        const result = validateNode(
            createTapNode({
                locatorStrategy: "",
            }),
        );

        expect(result.valid).toBe(false);
        expect(result.errors).toContain(
            "Locator strategy is required.",
        );
    });

    it("accepts valid input node", () => {
        const result = validateNode(createInputNode());

        expect(result.valid).toBe(true);
        expect(result.errors).toEqual([]);
    });

    it("requires input text", () => {
        const result = validateNode(
            createInputNode({
                text: "",
            }),
        );

        expect(result.valid).toBe(false);
        expect(result.errors).toContain(
            "Text is required.",
        );
    });

    it("accepts valid assert node", () => {
        const result = validateNode(createAssertNode());

        expect(result.valid).toBe(true);
        expect(result.errors).toEqual([]);
    });

    it("requires expected value", () => {
        const result = validateNode(
            createAssertNode({
                expected: "",
            }),
        );

        expect(result.valid).toBe(false);
        expect(result.errors).toContain(
            "Expected value is required.",
        );
    });

    it("requires variable name", () => {
        const result = validateNode(
            createSetVariableNode({
                variableName: "",
            }),
        );

        expect(result.valid).toBe(false);
        expect(result.errors).toContain(
            "Variable name is required.",
        );
    });

    it("requires variable value", () => {
        const result = validateNode(
            createSetVariableNode({
                value: "",
            }),
        );

        expect(result.valid).toBe(false);
        expect(result.errors).toContain(
            "Value is required.",
        );
    });

    it("accepts valid delay node", () => {
        const result = validateNode(createDelayNode());

        expect(result.valid).toBe(true);
        expect(result.errors).toEqual([]);
    });

    it("rejects zero duration", () => {
        const result = validateNode(
            createDelayNode({
                duration: 0,
            }),
        );

        expect(result.valid).toBe(false);
        expect(result.errors).toContain(
            "Duration must be greater than 0.",
        );
    });

    it("rejects negative duration", () => {
        const result = validateNode(
            createDelayNode({
                duration: -1,
            }),
        );

        expect(result.valid).toBe(false);
        expect(result.errors).toContain(
            "Duration must be greater than 0.",
        );
    });
});

describe("Element Getter nodes", () => {
    const factories = [
        {
            name: "getText",
            create: createGetTextNode,
        },
        {
            name: "getAttribute",
            create: createGetAttributeNode,
        },
        {
            name: "elementExists",
            create: createElementExistsNode,
        },
        {
            name: "getDisplayed",
            create: createGetDisplayedNode,
        },
        {
            name: "getEnabled",
            create: createGetEnabledNode,
        },
        {
            name: "getSelected",
            create: createGetSelectedNode,
        },
    ] as const;

    it.each(factories)(
        "accepts valid $name node",
        ({ create }) => {
            const result = validateNode(create());

            expect(result.valid).toBe(true);
            expect(result.errors).toEqual([]);
        },
    );

    it.each(factories)(
        "requires locator for $name",
        ({ create }) => {
            const result = validateNode(
                create({
                    locator: "",
                }),
            );

            expect(result.valid).toBe(false);
            expect(result.errors).toContain(
                "Locator is required.",
            );
        },
    );

    it.each(factories)(
        "requires locator strategy for $name",
        ({ create }) => {
            const result = validateNode(
                create({
                    locatorStrategy: "",
                }),
            );

            expect(result.valid).toBe(false);
            expect(result.errors).toContain(
                "Locator strategy is required.",
            );
        },
    );

    it.each(factories)(
        "requires variable name for $name",
        ({ create }) => {
            const result = validateNode(
                create({
                    variableName: "",
                }),
            );

            expect(result.valid).toBe(false);
            expect(result.errors).toContain(
                "Variable name is required.",
            );
        },
    );
});

describe("Device Getter nodes", () => {
    const factories = [
        {
            name: "getCurrentActivity",
            create: createGetCurrentActivityNode,
        },
        {
            name: "getCurrentPackage",
            create: createGetCurrentPackageNode,
        },
        {
            name: "getOrientation",
            create: createGetOrientationNode,
        },
        {
            name: "getPlatformVersion",
            create: createGetPlatformVersionNode,
        },
        {
            name: "getDeviceName",
            create: createGetDeviceNameNode,
        },
        {
            name: "getDeviceTime",
            create: createGetDeviceTimeNode,
        },
    ] as const;

    it.each(factories)(
        "accepts valid $name node",
        ({ create }) => {
            const result = validateNode(create());

            expect(result.valid).toBe(true);
            expect(result.errors).toEqual([]);
        },
    );

    it.each(factories)(
        "requires variable name for $name",
        ({ create }) => {
            const result = validateNode(
                create({
                    variableName: "",
                }),
            );

            expect(result.valid).toBe(false);
            expect(result.errors).toContain(
                "Variable name is required.",
            );
        },
    );
});