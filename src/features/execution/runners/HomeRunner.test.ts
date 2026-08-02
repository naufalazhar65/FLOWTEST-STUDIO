import {
    beforeEach,
    describe,
    expect,
    it,
    vi,
} from "vitest";

vi.mock("../services/appium/AppiumClient", () => ({
    appiumClient: {
        home: vi.fn(),
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
import { homeRunner } from "./HomeRunner";

import type {
    FlowNode,
    HomeNodeData,
} from "../../flow/types/flowNode";

import type { ExecutionContext } from "../types/ExecutionContext";

const homeMock = vi.mocked(
    appiumClient.home,
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

function createHomeNode(): FlowNode & {
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

describe("HomeRunner", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("calls appiumClient.home()", async () => {
        const result =
            await homeRunner.run(
                createHomeNode(),
                context,
            );

        expect(homeMock)
            .toHaveBeenCalledTimes(1);

        expect(successMock)
            .toHaveBeenCalledTimes(1);

        expect(result).toEqual({
            outputs: ["next"],
        });
    });

    it("throws when appiumClient.home() fails with Error", async () => {
        homeMock.mockRejectedValueOnce(
            new Error("Home failed"),
        );

        await expect(
            homeRunner.run(
                createHomeNode(),
                context,
            ),
        ).rejects.toThrow(
            "Home failed",
        );

        expect(errorMock)
            .toHaveBeenCalledTimes(1);
    });

    it("throws when appiumClient.home() fails with non-Error", async () => {
        homeMock.mockRejectedValueOnce(
            "Unknown error",
        );

        await expect(
            homeRunner.run(
                createHomeNode(),
                context,
            ),
        ).rejects.toBe(
            "Unknown error",
        );

        expect(errorMock)
            .toHaveBeenCalledTimes(1);
    });

    it("returns undefined when action is not home", async () => {
        const node =
            createHomeNode();

        node.data = {
            ...node.data,
            action: "tap",
        } as never;

        const result =
            await homeRunner.run(
                node,
                context,
            );

        expect(result)
            .toBeUndefined();

        expect(homeMock)
            .not.toHaveBeenCalled();

        expect(successMock)
            .not.toHaveBeenCalled();

        expect(errorMock)
            .not.toHaveBeenCalled();
    });
});