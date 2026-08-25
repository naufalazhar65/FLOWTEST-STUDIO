import {
    beforeEach,
    describe,
    expect,
    it,
} from "vitest";

import {
    useExecutionRetryStore,
} from "./useExecutionRetryStore";

describe(
    "useExecutionRetryStore",
    () => {
        beforeEach(() => {
            useExecutionRetryStore
                .getState()
                .reset();
        });

        it(
            "starts with retry disabled",
            () => {
                const state =
                    useExecutionRetryStore.getState();

                expect(
                    state.enabled,
                ).toBe(false);

                expect(
                    state.maxAttempts,
                ).toBe(2);

                expect(
                    state.retryDelayMs,
                ).toBe(500);
            },
        );

        it(
            "updates retry settings",
            () => {
                const store =
                    useExecutionRetryStore.getState();

                store.setEnabled(true);

                store.setMaxAttempts(4);

                store.setRetryDelayMs(
                    1000,
                );

                const state =
                    useExecutionRetryStore.getState();

                expect(
                    state.enabled,
                ).toBe(true);

                expect(
                    state.maxAttempts,
                ).toBe(4);

                expect(
                    state.retryDelayMs,
                ).toBe(1000);
            },
        );

        it(
            "clamps max attempts",
            () => {
                const store =
                    useExecutionRetryStore.getState();

                store.setMaxAttempts(99);

                expect(
                    useExecutionRetryStore
                        .getState()
                        .maxAttempts,
                ).toBe(5);

                store.setMaxAttempts(1);

                expect(
                    useExecutionRetryStore
                        .getState()
                        .maxAttempts,
                ).toBe(2);
            },
        );

        it(
            "clamps retry delay",
            () => {
                const store =
                    useExecutionRetryStore.getState();

                store.setRetryDelayMs(
                    99999,
                );

                expect(
                    useExecutionRetryStore
                        .getState()
                        .retryDelayMs,
                ).toBe(10000);

                store.setRetryDelayMs(
                    -10,
                );

                expect(
                    useExecutionRetryStore
                        .getState()
                        .retryDelayMs,
                ).toBe(0);
            },
        );

        it(
            "resets to defaults",
            () => {
                const store =
                    useExecutionRetryStore.getState();

                store.setEnabled(true);

                store.setMaxAttempts(5);

                store.setRetryDelayMs(
                    2000,
                );

                store.reset();

                const state =
                    useExecutionRetryStore.getState();

                expect(
                    state.enabled,
                ).toBe(false);

                expect(
                    state.maxAttempts,
                ).toBe(2);

                expect(
                    state.retryDelayMs,
                ).toBe(500);
            },
        );
    },
);