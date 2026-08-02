import {
    beforeEach,
    describe,
    expect,
    it,
    vi,
} from "vitest";

vi.mock("../services/appium/AppiumClient", () => ({
    appiumClient: {
        elementExists: vi.fn(),
    },
}));

vi.mock("../utils/storeResult", () => ({
    storeResult: vi.fn(),
}));

import { appiumClient } from "../services/appium/AppiumClient";
import { storeResult } from "../utils/storeResult";
import { elementExistsRunner } from "./ElementExistsRunner";

import type {
    ElementExistsNodeData,
    FlowNode,
} from "../../flow/types/flowNode";

import type { ExecutionContext } from "../types/ExecutionContext";

const context: ExecutionContext = {
    edges: [],
};

const elementExistsMock = vi.mocked(
    appiumClient.elementExists,
);

const storeResultMock = vi.mocked(
    storeResult,
);

function createElementExistsNode(): FlowNode & {
    data: ElementExistsNodeData;
} {
    return {
        id: "element-exists-1",

        type: "default",

        position: {
            x: 0,
            y: 0,
        },

        data: {
            action: "elementExists",

            title: "Element Exists",

            subtitle: "",

            debug: {
                breakpoint: false,
            },

            locatorStrategy: "id",

            locator: "login_button",

            variableName: "loginVisible",
        },
    } as FlowNode & {
        data: ElementExistsNodeData;
    };
}

describe("ElementExistsRunner", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("calls appiumClient.elementExists()", async () => {
        elementExistsMock.mockResolvedValue(
            true,
        );

        const result =
            await elementExistsRunner.run(
                createElementExistsNode(),
                context,
            );

        expect(
            elementExistsMock,
        ).toHaveBeenCalledTimes(1);

        expect(
            elementExistsMock,
        ).toHaveBeenCalledWith(
            "id",
            "login_button",
        );

        expect(
            storeResultMock,
        ).toHaveBeenCalledWith(
            "loginVisible",
            true,
        );

        expect(result).toEqual({
            outputs: ["next"],
        });
    });

    it("stores false result into variable", async () => {
        elementExistsMock.mockResolvedValue(
            false,
        );

        await elementExistsRunner.run(
            createElementExistsNode(),
            context,
        );

        expect(
            storeResultMock,
        ).toHaveBeenCalledWith(
            "loginVisible",
            false,
        );
    });

    it("returns immediately when action is not elementExists", async () => {
        const node =
            createElementExistsNode();

        node.data = {
            ...node.data,
            action: "tap",
        } as never;

        const result =
            await elementExistsRunner.run(
                node,
                context,
            );

        expect(result).toBeUndefined();

        expect(
            elementExistsMock,
        ).not.toHaveBeenCalled();

        expect(
            storeResultMock,
        ).not.toHaveBeenCalled();
    });
});