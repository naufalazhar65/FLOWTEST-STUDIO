import {
    describe,
    expect,
    it,
} from "vitest";

import type {
    NodeExecutionResult,
} from "../types/NodeExecutionResult";

import type {
    FailureContext,
} from "./buildFailureContext";

import {
    suggestLocatorRepair,
} from "./suggestLocatorRepair";

function createExecution(
    overrides: Partial<NodeExecutionResult> = {},
): NodeExecutionResult {
    return {
        nodeId: "node-1",
        nodeType: "tap",
        nodeTitle: "Primary action",
        status: "failed",
        startedAt: 1000,
        finishedAt: 2000,
        duration: 1000,
        locatorStrategy: "id",
        locator: "old-target",
        error: "Element not found",
        screenshot: undefined,
        screenshotFileName: undefined,
        pageSource: undefined,
        ...overrides,
    };
}

function createContext(
    overrides: Partial<FailureContext["node"]> = {},
    executionOverrides: Partial<NodeExecutionResult> = {},
): FailureContext {
    return {
        node: {
            id: "node-1",
            action: "tap",
            title: "Primary action",
            subtitle: "Tap primary action",
            locatorStrategy: "id",
            locator: "old-target",
            ...overrides,
        },

        execution:
            createExecution(
                executionOverrides,
            ),

        previousNodeIds: [],

        previousNodes: [],

        nextNodeIds: [],

        nextNodes: [],
    };
}

