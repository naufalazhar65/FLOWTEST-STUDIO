import {
    beforeEach,
    describe,
    expect,
    it,
    vi,
} from "vitest";

const initialNodes = [
    {
        id:
            "node-username",

        data: {
            action:
                "input",

            title:
                "Input Username",

            subtitle:
                "Type text",

            locatorStrategy:
                "accessibilityId",

            locator:
                "username",

            text:
                "naufal",
        },
    },

    {
        id:
            "node-password",

        data: {
            action:
                "input",

            title:
                "Input Password",

            subtitle:
                "Type text",

            locatorStrategy:
                "accessibilityId",

            locator:
                "password",

            text:
                "secret",
        },
    },

    {
        id:
            "node-login",

        data: {
            action:
                "tap",

            title:
                "Tap Login",

            subtitle:
                "Tap element",

            locatorStrategy:
                "accessibilityId",

            locator:
                "login",
        },
    },

    {
        id:
            "node-assert",

        data: {
            action:
                "assert",

            title:
                "Assert Dashboard",

            subtitle:
                "Verify result",

            actual:
                "Dashboard",

            operator:
                "contains",

            expected:
                "Dashboard",
        },
    },
];

const flowState =
    vi.hoisted(
        () => ({
            nodes:
                [] as Array<{
                    id:
                    string;

                    data:
                    Record<
                        string,
                        unknown
                    >;
                }>,
        }),
    );

const mocks =
    vi.hoisted(
        () => ({
            resolveAILocatorFromApp:
                vi.fn(),

            updateNodeData:
                vi.fn(),
        }),
    );

vi.mock(
    "../../flow/store/useFlowStore",
    () => ({
        useFlowStore: {
            getState:
                vi.fn(
                    () => ({
                        nodes:
                            flowState.nodes,

                        updateNodeData:
                            mocks.updateNodeData,
                    }),
                ),
        },
    }),
);

vi.mock(
    "./resolveAILocatorFromApp",
    () => ({
        resolveAILocatorFromApp:
            mocks.resolveAILocatorFromApp,
    }),
);

import {
    applyResolvedAILocatorsToFlow,
} from "./applyResolvedAILocatorsToFlow";

