import {
    describe,
    expect,
    it,
} from "vitest";

import {
    analyzeFlowQuality,
} from "./analyzeFlowQuality.mjs";

function node({
    id,
    action,
    title,
    locatorStrategy,
    locator,
    details,
}) {
    return {
        id,
        action,
        title:
            title ?? action,
        subtitle:
            title ?? action,
        locatorStrategy,
        locator,
        details,
    };
}

function edge(
    source,
    target,
) {
    return {
        id:
            `${source}-${target}`,

        source,
        target,
    };
}

describe(
    "analyzeFlowQuality",
    () => {
        it(
            "reports an empty flow",
            () => {
                const result =
                    analyzeFlowQuality({
                        nodes: [],
                        edges: [],
                    });

                expect(
                    result.score,
                ).toBe(100);

                expect(
                    result.findings[0]
                        .title,
                ).toBe(
                    "Empty flow",
                );
            },
        );

        it(
            "detects a missing assertion after a tap",
            () => {
                const tap =
                    node({
                        id: "tap",
                        action: "tap",
                        title: "Login",
                        locatorStrategy:
                            "accessibilityId",
                        locator:
                            "login",
                    });

                const result =
                    analyzeFlowQuality({
                        nodes: [
                            tap,
                        ],
                        edges: [],
                    });

                expect(
                    result.findings.some(
                        (finding) =>
                            finding.title ===
                            "Missing assertion",
                    ),
                ).toBe(
                    true,
                );
            },
        );

        it(
            "does not flag a tap when directly followed by an assertion",
            () => {
                const tap =
                    node({
                        id: "tap",
                        action: "tap",
                        title: "Login",
                        locatorStrategy:
                            "accessibilityId",
                        locator:
                            "login",
                    });

                const assertion =
                    node({
                        id: "assert",
                        action: "assert",
                        title:
                            "Assert Dashboard",
                    });

                const result =
                    analyzeFlowQuality({
                        nodes: [
                            tap,
                            assertion,
                        ],
                        edges: [
                            edge(
                                "tap",
                                "assert",
                            ),
                        ],
                    });

                expect(
                    result.findings.some(
                        (finding) =>
                            finding.title ===
                            "Missing assertion",
                    ),
                ).toBe(
                    false,
                );
            },
        );

        it(
            "detects incomplete locator data",
            () => {
                const getText =
                    node({
                        id: "get-text",
                        action:
                            "getText",
                        title:
                            "Get Text",
                        locatorStrategy:
                            "xpath",
                        locator:
                            "",
                    });

                const result =
                    analyzeFlowQuality({
                        nodes: [
                            getText,
                        ],
                        edges: [],
                    });

                expect(
                    result.findings.some(
                        (finding) =>
                            finding.title ===
                            "Incomplete locator",
                    ),
                ).toBe(
                    true,
                );
            },
        );

        it(
            "detects XPath usage",
            () => {
                const getText =
                    node({
                        id: "get-text",
                        action:
                            "getText",
                        title:
                            "Get Text",
                        locatorStrategy:
                            "xpath",
                        locator:
                            "//button",
                    });

                const result =
                    analyzeFlowQuality({
                        nodes: [
                            getText,
                        ],
                        edges: [],
                    });

                expect(
                    result.findings.some(
                        (finding) =>
                            finding.title ===
                            "XPath locator",
                    ),
                ).toBe(
                    true,
                );
            },
        );

        it(
            "detects long fixed delays",
            () => {
                const delay =
                    node({
                        id: "delay",
                        action:
                            "delay",
                        title:
                            "Delay",
                        details: {
                            duration:
                                5000,
                        },
                    });

                const result =
                    analyzeFlowQuality({
                        nodes: [
                            delay,
                        ],
                        edges: [],
                    });

                expect(
                    result.findings.some(
                        (finding) =>
                            finding.title ===
                            "Long fixed delay",
                    ),
                ).toBe(
                    true,
                );
            },
        );

        it(
            "detects duplicate locators",
            () => {
                const login1 =
                    node({
                        id: "login-1",
                        action: "tap",
                        title:
                            "Login 1",
                        locatorStrategy:
                            "accessibilityId",
                        locator:
                            "login",
                    });

                const login2 =
                    node({
                        id: "login-2",
                        action: "tap",
                        title:
                            "Login 2",
                        locatorStrategy:
                            "accessibilityId",
                        locator:
                            "login",
                    });

                const result =
                    analyzeFlowQuality({
                        nodes: [
                            login1,
                            login2,
                        ],
                        edges: [],
                    });

                const duplicates =
                    result.findings.filter(
                        (finding) =>
                            finding.title ===
                            "Duplicate locator",
                    );

                expect(
                    duplicates,
                ).toHaveLength(2);
            },
        );

        it(
            "detects a flow ending without validation",
            () => {
                const tap =
                    node({
                        id: "tap",
                        action: "tap",
                        title:
                            "Login",
                        locatorStrategy:
                            "accessibilityId",
                        locator:
                            "login",
                    });

                const result =
                    analyzeFlowQuality({
                        nodes: [
                            tap,
                        ],
                        edges: [],
                    });

                expect(
                    result.findings.some(
                        (finding) =>
                            finding.title ===
                            "Flow ends without validation",
                    ),
                ).toBe(
                    true,
                );
            },
        );

        it(
            "returns a score between 0 and 100",
            () => {
                const result =
                    analyzeFlowQuality({
                        nodes: [
                            node({
                                id: "tap",
                                action:
                                    "tap",
                                title:
                                    "Login",
                            }),
                        ],
                        edges: [],
                    });

                expect(
                    result.score,
                ).toBeGreaterThanOrEqual(
                    0,
                );

                expect(
                    result.score,
                ).toBeLessThanOrEqual(
                    100,
                );
            },
        );

        it(
    "treats tap followed by getText and assert as validated",
    () => {
        const tap =
            node({
                id: "tap",
                action: "tap",
                title: "Login",
                locatorStrategy:
                    "accessibilityId",
                locator:
                    "login",
            });

        const getText =
            node({
                id: "get-text",
                action: "getText",
                title: "Get Text",
                locatorStrategy:
                    "accessibilityId",
                locator:
                    "message",
            });

        const assertion =
            node({
                id: "assert",
                action: "assert",
                title:
                    "Assert Dashboard",
            });

        const result =
            analyzeFlowQuality({
                nodes: [
                    tap,
                    getText,
                    assertion,
                ],

                edges: [
                    edge(
                        "tap",
                        "get-text",
                    ),

                    edge(
                        "get-text",
                        "assert",
                    ),
                ],
            });

        expect(
            result.findings.some(
                (finding) =>
                    finding.nodeId ===
                        "tap" &&
                    finding.title ===
                        "No validation path",
            ),
        ).toBe(
            false,
        );

        expect(
            result.validationCoverage,
        ).toBe(100);
    },
);

it(
    "does not penalize Launch App as a missing validation by itself",
    () => {
        const launch =
            node({
                id: "launch",
                action:
                    "launchApp",
                title:
                    "Launch App",
            });

        const tap =
            node({
                id: "tap",
                action: "tap",
                title: "Login",
                locatorStrategy:
                    "accessibilityId",
                locator:
                    "login",
            });

        const result =
            analyzeFlowQuality({
                nodes: [
                    launch,
                    tap,
                ],

                edges: [
                    edge(
                        "launch",
                        "tap",
                    ),
                ],
            });

        const launchFinding =
            result.findings.find(
                (finding) =>
                    finding.nodeId ===
                    "launch" &&
                    finding.title ===
                    "No validation path",
            );

        expect(
            launchFinding?.severity,
        ).not.toBe(
            "warning",
        );
    },
);

it(
    "reports simple XPath as informational instead of a warning",
    () => {
        const getText =
            node({
                id: "get-text",
                action: "getText",
                title: "Get Text",
                locatorStrategy:
                    "xpath",
                locator:
                    "//button[@name='Login']",
            });

        const result =
            analyzeFlowQuality({
                nodes: [
                    getText,
                ],
                edges: [],
            });

        const finding =
            result.findings.find(
                (item) =>
                    item.nodeId ===
                    "get-text" &&
                    item.category ===
                    "locator",
            );

        expect(
            finding?.severity,
        ).toBe(
            "info",
        );
    },
);
    },
);