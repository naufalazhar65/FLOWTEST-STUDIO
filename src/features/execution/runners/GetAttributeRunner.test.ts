import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("../services/appium/AppiumClient", () => ({
    appiumClient: {
        getAttribute: vi.fn(),
    },
}));

vi.mock("../utils/storeResult", () => ({
    storeResult: vi.fn(),
}));

import { appiumClient } from "../services/appium/AppiumClient";
import { storeResult } from "../utils/storeResult";
import { getAttributeRunner } from "./GetAttributeRunner";

import type {
    FlowNode,
    GetAttributeNodeData,
} from "../../flow/types/flowNode";

import type { ExecutionContext } from "../types/ExecutionContext";

const context: ExecutionContext = {
    edges: [],
};

function createGetAttributeNode(): FlowNode & {
    data: GetAttributeNodeData;
} {
    return {
        id: "node-1",

        type: "flowNode",

        position: {
            x: 0,
            y: 0,
        },

        data: {
            action: "getAttribute",

            title: "Get Attribute",

            subtitle: "",

            debug: {
                breakpoint: false,
            },

            locatorStrategy: "id",

            locator: "login_button",

            attribute: "content-desc",

            variableName: "buttonLabel",
        },
    } as FlowNode & {
        data: GetAttributeNodeData;
    };
}

describe("GetAttributeRunner", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("calls appiumClient.getAttribute()", async () => {
        vi.mocked(
            appiumClient.getAttribute,
        ).mockResolvedValue("Login");

        await getAttributeRunner.run(
            createGetAttributeNode(),
            context,
        );

        expect(
            appiumClient.getAttribute,
        ).toHaveBeenCalledWith(
            "id",
            "login_button",
            "content-desc",
        );
    });

    it("stores result into variable", async () => {
        vi.mocked(
            appiumClient.getAttribute,
        ).mockResolvedValue("Login");

        await getAttributeRunner.run(
            createGetAttributeNode(),
            context,
        );

        expect(storeResult).toHaveBeenCalledWith(
            "buttonLabel",
            "Login",
        );
    });

    it("returns next output", async () => {
        vi.mocked(
            appiumClient.getAttribute,
        ).mockResolvedValue("Login");

        const result =
            await getAttributeRunner.run(
                createGetAttributeNode(),
                context,
            );

        expect(result).toEqual({
            outputs: ["next"],
        });
    });

    it("returns undefined when action does not match", async () => {
    const result = await getAttributeRunner.run(
        {
            ...createGetAttributeNode(),
            data: {
                ...createGetAttributeNode().data,
                action: "tap",
            },
        } as never,
        context,
    );

    expect(result).toBeUndefined();

    expect(appiumClient.getAttribute).not.toHaveBeenCalled();
    expect(storeResult).not.toHaveBeenCalled();
});

it("throws when appiumClient.getAttribute throws Error", async () => {
    const error = new Error("Appium failed");

    vi.mocked(
        appiumClient.getAttribute,
    ).mockRejectedValue(error);

    await expect(
        getAttributeRunner.run(
            createGetAttributeNode(),
            context,
        ),
    ).rejects.toThrow("Appium failed");

    expect(storeResult).not.toHaveBeenCalled();
});

it("throws when appiumClient.getAttribute throws string", async () => {
    vi.mocked(
        appiumClient.getAttribute,
    ).mockRejectedValue("Unknown error");

    await expect(
        getAttributeRunner.run(
            createGetAttributeNode(),
            context,
        ),
    ).rejects.toBe("Unknown error");

    expect(storeResult).not.toHaveBeenCalled();
});
});