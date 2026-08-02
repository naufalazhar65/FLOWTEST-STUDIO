import {
    beforeEach,
    describe,
    expect,
    it,
    vi,
} from "vitest";

vi.mock("../services/appium/AppiumClient", () => ({
    appiumClient: {
        input: vi.fn(),
    },
}));

vi.mock("../variables/resolveNodeVariables", () => ({
    resolveNodeVariables: vi.fn(),
}));

vi.mock("../services/executionLogger", () => ({
    executionLogger: {
        info: vi.fn(),
        success: vi.fn(),
        warning: vi.fn(),
        error: vi.fn(),
        clear: vi.fn(),
    },
}));

import { appiumClient } from "../services/appium/AppiumClient";
import { executionLogger } from "../services/executionLogger";
import { inputRunner } from "./InputRunner";
import { resolveNodeVariables } from "../variables/resolveNodeVariables";

import type {
    FlowNode,
    InputNodeData,
} from "../../flow/types/flowNode";

import type { ExecutionContext } from "../types/ExecutionContext";

const inputMock = vi.mocked(
    appiumClient.input,
);

const resolveNodeVariablesMock = vi.mocked(
    resolveNodeVariables,
);

const successMock = vi.mocked(
    executionLogger.success,
);

const errorMock = vi.mocked(
    executionLogger.error,
);

const context: ExecutionContext = {
    edges: [],
};

function createInputNode(): FlowNode & {
    data: InputNodeData;
} {
    return {
        id: "input-1",

        type: "default",

        position: {
            x: 0,
            y: 0,
        },

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
    } as FlowNode & {
        data: InputNodeData;
    };
}

describe("InputRunner", () => {
    beforeEach(() => {
        vi.clearAllMocks();

        resolveNodeVariablesMock.mockImplementation(
            (data) => data,
        );
    });

    it("calls resolveNodeVariables()", async () => {
        await inputRunner.run(
            createInputNode(),
            context,
        );

        expect(
            resolveNodeVariablesMock,
        ).toHaveBeenCalledWith({
            locator: "username",
            text: "admin",
        });
    });

    it("calls appiumClient.input()", async () => {
        const result =
            await inputRunner.run(
                createInputNode(),
                context,
            );

        expect(inputMock)
            .toHaveBeenCalledTimes(1);

        expect(inputMock)
            .toHaveBeenCalledWith(
                "id",
                "username",
                "admin",
            );

        expect(successMock)
            .toHaveBeenCalledTimes(1);

        expect(result).toEqual({
            outputs: ["next"],
        });
    });

    it("uses resolved variables", async () => {
        resolveNodeVariablesMock.mockReturnValue({
            locator: "email",
            text: "naufal@test.com",
        });

        await inputRunner.run(
            createInputNode(),
            context,
        );

        expect(inputMock)
            .toHaveBeenCalledWith(
                "id",
                "email",
                "naufal@test.com",
            );
    });

    it("throws when appiumClient.input() fails with Error", async () => {
        inputMock.mockRejectedValueOnce(
            new Error("Input failed"),
        );

        await expect(
            inputRunner.run(
                createInputNode(),
                context,
            ),
        ).rejects.toThrow(
            "Input failed",
        );

        expect(errorMock)
            .toHaveBeenCalledTimes(1);
    });

    it("throws when appiumClient.input() fails with non-Error", async () => {
        inputMock.mockRejectedValueOnce(
            "Unknown error",
        );

        await expect(
            inputRunner.run(
                createInputNode(),
                context,
            ),
        ).rejects.toBe(
            "Unknown error",
        );

        expect(errorMock)
            .toHaveBeenCalledTimes(1);
    });

    it("returns undefined when action is not input", async () => {
        const node =
            createInputNode();

        node.data = {
            ...node.data,
            action: "tap",
        } as never;

        const result =
            await inputRunner.run(
                node,
                context,
            );

        expect(result)
            .toBeUndefined();

        expect(inputMock)
            .not.toHaveBeenCalled();

        expect(successMock)
            .not.toHaveBeenCalled();

        expect(errorMock)
            .not.toHaveBeenCalled();
    });
});