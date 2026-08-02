import {
    beforeEach,
    describe,
    expect,
    it,
    vi,
} from "vitest";

vi.mock("../services/appium/AppiumClient", () => ({
    appiumClient: {
        closeApp: vi.fn(),
    },
}));

vi.mock("../services/executionLogger", () => ({
    executionLogger: {
        success: vi.fn(),
        error: vi.fn(),
    },
}));

import { appiumClient } from "../services/appium/AppiumClient";
import { executionLogger } from "../services/executionLogger";
import { closeAppRunner } from "./CloseAppRunner";

import type { ExecutionContext } from "../types/ExecutionContext";

import type {
    CloseAppNodeData,
    FlowNode,
} from "../../flow/types/flowNode";

const closeAppMock = vi.mocked(
    appiumClient.closeApp,
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

function createCloseAppNode(): FlowNode & {
    data: CloseAppNodeData;
} {
    return {
        id: "close-app-1",

        type: "default",

        position: {
            x: 0,
            y: 0,
        },

        data: {
            action: "closeApp",

            title: "Close App",

            subtitle: "",

            debug: {
                breakpoint: false,
            },

            platform: "Android",

            appPackage: "com.demo.app",

            bundleId: "",
        },
    } as FlowNode & {
        data: CloseAppNodeData;
    };
}

function createIOSNode(): FlowNode & {
    data: CloseAppNodeData;
} {
    return {
        ...createCloseAppNode(),

        data: {
            ...createCloseAppNode().data,

            platform: "iOS",

            appPackage: "",

            bundleId: "com.demo.ios",
        },
    } as FlowNode & {
        data: CloseAppNodeData;
    };
}

describe("CloseAppRunner", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("calls appiumClient.closeApp() for Android", async () => {
        const result = await closeAppRunner.run(
            createCloseAppNode(),
            context,
        );

        expect(closeAppMock).toHaveBeenCalledTimes(
            1,
        );

        expect(closeAppMock).toHaveBeenCalledWith({
            platform: "Android",
            appPackage: "com.demo.app",
            bundleId: "",
        });

        expect(successMock).toHaveBeenCalledTimes(
            1,
        );

        expect(result).toEqual({
            outputs: ["next"],
        });
    });

    it("calls appiumClient.closeApp() for iOS", async () => {
        const result = await closeAppRunner.run(
            createIOSNode(),
            context,
        );

        expect(closeAppMock).toHaveBeenCalledTimes(
            1,
        );

        expect(closeAppMock).toHaveBeenCalledWith({
            platform: "iOS",
            appPackage: "",
            bundleId: "com.demo.ios",
        });

        expect(successMock).toHaveBeenCalledTimes(
            1,
        );

        expect(result).toEqual({
            outputs: ["next"],
        });
    });

    it("throws when Android closeApp fails", async () => {
        closeAppMock.mockRejectedValueOnce(
            new Error("Failed to close app"),
        );

        await expect(
            closeAppRunner.run(
                createCloseAppNode(),
                context,
            ),
        ).rejects.toThrow(
            "Failed to close app",
        );

        expect(errorMock).toHaveBeenCalledTimes(
            1,
        );
    });

    it("throws when iOS closeApp fails", async () => {
        closeAppMock.mockRejectedValueOnce(
            "Unknown error",
        );

        await expect(
            closeAppRunner.run(
                createIOSNode(),
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