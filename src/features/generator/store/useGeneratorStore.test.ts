import { describe, expect, it } from "vitest";

import { useGeneratorStore } from "./useGeneratorStore";

describe(
    "useGeneratorStore",
    () => {

        it(
            "sets generated code",
            () => {

                useGeneratorStore
                    .getState()
                    .setCode(
                        "print()",
                    );

                expect(
                    useGeneratorStore
                        .getState()
                        .code,
                ).toBe(
                    "print()",
                );
            },
        );

        it(
            "clears generated code",
            () => {

                useGeneratorStore
                    .getState()
                    .setCode(
                        "abc",
                    );

                useGeneratorStore
                    .getState()
                    .clear();

                expect(
                    useGeneratorStore
                        .getState()
                        .code,
                ).toBe("");
            },
        );
    },
);