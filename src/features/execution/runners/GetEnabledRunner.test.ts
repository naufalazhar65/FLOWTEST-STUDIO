import {
    beforeEach,
    describe,
    expect,
    it,
    vi,
} from "vitest";

vi.mock("../services/appium/AppiumClient", () => ({
    appiumClient: {
        isEnabled: vi.fn(),
    },
}));

vi.mock("../utils/storeResult", () => ({
    storeResult: vi.fn(),
}));

vi.mock("../services/executionLogger", () => ({
    executionLogger: {
        success: vi.fn(),
        error: vi.fn(),
    },
}));

import { appiumClient } from "../services/appium/AppiumClient";
import { executionLogger } from "../services/executionLogger";
import { storeResult } from "../utils/storeResult";
import { getEnabledRunner } from "./GetEnabledRunner";

import type {
    FlowNode,
    GetEnabledNodeData,
} from "../../flow/types/flowNode";

import type { ExecutionContext } from "../types/ExecutionContext";

const context: ExecutionContext = {
    edges: [],
};

const successMock = vi.mocked(
    executionLogger.success,
);

const errorMock = vi.mocked(
    executionLogger.error,
);

function createGetEnabledNode(): FlowNode & {
    data: GetEnabledNodeData;
} {
    return {
        id: "node-1",

        type: "flowNode",

        position: {
            x: 0,
            y: 0,
        },

        data: {
            action: "getEnabled",

            title: "Get Enabled",

            subtitle: "",

            debug: {
                breakpoint: false,
            },

            locatorStrategy: "id",

            locator: "login_button",

            variableName: "isEnabled",
        },
    } as FlowNode & {
        data: GetEnabledNodeData;
    };
}

describe("GetEnabledRunner", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("calls appiumClient.isEnabled()", async () => {
        vi.mocked(
            appiumClient.isEnabled,
        ).mockResolvedValue(true);

        await getEnabledRunner.run(
            createGetEnabledNode(),
            context,
        );

        expect(
            appiumClient.isEnabled,
        ).toHaveBeenCalledWith(
            "id",
            "login_button",
        );
    });

    it("stores result into variable", async () => {
        vi.mocked(
            appiumClient.isEnabled,
        ).mockResolvedValue(true);

        await getEnabledRunner.run(
            createGetEnabledNode(),
            context,
        );

        expect(storeResult).toHaveBeenCalledWith(
            "isEnabled",
            true,
        );
    });

    it("returns next output", async () => {
        vi.mocked(
            appiumClient.isEnabled,
        ).mockResolvedValue(true);

        const result =
            await getEnabledRunner.run(
                createGetEnabledNode(),
                context,
            );

        expect(result).toEqual({
            outputs: ["next"],
        });

        expect(successMock).toHaveBeenCalledTimes(
            1,
        );
    });

    it("returns immediately when action is not getEnabled", async () => {
        const node =
            createGetEnabledNode();

        node.data = {
            ...node.data,
            action: "tap",
        } as never;

        const result =
            await getEnabledRunner.run(
                node,
                context,
            );

        expect(result).toBeUndefined();

        expect(
            appiumClient.isEnabled,
        ).not.toHaveBeenCalled();
    });

    it("throws when appiumClient.isEnabled rejects with Error", async () => {
        vi.mocked(
            appiumClient.isEnabled,
        ).mockRejectedValueOnce(
            new Error(
                "Element not found",
            ),
        );

        await expect(
            getEnabledRunner.run(
                createGetEnabledNode(),
                context,
            ),
        ).rejects.toThrow(
            "Element not found",
        );

        expect(errorMock).toHaveBeenCalledTimes(
            1,
        );
    });

    it("throws when appiumClient.isEnabled rejects with non-Error", async () => {
        vi.mocked(
            appiumClient.isEnabled,
        ).mockRejectedValueOnce(
            "Unknown error",
        );

        await expect(
            getEnabledRunner.run(
                createGetEnabledNode(),
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