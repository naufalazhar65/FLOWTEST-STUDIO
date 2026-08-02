import {
    beforeEach,
    describe,
    expect,
    it,
    vi,
} from "vitest";

vi.mock("../services/appium/AppiumClient", () => ({
    appiumClient: {
        back: vi.fn(),
    },
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
import { backRunner } from "./BackRunner";

import type {
    BackNodeData,
    FlowNode,
} from "../../flow/types/flowNode";

import type { ExecutionContext } from "../types/ExecutionContext";

const backMock = vi.mocked(
    appiumClient.back,
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

function createBackNode(): FlowNode & {
    data: BackNodeData;
} {
    return {
        id: "back-1",

        type: "default",

        position: {
            x: 0,
            y: 0,
        },

        data: {
            action: "back",

            title: "Back",

            subtitle: "",

            debug: {
                breakpoint: false,
            },
        },
    } as FlowNode & {
        data: BackNodeData;
    };
}

describe("BackRunner", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("calls appiumClient.back()", async () => {
        const result =
            await backRunner.run(
                createBackNode(),
                context,
            );

        expect(backMock)
            .toHaveBeenCalledTimes(1);

        expect(successMock)
            .toHaveBeenCalledTimes(1);

        expect(result).toEqual({
            outputs: ["next"],
        });
    });

    it("throws when appiumClient.back() fails with Error", async () => {
        backMock.mockRejectedValueOnce(
            new Error("Back failed"),
        );

        await expect(
            backRunner.run(
                createBackNode(),
                context,
            ),
        ).rejects.toThrow(
            "Back failed",
        );

        expect(errorMock)
            .toHaveBeenCalledTimes(1);
    });

    it("throws when appiumClient.back() fails with non-Error", async () => {
        backMock.mockRejectedValueOnce(
            "Unknown error",
        );

        await expect(
            backRunner.run(
                createBackNode(),
                context,
            ),
        ).rejects.toBe(
            "Unknown error",
        );

        expect(errorMock)
            .toHaveBeenCalledTimes(1);
    });

    it("returns undefined when action is not back", async () => {
        const node =
            createBackNode();

        node.data = {
            ...node.data,
            action: "tap",
        } as never;

        const result =
            await backRunner.run(
                node,
                context,
            );

        expect(result)
            .toBeUndefined();

        expect(backMock)
            .not.toHaveBeenCalled();

        expect(successMock)
            .not.toHaveBeenCalled();

        expect(errorMock)
            .not.toHaveBeenCalled();
    });
});