describe(
    "applyResolvedAILocatorsToFlow",
    () => {
        beforeEach(() => {
            vi.resetAllMocks();

            /*
             * Always restore the flow fixture
             * before every test.
             *
             * This prevents mutations from the
             * previous test from leaking into
             * the next test.
             */
            flowState.nodes =
                structuredClone(
                    initialNodes,
                );

            mocks.updateNodeData
                .mockImplementation(
                    (
                        nodeId,
                        patch,
                    ) => {
                        const node =
                            flowState.nodes.find(
                                (
                                    currentNode,
                                ) =>
                                    currentNode.id ===
                                    nodeId,
                            );

                        if (!node) {
                            return;
                        }

                        node.data = {
                            ...node.data,
                            ...patch,
                        };
                    },
                );
        });

        it(
            "applies resolved locators to locator-based nodes",
            async () => {
                mocks.resolveAILocatorFromApp
                    .mockImplementation(
                        async (
                            target:
                                string,
                        ) => {
                            let resolved:
                                | {
                                    strategy:
                                    | "id"
                                    | "xpath"
                                    | "accessibilityId";

                                    value:
                                    string;
                                }
                                | undefined;

                            switch (
                            target
                            ) {
                                case "username":
                                    resolved = {
                                        strategy:
                                            "id",

                                        value:
                                            "com.demo:id/username_input",
                                    };

                                    break;

                                case "password":
                                    resolved = {
                                        strategy:
                                            "id",

                                        value:
                                            "com.demo:id/password_input",
                                    };

                                    break;

                                case "login":
                                    resolved = {
                                        strategy:
                                            "id",

                                        value:
                                            "com.demo:id/login_button",
                                    };

                                    break;

                                default:
                                    resolved =
                                        undefined;
                            }

                            if (
                                !resolved
                            ) {
                                return {
                                    status:
                                        "notFound",

                                    target,

                                    selected:
                                        null,

                                    candidates:
                                        [],

                                    matchedElementId:
                                        null,
                                };
                            }

                            return {
                                status:
                                    "resolved",

                                target,

                                selected: {
                                    strategy:
                                        resolved.strategy,

                                    value:
                                        resolved.value,

                                    score:
                                        100,

                                    recommended:
                                        true,
                                },

                                candidates:
                                    [],

                                matchedElementId:
                                    `${target}-element`,
                            };
                        },
                    );

                const result =
                    await applyResolvedAILocatorsToFlow();

                expect(
                    result.success,
                ).toBe(
                    true,
                );

                expect(
                    result.resolved,
                ).toBe(
                    3,
                );

                expect(
                    result.unresolved,
                ).toBe(
                    0,
                );

                expect(
                    mocks.updateNodeData,
                ).toHaveBeenCalledTimes(
                    3,
                );

                expect(
                    mocks.updateNodeData,
                ).toHaveBeenCalledWith(
                    "node-username",
                    {
                        locatorStrategy:
                            "id",

                        locator:
                            "com.demo:id/username_input",
                    },
                );

                expect(
                    mocks.updateNodeData,
                ).toHaveBeenCalledWith(
                    "node-password",
                    {
                        locatorStrategy:
                            "id",

                        locator:
                            "com.demo:id/password_input",
                    },
                );

                expect(
                    mocks.updateNodeData,
                ).toHaveBeenCalledWith(
                    "node-login",
                    {
                        locatorStrategy:
                            "id",

                        locator:
                            "com.demo:id/login_button",
                    },
                );
            },
        );

        it(
            "resolves only the supplied node ids",
            async () => {
                mocks.resolveAILocatorFromApp
                    .mockImplementation(
                        async (
                            target: string,
                        ) => ({
                            status:
                                "resolved",

                            target,

                            selected: {
                                strategy:
                                    "id",

                                value:
                                    `com.demo:id/${target}`,

                                score:
                                    100,

                                recommended:
                                    true,
                            },

                            candidates:
                                [],

                            matchedElementId:
                                `${target}-element`,
                        }),
                    );

                const result =
                    await applyResolvedAILocatorsToFlow(
                        new Set([
                            "node-login",
                        ]),
                    );

                expect(
                    result.success,
                ).toBe(
                    true,
                );

                expect(
                    result.resolved,
                ).toBe(
                    1,
                );

                expect(
                    result.unresolved,
                ).toBe(
                    0,
                );

                expect(
                    mocks.resolveAILocatorFromApp,
                ).toHaveBeenCalledTimes(
                    1,
                );

                expect(
                    mocks.resolveAILocatorFromApp,
                ).toHaveBeenCalledWith(
                    "login",
                    "tap",
                );

                expect(
                    mocks.updateNodeData,
                ).toHaveBeenCalledTimes(
                    1,
                );

                expect(
                    mocks.updateNodeData,
                ).toHaveBeenCalledWith(
                    "node-login",
                    {
                        locatorStrategy:
                            "id",

                        locator:
                            "com.demo:id/login",
                    },
                );
            },
        );

        it(
            "does not modify a node when locator resolution fails",
            async () => {
                mocks.resolveAILocatorFromApp
                    .mockResolvedValue({
                        status:
                            "notFound",

                        target:
                            "username",

                        selected:
                            null,

                        candidates:
                            [],

                        matchedElementId:
                            null,

                        error:
                            "Element not found.",
                    });

                const result =
                    await applyResolvedAILocatorsToFlow();

                expect(
                    result.success,
                ).toBe(
                    false,
                );

                expect(
                    result.resolved,
                ).toBe(
                    0,
                );

                expect(
                    result.unresolved,
                ).toBe(
                    3,
                );

                expect(
                    mocks.updateNodeData,
                ).not.toHaveBeenCalled();
            },
        );

        it(
            "does not partially modify the flow when one locator cannot be resolved",
            async () => {
                mocks.resolveAILocatorFromApp
                    .mockImplementation(
                        async (
                            target:
                                string,
                        ) => {
                            if (
                                target ===
                                "password"
                            ) {
                                return {
                                    status:
                                        "notFound",

                                    target,

                                    selected:
                                        null,

                                    candidates:
                                        [],

                                    matchedElementId:
                                        null,

                                    error:
                                        "Password element not found.",
                                };
                            }

                            return {
                                status:
                                    "resolved",

                                target,

                                selected: {
                                    strategy:
                                        "id",

                                    value:
                                        `com.demo:id/${target}`,

                                    score:
                                        100,

                                    recommended:
                                        true,
                                },

                                candidates:
                                    [],

                                matchedElementId:
                                    `${target}-element`,
                            };
                        },
                    );

                const result =
                    await applyResolvedAILocatorsToFlow();

                expect(
                    result.success,
                ).toBe(
                    false,
                );

                expect(
                    result.resolved,
                ).toBe(
                    2,
                );

                expect(
                    result.unresolved,
                ).toBe(
                    1,
                );

                expect(
                    result.results.find(
                        (
                            item,
                        ) =>
                            item.target ===
                            "password",
                    )?.status,
                ).toBe(
                    "notFound",
                );

                expect(
                    mocks.updateNodeData,
                ).not.toHaveBeenCalled();
            },
        );

        it(
            "does not modify nodes when the resolver reports ambiguity",
            async () => {
                mocks.resolveAILocatorFromApp
                    .mockResolvedValue({
                        status:
                            "ambiguous",

                        target:
                            "username",

                        selected:
                            null,

                        candidates:
                            [
                                {
                                    strategy:
                                        "id",

                                    value:
                                        "user_one",

                                    score:
                                        90,

                                    recommended:
                                        false,
                                },

                                {
                                    strategy:
                                        "id",

                                    value:
                                        "user_two",

                                    score:
                                        88,

                                    recommended:
                                        false,
                                },
                            ],

                        matchedElementId:
                            null,
                    });

                const result =
                    await applyResolvedAILocatorsToFlow();

                expect(
                    result.success,
                ).toBe(
                    false,
                );

                expect(
                    result.resolved,
                ).toBe(
                    0,
                );

                expect(
                    result.unresolved,
                ).toBe(
                    3,
                );

                expect(
                    mocks.updateNodeData,
                ).not.toHaveBeenCalled();
            },
        );

        it(
            "does not modify nodes when Appium is unavailable",
            async () => {
                mocks.resolveAILocatorFromApp
                    .mockResolvedValue({
                        status:
                            "unavailable",

                        target:
                            "username",

                        selected:
                            null,

                        candidates:
                            [],

                        matchedElementId:
                            null,

                        error:
                            "No active Appium session.",
                    });

                const result =
                    await applyResolvedAILocatorsToFlow();

                expect(
                    result.success,
                ).toBe(
                    false,
                );

                expect(
                    result.resolved,
                ).toBe(
                    0,
                );

                expect(
                    result.unresolved,
                ).toBe(
                    3,
                );

                expect(
                    mocks.updateNodeData,
                ).not.toHaveBeenCalled();
            },
        );
    },
);