import {
    describe,
    expect,
    it,
} from "vitest";

import {
    resolveClarificationTarget,
} from "./ollamaService.mjs";

const candidates = [
    {
        nodeId: "login-1",
        title: "Tap",
        action: "tap",
        subtitle: "Tap an element",
    },
    {
        nodeId: "login-2",
        title: "Tap",
        action: "tap",
        subtitle: "Tap an element",
    },
    {
        nodeId: "login-3",
        title: "Tap",
        action: "tap",
        subtitle: "Tap an element",
    },
];

describe(
    "resolveClarificationTarget",
    () => {
        it(
            "resolves Indonesian first candidate",
            () => {
                expect(
                    resolveClarificationTarget({
                        message:
                            "yang pertama",
                        candidates,
                    }),
                ).toEqual({
                    candidateIndex: 0,
                    targetNodeId:
                        "login-1",
                });
            },
        );

        it(
            "resolves Indonesian second candidate",
            () => {
                expect(
                    resolveClarificationTarget({
                        message:
                            "yang kedua",
                        candidates,
                    }),
                ).toEqual({
                    candidateIndex: 1,
                    targetNodeId:
                        "login-2",
                });
            },
        );

        it(
            "resolves Indonesian third candidate",
            () => {
                expect(
                    resolveClarificationTarget({
                        message:
                            "yang ketiga",
                        candidates,
                    }),
                ).toEqual({
                    candidateIndex: 2,
                    targetNodeId:
                        "login-3",
                });
            },
        );

        it(
            "resolves English first candidate",
            () => {
                expect(
                    resolveClarificationTarget({
                        message:
                            "the first one",
                        candidates,
                    }),
                ).toEqual({
                    candidateIndex: 0,
                    targetNodeId:
                        "login-1",
                });
            },
        );

        it(
            "resolves English second candidate",
            () => {
                expect(
                    resolveClarificationTarget({
                        message:
                            "the second one",
                        candidates,
                    }),
                ).toEqual({
                    candidateIndex: 1,
                    targetNodeId:
                        "login-2",
                });
            },
        );

        it(
            "resolves numeric candidate",
            () => {
                expect(
                    resolveClarificationTarget({
                        message:
                            "node 2",
                        candidates,
                    }),
                ).toEqual({
                    candidateIndex: 1,
                    targetNodeId:
                        "login-2",
                });
            },
        );

        it(
            "resolves Indonesian numeric candidate",
            () => {
                expect(
                    resolveClarificationTarget({
                        message:
                            "yang ke-2",
                        candidates,
                    }),
                ).toEqual({
                    candidateIndex: 1,
                    targetNodeId:
                        "login-2",
                });
            },
        );

        it(
            "resolves the last candidate",
            () => {
                expect(
                    resolveClarificationTarget({
                        message:
                            "yang terakhir",
                        candidates,
                    }),
                ).toEqual({
                    candidateIndex: 2,
                    targetNodeId:
                        "login-3",
                });
            },
        );

        it(
            "returns null for an unrelated reply",
            () => {
                expect(
                    resolveClarificationTarget({
                        message:
                            "ya, lanjutkan",
                        candidates,
                    }),
                ).toEqual({
                    candidateIndex: null,
                    targetNodeId: null,
                });
            },
        );

        it(
            "returns null when there are no candidates",
            () => {
                expect(
                    resolveClarificationTarget({
                        message:
                            "yang kedua",
                        candidates: [],
                    }),
                ).toEqual({
                    candidateIndex: null,
                    targetNodeId: null,
                });
            },
        );

        it(
            "returns null for an out-of-range numeric candidate",
            () => {
                expect(
                    resolveClarificationTarget({
                        message:
                            "node 9",
                        candidates,
                    }),
                ).toEqual({
                    candidateIndex: null,
                    targetNodeId: null,
                });
            },
        );
    },
);