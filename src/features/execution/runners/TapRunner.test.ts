import {
    beforeEach,
    describe,
    expect,
    it,
    vi,
} from "vitest";

vi.mock("../services/appium/AppiumClient", () => ({
    appiumClient: {
        tap: vi.fn(),
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
import { tapRunner } from "./TapRunner";

import type {
    FlowNode,
    TapNodeData,
} from "../../flow/types/flowNode";

import type { ExecutionContext } from "../types/ExecutionContext";

const tapMock = vi.mocked(
    appiumClient.tap,
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

describe("TapRunner", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("calls appiumClient.tap()", async () => {
        const result =
            await tapRunner.run(
                createTapNode(),
                context,
            );

        expect(tapMock).toHaveBeenCalledTimes(
            1,
        );

        expect(tapMock).toHaveBeenCalledWith(
            "id",
            "login_button",
        );

        expect(successMock).toHaveBeenCalledTimes(
            1,
        );

        expect(result).toEqual({
            outputs: ["next"],
        });
    });

    it("throws when appiumClient.tap() fails with Error", async () => {
        tapMock.mockRejectedValueOnce(
            new Error("Tap failed"),
        );

        await expect(
            tapRunner.run(
                createTapNode(),
                context,
            ),
        ).rejects.toThrow(
            "Tap failed",
        );

        expect(errorMock).toHaveBeenCalledTimes(
            1,
        );
    });

    it("throws when appiumClient.tap() fails with non-Error", async () => {
        tapMock.mockRejectedValueOnce(
            "Unknown error",
        );

        await expect(
            tapRunner.run(
                createTapNode(),
                context,
            ),
        ).rejects.toBe(
            "Unknown error",
        );

        expect(errorMock).toHaveBeenCalledTimes(
            1,
        );
    });
});