describe(
    "suggestLocatorRepair",
    () => {
        it(
            "returns null when locator evidence is missing",
            () => {
                const context =
                    createContext({
                        locator:
                            null,
                    });

                expect(
                    suggestLocatorRepair(
                        context,
                    ),
                ).toBeNull();
            },
        );

        it(
            "returns null when page source is missing",
            () => {
                const context =
                    createContext(
                        {},
                        {
                            pageSource:
                                undefined,
                        },
                    );

                expect(
                    suggestLocatorRepair(
                        context,
                    ),
                ).toBeNull();
            },
        );

        it(
            "returns null when locator strategy is missing",
            () => {
                const context =
                    createContext({
                        locatorStrategy:
                            null,
                    });

                expect(
                    suggestLocatorRepair(
                        context,
                    ),
                ).toBeNull();
            },
        );

        it(
            "returns null for invalid page source",
            () => {
                const context =
                    createContext(
                        {},
                        {
                            pageSource:
                                "<invalid",
                        },
                    );

                expect(
                    suggestLocatorRepair(
                        context,
                    ),
                ).toBeNull();
            },
        );

        it(
            "repairs a locator when the same strategy remains valid",
            () => {
                const context =
                    createContext(
                        {},
                        {
                            pageSource:
                                `
                                    <hierarchy>
                                        <node
                                            resource-id="new-target"
                                            class="android.widget.Button"
                                            text="Continue"
                                        />
                                    </hierarchy>
                                `,
                        },
                    );

                const result =
                    suggestLocatorRepair(
                        context,
                    );

                expect(
                    result,
                ).not.toBeNull();

                expect(
                    result?.currentLocator,
                ).toBe(
                    "old-target",
                );

                expect(
                    result?.suggestedLocator,
                ).toBe(
                    "new-target",
                );

                expect(
                    result?.locatorStrategy,
                ).toBe(
                    "id",
                );
            },
        );
        it(
            "does not depend on a specific element name",
            () => {
                const context =
                    createContext(
                        {
                            title:
                                "Secondary action",

                            subtitle:
                                "Tap secondary action",

                            locator:
                                "target-action",
                        },
                        {
                            pageSource:
                                `
                            <hierarchy>
                                <node
                                    resource-id="target-action-new"
                                    class="android.widget.Button"
                                    text="Proceed"
                                />
                            </hierarchy>
                        `,
                        },
                    );

                const result =
                    suggestLocatorRepair(
                        context,
                    );

                expect(
                    result,
                ).not.toBeNull();

                expect(
                    result?.suggestedLocator,
                ).toBe(
                    "target-action-new",
                );
            },
        );

        it(
            "uses the strongest matching element instead of the first element",
            () => {
                const context =
                    createContext(
                        {
                            locator:
                                "target-action",
                        },
                        {
                            pageSource:
                                `
                                    <hierarchy>
                                        <node
                                            resource-id="unrelated-control"
                                            class="android.widget.Button"
                                            text="Cancel"
                                        />

                                        <node
                                            resource-id="target-action-new"
                                            class="android.widget.Button"
                                            text="Target Action"
                                        />
                                    </hierarchy>
                                `,
                        },
                    );

                const result =
                    suggestLocatorRepair(
                        context,
                    );

                expect(
                    result,
                ).not.toBeNull();

                expect(
                    result?.suggestedLocator,
                ).toBe(
                    "target-action-new",
                );
            },
        );

        it(
            "can recover using a different locator strategy",
            () => {
                const context =
                    createContext(
                        {
                            locatorStrategy:
                                "id",

                            locator:
                                "target-action",
                        },
                        {
                            locatorStrategy:
                                "id",

                            locator:
                                "target-action",

                            pageSource:
                                `
                            <hierarchy>
                                <node
                                    content-desc="target-action"
                                    class="android.widget.Button"
                                    text="Proceed"
                                />
                            </hierarchy>
                        `,
                        },
                    );

                const result =
                    suggestLocatorRepair(
                        context,
                    );

                expect(
                    result,
                ).not.toBeNull();

                expect(
                    result?.suggestedLocator,
                ).toBe(
                    "target-action",
                );

                expect(
                    result?.locatorStrategy,
                ).toBe(
                    "accessibilityId",
                );
            },
        );

                it(
            "prefers a unique locator over a duplicated locator",
            () => {
                const context =
                    createContext(
                        {
                            locator:
                                "target-action",
                        },
                        {
                            pageSource:
                                `
                                    <hierarchy>
                                        <node
                                            resource-id="target-action"
                                            class="android.widget.Button"
                                            text="Target Action"
                                        />

                                        <node
                                            resource-id="target-action"
                                            class="android.widget.Button"
                                            text="Target Action"
                                        />

                                        <node
                                            resource-id="target-action-unique"
                                            class="android.widget.Button"
                                            text="Target Action"
                                        />
                                    </hierarchy>
                                `,
                        },
                    );

                const result =
                    suggestLocatorRepair(
                        context,
                    );

                expect(
                    result,
                ).not.toBeNull();

                expect(
                    result?.suggestedLocator,
                ).toBe(
                    "target-action-unique",
                );

                expect(
                    result?.locatorStrategy,
                ).toBe(
                    "id",
                );
            },
        );

                it(
            "returns null when no candidate has sufficient evidence",
            () => {
                const context =
                    createContext(
                        {
                            locator:
                                "target-action",
                        },
                        {
                            pageSource:
                                `
                                    <hierarchy>
                                        <node
                                            resource-id="com.app.cancel"
                                            class="android.widget.Button"
                                            text="Cancel"
                                        />

                                        <node
                                            resource-id="com.app.settings"
                                            class="android.widget.Button"
                                            text="Settings"
                                        />

                                        <node
                                            resource-id="com.app.help"
                                            class="android.widget.Button"
                                            text="Help"
                                        />
                                    </hierarchy>
                                `,
                        },
                    );

                const result =
                    suggestLocatorRepair(
                        context,
                    );

                expect(
                    result,
                ).toBeNull();
            },
        );

                it(
            "returns null when multiple candidates are equally ambiguous",
            () => {
                const context =
                    createContext(
                        {
                            locator:
                                "target-action",
                        },
                        {
                            pageSource:
                                `
                                    <hierarchy>
                                        <node
                                            resource-id="target-action-primary"
                                            class="android.widget.Button"
                                            text="Target Action"
                                        />

                                        <node
                                            resource-id="target-action-secondary"
                                            class="android.widget.Button"
                                            text="Target Action"
                                        />
                                    </hierarchy>
                                `,
                        },
                    );

                const result =
                    suggestLocatorRepair(
                        context,
                    );

                expect(
                    result,
                ).toBeNull();
            },
        );
    },
);