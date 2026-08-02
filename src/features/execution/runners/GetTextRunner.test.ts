import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("../services/appium/AppiumClient", () => ({
    appiumClient: {
        getText: vi.fn(),
    },
}));

vi.mock("../utils/executeElementGetter", () => ({
    executeElementGetter: vi.fn(),
}));

import { appiumClient } from "../services/appium/AppiumClient";
import { executeElementGetter } from "../utils/executeElementGetter";
import { getTextRunner } from "./GetTextRunner";

import type {
    FlowNode,
    GetTextNodeData,
} from "../../flow/types/flowNode";

import type { ExecutionContext } from "../types/ExecutionContext";

const context: ExecutionContext = {
    edges: [],
};

function createGetTextNode(): FlowNode & {
    data: GetTextNodeData;
} {
    return {
        id: "node-1",

        type: "flowNode",

        position: {
            x: 0,
            y: 0,
        },

        data: {
            action: "getText",

            title: "Get Text",

            subtitle: "",

            debug: {
                breakpoint: false,
            },

            locatorStrategy: "id",

            locator: "login_button",

            variableName: "buttonText",
        },
    } as FlowNode & {
        data: GetTextNodeData;
    };
}

describe("GetTextRunner", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("delegates execution to executeElementGetter()", async () => {
        vi.mocked(
            executeElementGetter,
        ).mockResolvedValue({
            outputs: ["next"],
        });

        await getTextRunner.run(
            createGetTextNode(),
            context,
        );

        expect(
            executeElementGetter,
        ).toHaveBeenCalledTimes(1);
    });

    it("passes variable name and label", async () => {
        vi.mocked(
            executeElementGetter,
        ).mockResolvedValue({
            outputs: ["next"],
        });

        await getTextRunner.run(
            createGetTextNode(),
            context,
        );

        expect(
            executeElementGetter,
        ).toHaveBeenCalledWith(
            expect.any(Function),
            "buttonText",
            "Text",
        );
    });

    it("calls appiumClient.getText()", async () => {
        vi.mocked(
            appiumClient.getText,
        ).mockResolvedValue("Login");

        vi.mocked(
            executeElementGetter,
        ).mockImplementation(
            async (getter) => {
                await getter();

                return {
                    outputs: ["next"],
                };
            },
        );

        await getTextRunner.run(
            createGetTextNode(),
            context,
        );

        expect(
            appiumClient.getText,
        ).toHaveBeenCalledWith(
            "id",
            "login_button",
        );
    });

    it("returns next output", async () => {
        vi.mocked(
            executeElementGetter,
        ).mockResolvedValue({
            outputs: ["next"],
        });

        const result =
            await getTextRunner.run(
                createGetTextNode(),
                context,
            );

        expect(result).toEqual({
            outputs: ["next"],
        });
    });

    it("returns undefined when action does not match", async () => {
        const result = await getTextRunner.run(
            {
                ...createGetTextNode(),
                data: {
                    ...createGetTextNode().data,
                    action: "tap",
                },
            } as never,
            context,
        );

        expect(result).toBeUndefined();

        expect(executeElementGetter).not.toHaveBeenCalled();

        expect(appiumClient.getText).not.toHaveBeenCalled();
    });

    it("throws when appiumClient.getText fails", async () => {
        const error = new Error("Appium failed");

        vi.mocked(appiumClient.getText).mockRejectedValue(error);

        vi.mocked(executeElementGetter).mockImplementation(
            async (getter) => {
                await getter();

                return {
                    outputs: ["next"],
                };
            },
        );

        await expect(
            getTextRunner.run(
                createGetTextNode(),
                context,
            ),
        ).rejects.toThrow("Appium failed");
    });

    it("handles non-Error exceptions", async () => {
        vi.mocked(appiumClient.getText).mockRejectedValue("Unknown error");

        vi.mocked(executeElementGetter).mockImplementation(
            async (getter) => {
                await getter();

                return {
                    outputs: ["next"],
                };
            },
        );

        await expect(
            getTextRunner.run(
                createGetTextNode(),
                context,
            ),
        ).rejects.toBe("Unknown error");
    });
});