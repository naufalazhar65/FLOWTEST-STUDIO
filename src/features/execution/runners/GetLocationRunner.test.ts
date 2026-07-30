import { beforeEach, describe, expect, it, vi } from "vitest";

import type {
    FlowNode,
    GetLocationNodeData,
} from "../../flow/types/flowNode";
import type { ExecutionContext } from "../types/ExecutionContext";

import { getLocationRunner } from "./GetLocationRunner";
import { appiumClient } from "../services/appium/AppiumClient";
import { executeGetter } from "../utils/executeGetter";

vi.mock("../services/AppiumClient", () => ({
    appiumClient: {
        getLocation: vi.fn(),
    },
}));

vi.mock("../utils/executeGetter", () => ({
    executeGetter: vi.fn(),
}));

describe("GetLocationRunner", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    const context = {} as ExecutionContext;

    const node: FlowNode & {
        data: GetLocationNodeData;
    } = {
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
    };

    it("should delegate execution to executeGetter()", async () => {
        vi.mocked(executeGetter).mockResolvedValue({
            outputs: ["next"],
        });

        await getLocationRunner.run(node, context);

        expect(executeGetter).toHaveBeenCalledTimes(1);
    });

    it("should pass variable name and label", async () => {
        vi.mocked(executeGetter).mockResolvedValue({
            outputs: ["next"],
        });

        await getLocationRunner.run(node, context);

        expect(executeGetter).toHaveBeenCalledWith(
            expect.any(Function),
            {
                variableName: "location",
                label: "Location",
            },
        );
    });

    it("should call appiumClient.getLocation()", async () => {
        vi.mocked(appiumClient.getLocation).mockResolvedValue({
            x: 120,
            y: 300,
        });

        vi.mocked(executeGetter).mockImplementation(
            async (getter) => {
                await getter();

                return {
                    outputs: ["next"],
                };
            },
        );

        await getLocationRunner.run(node, context);

        expect(appiumClient.getLocation).toHaveBeenCalledWith(
            "id",
            "login_button",
        );
    });
});