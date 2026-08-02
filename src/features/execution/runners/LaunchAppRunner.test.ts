import {
    beforeEach,
    describe,
    expect,
    it,
    vi,
} from "vitest";

vi.mock("../services/appium/AppiumClient", () => ({
    appiumClient: {
        launchApp: vi.fn(),
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
import { launchAppRunner } from "./LaunchAppRunner";

import type {
    FlowNode,
    LaunchAppNodeData,
} from "../../flow/types/flowNode";

import type { ExecutionContext } from "../types/ExecutionContext";

const launchAppMock = vi.mocked(
    appiumClient.launchApp,
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

function createAndroidNode(): FlowNode & {
    data: LaunchAppNodeData;
} {
    return {
        id: "launch-app-1",

        type: "default",

        position: {
            x: 0,
            y: 0,
        },

        data: {
            action: "launchApp",

            title: "Launch App",

            subtitle: "",

            debug: {
                breakpoint: false,
            },

            platform: "Android",

            appPackage: "com.demo.app",

            appActivity: ".MainActivity",

            bundleId: "",

            app: "",

            noReset: true,
        },
    } as FlowNode & {
        data: LaunchAppNodeData;
    };
}

function createIOSNode(): FlowNode & {
    data: LaunchAppNodeData;
} {
    return {
        id: "launch-app-ios",

        type: "default",

        position: {
            x: 0,
            y: 0,
        },

        data: {
            action: "launchApp",

            title: "Launch App",

            subtitle: "",

            debug: {
                breakpoint: false,
            },

            platform: "iOS",

            appPackage: "",

            appActivity: "",

            bundleId: "com.demo.ios",

            app: "/Users/demo/Demo.app",

            noReset: false,
        },
    } as FlowNode & {
        data: LaunchAppNodeData;
    };
}

describe("LaunchAppRunner", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("launches Android app", async () => {
        const result =
            await launchAppRunner.run(
                createAndroidNode(),
                context,
            );

        expect(launchAppMock).toHaveBeenCalledTimes(
            1,
        );

        expect(launchAppMock).toHaveBeenCalledWith({
            platform: "Android",
            appPackage: "com.demo.app",
            appActivity: ".MainActivity",
            bundleId: "",
            app: "",
            noReset: true,
        });

        expect(successMock).toHaveBeenCalledTimes(
            1,
        );

        expect(result).toEqual({
            outputs: ["next"],
        });
    });

    it("launches iOS app", async () => {
        await launchAppRunner.run(
            createIOSNode(),
            context,
        );

        expect(launchAppMock).toHaveBeenCalledWith({
            platform: "iOS",
            appPackage: "",
            appActivity: "",
            bundleId: "com.demo.ios",
            app: "/Users/demo/Demo.app",
            noReset: false,
        });

        expect(successMock).toHaveBeenCalledTimes(
            1,
        );
    });

    it("throws when launchApp fails with Error", async () => {
        launchAppMock.mockRejectedValueOnce(
            new Error("Launch failed"),
        );

        await expect(
            launchAppRunner.run(
                createAndroidNode(),
                context,
            ),
        ).rejects.toThrow("Launch failed");

        expect(errorMock).toHaveBeenCalledTimes(
            1,
        );
    });

    it("throws when launchApp fails with non-Error", async () => {
        launchAppMock.mockRejectedValueOnce(
            "Unknown error",
        );

        await expect(
            launchAppRunner.run(
                createAndroidNode(),
                context,
            ),
        ).rejects.toBe("Unknown error");

        expect(errorMock).toHaveBeenCalledTimes(
            1,
        );
    });

    it("returns undefined when action is not launchApp", async () => {
        const node = createAndroidNode();

        node.data = {
            ...node.data,
            action: "tap",
        } as never;

        const result =
            await launchAppRunner.run(
                node,
                context,
            );

        expect(result).toBeUndefined();

        expect(launchAppMock).not.toHaveBeenCalled();

        expect(successMock).not.toHaveBeenCalled();

        expect(errorMock).not.toHaveBeenCalled();
    });
});