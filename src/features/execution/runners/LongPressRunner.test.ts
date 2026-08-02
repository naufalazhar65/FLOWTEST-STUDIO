import {
    beforeEach,
    describe,
    expect,
    it,
    vi,
} from "vitest";

vi.mock("../services/appium/AppiumClient", () => ({
    appiumClient: {
        longPress: vi.fn(),
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
import { longPressRunner } from "./LongPressRunner";

import type {
    FlowNode,
    LongPressNodeData,
} from "../../flow/types/flowNode";

import type { ExecutionContext } from "../types/ExecutionContext";

const longPressMock = vi.mocked(
    appiumClient.longPress,
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

function createLongPressNode(): FlowNode & {
    data: LongPressNodeData;
} {
    return {
        id: "longpress-1",

        type: "default",

        position: {
            x: 0,
            y: 0,
        },

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
    } as FlowNode & {
        data: LongPressNodeData;
    };
}

describe("LongPressRunner", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("calls appiumClient.longPress()", async () => {
        const result =
            await longPressRunner.run(
                createLongPressNode(),
                context,
            );

        expect(longPressMock)
            .toHaveBeenCalledTimes(1);

        expect(longPressMock)
            .toHaveBeenCalledWith(
                "id",
                "login_button",
                1000,
            );

        expect(successMock)
            .toHaveBeenCalledTimes(1);

        expect(result)
            .toBeUndefined();
    });

    it("throws when appiumClient.longPress() fails with Error", async () => {
        longPressMock.mockRejectedValueOnce(
            new Error("Long Press failed"),
        );

        await expect(
            longPressRunner.run(
                createLongPressNode(),
                context,
            ),
        ).rejects.toThrow(
            "Long Press failed",
        );

        expect(errorMock)
            .toHaveBeenCalledTimes(1);
    });

    it("throws when appiumClient.longPress() fails with non-Error", async () => {
        longPressMock.mockRejectedValueOnce(
            "Unknown error",
        );

        await expect(
            longPressRunner.run(
                createLongPressNode(),
                context,
            ),
        ).rejects.toBe(
            "Unknown error",
        );

        expect(errorMock)
            .toHaveBeenCalledTimes(1);
    });

    it("returns immediately when node is not LongPress", async () => {
        const node =
            createLongPressNode();

        node.data = {
            ...node.data,
            action: "tap",
        } as never;

        const result =
            await longPressRunner.run(
                node,
                context,
            );

        expect(result)
            .toBeUndefined();

        expect(longPressMock)
            .not.toHaveBeenCalled();

        expect(successMock)
            .not.toHaveBeenCalled();

        expect(errorMock)
            .not.toHaveBeenCalled();
    });
});