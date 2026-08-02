import {
    beforeEach,
    describe,
    expect,
    it,
    vi,
} from "vitest";

vi.mock("../services/appium/AppiumClient", () => ({
    appiumClient: {
        waitUntilElement: vi.fn(),
    },
}));

vi.mock("../services/executionLogger", () => ({
    executionLogger: {
        success: vi.fn(),
        error: vi.fn(),
    },
}));

vi.mock("../variables/resolveNodeVariables", () => ({
    resolveNodeVariables: vi.fn((value) => value),
}));

import { appiumClient } from "../services/appium/AppiumClient";
import { executionLogger } from "../services/executionLogger";
import { resolveNodeVariables } from "../variables/resolveNodeVariables";
import { waitRunner } from "./WaitRunner";

import type { ExecutionContext } from "../types/ExecutionContext";
import type {
    FlowNode,
    WaitNodeData,
} from "../../flow/types/flowNode";

const context: ExecutionContext = {
    edges: [],
};

const waitUntilElementMock = vi.mocked(
    appiumClient.waitUntilElement,
);

const successMock = vi.mocked(
    executionLogger.success,
);

const errorMock = vi.mocked(
    executionLogger.error,
);

const resolveNodeVariablesMock = vi.mocked(
    resolveNodeVariables,
);

function createWaitNode(): FlowNode & {
    data: WaitNodeData;
} {
    return {
        id: "wait-1",

        type: "default",

        position: {
            x: 0,
            y: 0,
        },

        data: {
            action: "wait",

            title: "Wait",

            subtitle: "",

            debug: {
                breakpoint: false,
            },

            locatorStrategy: "id",

            locator: "login_button",

            timeout: 10000,

            pollingInterval: 500,
        },
    } as FlowNode & {
        data: WaitNodeData;
    };
}

describe("WaitRunner", () => {
    beforeEach(() => {
        vi.clearAllMocks();

        resolveNodeVariablesMock.mockImplementation(
            (value) => value,
        );
    });

    it("calls appiumClient.waitUntilElement", async () => {
        const result =
            await waitRunner.run(
                createWaitNode(),
                context,
            );

        expect(resolveNodeVariablesMock)
            .toHaveBeenCalledWith({
                locator: "login_button",
            });

        expect(waitUntilElementMock)
            .toHaveBeenCalledTimes(1);

        expect(waitUntilElementMock)
            .toHaveBeenCalledWith(
                "id",
                "login_button",
                10000,
                500,
            );

        expect(successMock)
            .toHaveBeenCalledTimes(1);

        expect(result).toEqual({
            outputs: ["next"],
        });
    });

    it("returns immediately when action is not wait", async () => {
        const node =
            createWaitNode();

        node.data = {
            ...node.data,
            action: "tap",
        } as never;

        const result =
            await waitRunner.run(
                node,
                context,
            );

        expect(result)
            .toBeUndefined();

        expect(waitUntilElementMock)
            .not.toHaveBeenCalled();

        expect(successMock)
            .not.toHaveBeenCalled();

        expect(errorMock)
            .not.toHaveBeenCalled();
    });

    it("throws when waitUntilElement rejects with Error", async () => {
        waitUntilElementMock.mockRejectedValueOnce(
            new Error(
                "Element not found",
            ),
        );

        await expect(
            waitRunner.run(
                createWaitNode(),
                context,
            ),
        ).rejects.toThrow(
            "Element not found",
        );

        expect(errorMock)
            .toHaveBeenCalledTimes(1);
    });

    it("throws when waitUntilElement rejects with non-Error", async () => {
        waitUntilElementMock.mockRejectedValueOnce(
            "Unknown error",
        );

        await expect(
            waitRunner.run(
                createWaitNode(),
                context,
            ),
        ).rejects.toBe(
            "Unknown error",
        );

        expect(errorMock)
            .toHaveBeenCalledTimes(1);
    });
});