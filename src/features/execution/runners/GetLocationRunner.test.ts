import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("../services/appium/AppiumClient", () => ({
    appiumClient: {
        getLocation: vi.fn(),
    },
}));

vi.mock("../utils/storeResult", () => ({
    storeResult: vi.fn(),
}));

import { appiumClient } from "../services/appium/AppiumClient";
import { storeResult } from "../utils/storeResult";
import { getLocationRunner } from "./GetLocationRunner";

import type {
    FlowNode,
    GetLocationNodeData,
} from "../../flow/types/flowNode";

import type { ExecutionContext } from "../types/ExecutionContext";

const context: ExecutionContext = {
    edges: [],
};

function createGetLocationNode(): FlowNode & {
    data: GetLocationNodeData;
} {
    return {
        id: "node-1",

        type: "flowNode",

        position: {
            x: 0,
            y: 0,
        },

        data: {
            action: "getLocation",

            title: "Get Location",

            subtitle: "",

            debug: {
                breakpoint: false,
            },

            locatorStrategy: "id",

            locator: "login_button",

            variableName: "location",
        },
    } as FlowNode & {
        data: GetLocationNodeData;
    };
}

describe("GetLocationRunner", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("calls appiumClient.getLocation()", async () => {
        vi.mocked(
            appiumClient.getLocation,
        ).mockResolvedValue({
            x: 120,
            y: 300,
        });

        await getLocationRunner.run(
            createGetLocationNode(),
            context,
        );

        expect(
            appiumClient.getLocation,
        ).toHaveBeenCalledWith(
            "id",
            "login_button",
        );
    });

    it("stores result into variable", async () => {
        vi.mocked(
            appiumClient.getLocation,
        ).mockResolvedValue({
            x: 120,
            y: 300,
        });

        await getLocationRunner.run(
            createGetLocationNode(),
            context,
        );

        expect(storeResult).toHaveBeenCalledWith(
            "location",
            {
                x: 120,
                y: 300,
            },
        );
    });

    it("returns next output", async () => {
        vi.mocked(
            appiumClient.getLocation,
        ).mockResolvedValue({
            x: 120,
            y: 300,
        });

        const result =
            await getLocationRunner.run(
                createGetLocationNode(),
                context,
            );

        expect(result).toEqual({
            outputs: ["next"],
        });
    });

    it("returns undefined when action does not match", async () => {
        const result = await getLocationRunner.run(
            {
                ...createGetLocationNode(),
                data: {
                    ...createGetLocationNode().data,
                    action: "tap",
                },
            } as never,
            context,
        );

        expect(result).toBeUndefined();

        expect(
            appiumClient.getLocation,
        ).not.toHaveBeenCalled();

        expect(storeResult).not.toHaveBeenCalled();
    });

    it("throws when appiumClient.getLocation throws Error", async () => {
        const error = new Error("Appium failed");

        vi.mocked(
            appiumClient.getLocation,
        ).mockRejectedValue(error);

        await expect(
            getLocationRunner.run(
                createGetLocationNode(),
                context,
            ),
        ).rejects.toThrow("Appium failed");

        expect(storeResult).not.toHaveBeenCalled();
    });

    it("throws when appiumClient.getLocation throws string", async () => {
        vi.mocked(
            appiumClient.getLocation,
        ).mockRejectedValue("Unknown error");

        await expect(
            getLocationRunner.run(
                createGetLocationNode(),
                context,
            ),
        ).rejects.toBe("Unknown error");

        expect(storeResult).not.toHaveBeenCalled();
    });
});