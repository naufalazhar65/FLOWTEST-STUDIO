import { describe, expect, it } from "vitest";

import {
    resolveModificationTarget,
} from "./resolveModificationTarget.mjs";

function createNode({
    id,
    title,
    action = title.toLowerCase(),
    locator = null,
}) {
    return {
        id,
        title,
        subtitle: title,
        action,
        locator,
        details: {},
    };
}

function createContext({
    nodes,
    edges,
    selectedNodeId = null,
}) {
    return {
        nodes,
        edges,
        selectedNodeId,
    };
}

function operation(
    type,
    targetNodeId = "model-target",
) {
    return {
        type,
        targetNodeId,
        step: {
            action:
                type === "updateNode"
                    ? "assert"
                    : "wait",
        },
    };
}

describe(
    "resolveModificationTarget",
    () => {
        it(
            "resolves the selected node",
            () => {
                const nodes = [
                    createNode({
                        id: "get-text",
                        title: "Get Text",
                        action: "getText",
                    }),
                    createNode({
                        id: "assert",
                        title: "Assert",
                        action: "assert",
                    }),
                ];

                const edges = [
                    {
                        id: "edge-1",
                        source: "get-text",
                        target: "assert",
                        type: "flow",
                    },
                ];

                const context =
                    createContext({
                        nodes,
                        edges,
                        selectedNodeId:
                            "get-text",
                    });

                const result =
                    resolveModificationTarget({
                        operation:
                            operation(
                                "addNodeBefore",
                            ),
                        context,
                        message:
                            "Tambahkan wait sebelum node yang dipilih",
                    });

                expect(
                    result,
                ).toBe(
                    "get-text",
                );
            },
        );

        it(
            "resolves the assertion after the selected node",
            () => {
                const nodes = [
                    createNode({
                        id: "get-text",
                        title: "Get Text",
                        action: "getText",
                    }),
                    createNode({
                        id: "assert",
                        title: "Assert",
                        action: "assert",
                    }),
                ];

                const edges = [
                    {
                        id: "edge-1",
                        source: "get-text",
                        target: "assert",
                        type: "flow",
                    },
                ];

                const context =
                    createContext({
                        nodes,
                        edges,
                        selectedNodeId:
                            "get-text",
                    });

                const result =
                    resolveModificationTarget({
                        operation:
                            operation(
                                "updateNode",
                            ),
                        context,
                        message:
                            "Ubah assertion setelah node yang dipilih menjadi contains Dashboard",
                    });

                expect(
                    result,
                ).toBe(
                    "assert",
                );
            },
        );

        it(
            "resolves an explicit node reference without selecting a node",
            () => {
                const nodes = [
                    createNode({
                        id: "login",
                        title: "Login",
                        action: "tap",
                    }),
                    createNode({
                        id: "assert",
                        title: "Assert",
                        action: "assert",
                    }),
                ];

                const context =
                    createContext({
                        nodes,
                        edges: [],
                    });

                const result =
                    resolveModificationTarget({
                        operation:
                            operation(
                                "addNodeBefore",
                            ),
                        context,
                        message:
                            "Tambahkan wait sebelum Login",
                    });

                expect(
                    result,
                ).toBe(
                    "login",
                );
            },
        );

        it(
            "resolves the node after an explicit reference",
            () => {
                const nodes = [
                    createNode({
                        id: "tap",
                        title: "Tap",
                        action: "tap",
                    }),
                    createNode({
                        id: "wait",
                        title: "Wait",
                        action: "wait",
                    }),
                ];

                const context =
                    createContext({
                        nodes,
                        edges: [
                            {
                                id: "edge-1",
                                source: "tap",
                                target: "wait",
                                type: "flow",
                            },
                        ],
                    });

                const result =
                    resolveModificationTarget({
                        operation:
                            operation(
                                "addNodeAfter",
                            ),
                        context,
                        message:
                            "Tambahkan delay setelah Tap",
                    });

                expect(
                    result,
                ).toBe(
                    "tap",
                );
            },
        );

        it(
            "resolves the first duplicate reference",
            () => {
                const nodes = [
                    createNode({
                        id: "login-1",
                        title: "Login",
                        action: "tap",
                    }),
                    createNode({
                        id: "login-2",
                        title: "Login",
                        action: "tap",
                    }),
                ];

                const context =
                    createContext({
                        nodes,
                        edges: [],
                    });

                const result =
                    resolveModificationTarget({
                        operation:
                            operation(
                                "addNodeBefore",
                                "login-1",
                            ),
                        context,
                        message:
                            "Tambahkan wait sebelum Login pertama",
                    });

                expect(
                    result,
                ).toBe(
                    "login-1",
                );
            },
        );

        it(
            "resolves the second duplicate reference",
            () => {
                const nodes = [
                    createNode({
                        id: "login-1",
                        title: "Login",
                        action: "tap",
                    }),
                    createNode({
                        id: "login-2",
                        title: "Login",
                        action: "tap",
                    }),
                ];

                const context =
                    createContext({
                        nodes,
                        edges: [],
                    });

                const result =
                    resolveModificationTarget({
                        operation:
                            operation(
                                "addNodeBefore",
                                "login-2",
                            ),
                        context,
                        message:
                            "Tambahkan wait sebelum Login kedua",
                    });

                expect(
                    result,
                ).toBe(
                    "login-2",
                );
            },
        );

        it(
            "resolves the last duplicate reference",
            () => {
                const nodes = [
                    createNode({
                        id: "login-1",
                        title: "Login",
                        action: "tap",
                    }),
                    createNode({
                        id: "login-2",
                        title: "Login",
                        action: "tap",
                    }),
                ];

                const context =
                    createContext({
                        nodes,
                        edges: [],
                    });

                const result =
                    resolveModificationTarget({
                        operation:
                            operation(
                                "addNodeBefore",
                            ),
                        context,
                        message:
                            "Tambahkan wait sebelum Login terakhir",
                    });

                expect(
                    result,
                ).toBe(
                    "login-2",
                );
            },
        );

        it(
            "returns null for an ambiguous reference",
            () => {
                const nodes = [
                    createNode({
                        id: "login-1",
                        title: "Login",
                        action: "tap",
                    }),
                    createNode({
                        id: "login-2",
                        title: "Login",
                        action: "tap",
                    }),
                ];

                const context =
                    createContext({
                        nodes,
                        edges: [],
                    });

                const result =
                    resolveModificationTarget({
                        operation:
                            operation(
                                "addNodeBefore",
                            ),
                        context,
                        message:
                            "Tambahkan wait sebelum Login",
                    });

                expect(
                    result,
                ).toBeNull();
            },
        );

        it(
            "resolves a reference using graph context",
            () => {
                const nodes = [
                    createNode({
                        id: "get-text",
                        title: "Get Text",
                        action: "getText",
                    }),
                    createNode({
                        id: "login-1",
                        title: "Login",
                        action: "tap",
                    }),
                    createNode({
                        id: "assert",
                        title: "Assert",
                        action: "assert",
                    }),
                ];

                const edges = [
                    {
                        id: "edge-1",
                        source: "get-text",
                        target: "login-1",
                        type: "flow",
                    },
                    {
                        id: "edge-2",
                        source: "login-1",
                        target: "assert",
                        type: "flow",
                    },
                ];

                const context =
                    createContext({
                        nodes,
                        edges,
                    });

                const result =
                    resolveModificationTarget({
                        operation:
                            operation(
                                "addNodeBefore",
                            ),
                        context,
                        message:
                            "Tambahkan wait sebelum Login setelah Get Text",
                    });

                expect(
                    result,
                ).toBe(
                    "login-1",
                );
            },
        );

        it(
            "resolves deleteNode using an explicit node reference",
            () => {
                const nodes = [
                    createNode({
                        id: "return",
                        title: "Press Return",
                        action:
                            "pressReturn",
                    }),
                ];

                const context =
                    createContext({
                        nodes,
                        edges: [],
                    });

                const result =
                    resolveModificationTarget({
                        operation:
                            operation(
                                "deleteNode",
                            ),
                        context,
                        message:
                            "Hapus Press Return",
                    });

                expect(
                    result,
                ).toBe(
                    "return",
                );
            },
        );
    },
);