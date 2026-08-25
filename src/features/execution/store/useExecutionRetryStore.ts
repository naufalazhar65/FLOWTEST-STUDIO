import {
    create,
} from "zustand";

export interface ExecutionRetrySettings {
    enabled: boolean;

    maxAttempts: number;

    retryDelayMs: number;
}

interface ExecutionRetryStore
    extends ExecutionRetrySettings {
    setEnabled(
        enabled: boolean,
    ): void;

    setMaxAttempts(
        maxAttempts: number,
    ): void;

    setRetryDelayMs(
        retryDelayMs: number,
    ): void;

    reset(): void;
}

const DEFAULT_SETTINGS:
    ExecutionRetrySettings = {
    enabled: false,

    maxAttempts: 2,

    retryDelayMs: 500,
};

export const useExecutionRetryStore =
    create<ExecutionRetryStore>()(
        (set) => ({
            ...DEFAULT_SETTINGS,

            setEnabled(
                enabled,
            ) {
                set({
                    enabled,
                });
            },

            setMaxAttempts(
                maxAttempts,
            ) {
                set({
                    maxAttempts:
                        Math.max(
                            2,
                            Math.min(
                                5,
                                Math.floor(
                                    maxAttempts,
                                ),
                            ),
                        ),
                });
            },

            setRetryDelayMs(
                retryDelayMs,
            ) {
                set({
                    retryDelayMs:
                        Math.max(
                            0,
                            Math.min(
                                10000,
                                Math.floor(
                                    retryDelayMs,
                                ),
                            ),
                        ),
                });
            },

            reset() {
                set(
                    DEFAULT_SETTINGS,
                );
            },
        }),
    );