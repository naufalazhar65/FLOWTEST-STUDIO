import {
    describe,
    expect,
    it,
    vi,
} from "vitest";

import {
    createConcurrencyPool,
    SAFE_DEFAULT_CONCURRENCY,
} from "./ConcurrencyPool";

interface ControlledTask {
    id: string;

    promise: Promise<unknown>;

    start: () => void;

    setResult: (
        result: unknown,
    ) => void;

    fail: (
        error: Error,
    ) => void;
}

function createControlledTask(
    id: string,
): ControlledTask {
    let resolve:
        | ((
            value: unknown,
        ) => void)
        | undefined;

    let reject:
        | ((
            error: Error,
        ) => void)
        | undefined;

    const promise =
        new Promise<unknown>(
            (res, rej) => {
                resolve = res;

                reject = rej;
            },
        );

    return {
        id,

        promise,

        start: () => {
            resolve?.(undefined);
        },

        setResult: (
            result: unknown,
        ) => {
            resolve?.(result);
        },

        fail: (error: Error) => {
            reject?.(error);
        },
    };
}

describe(
    "createConcurrencyPool",
    () => {
        it(
            "exports a safe default of one",
            () => {
                expect(
                    SAFE_DEFAULT_CONCURRENCY,
                ).toBe(1);
            },
        );

        it(
            "runs up to the configured concurrency simultaneously",
            async () => {
                const pool =
                    createConcurrencyPool(
                        {
                            concurrency: 2,
                        },
                    );

                const runSpy =
                    vi.fn();

                const a =
                    createControlledTask(
                        "a",
                    );

                const b =
                    createControlledTask(
                        "b",
                    );

                const c =
                    createControlledTask(
                        "c",
                    );

                const p1 =
                    pool.run({
                        id: "a",

                        run: () => {
                            runSpy("a");

                            return a
                                .promise as Promise<
                                unknown
                            >;
                        },
                    });

                const p2 =
                    pool.run({
                        id: "b",

                        run: () => {
                            runSpy("b");

                            return b
                                .promise as Promise<
                                unknown
                            >;
                        },
                    });

                const p3 =
                    pool.run({
                        id: "c",

                        run: () => {
                            runSpy("c");

                            return c
                                .promise as Promise<
                                unknown
                            >;
                        },
                    });

                await Promise.resolve();

                expect(
                    pool.running,
                ).toBe(2);

                expect(
                    runSpy.mock.calls,
                ).toEqual([
                    ["a"],
                    ["b"],
                ]);

                a.start();

                await Promise.resolve();

                expect(
                    runSpy.mock.calls,
                ).toEqual([
                    ["a"],
                    ["b"],
                    ["c"],
                ]);

                b.start();

                c.start();

                const [r1, r2, r3] =
                    await Promise.all(
                        [
                            p1,
                            p2,
                            p3,
                        ],
                    );

                expect(
                    r1.item.status,
                ).toBe(
                    "completed",
                );

                expect(
                    r2.item.status,
                ).toBe(
                    "completed",
                );

                expect(
                    r3.item.status,
                ).toBe(
                    "completed",
                );
            },
        );

        it(
            "exposes queue visibility through its snapshot",
            async () => {
                const pool =
                    createConcurrencyPool(
                        {
                            concurrency: 1,
                        },
                    );

                const a =
                    createControlledTask(
                        "a",
                    );

                const b =
                    createControlledTask(
                        "b",
                    );

                void pool.run({
                    id: "a",

                    run: () =>
                        a
                            .promise as Promise<
                            unknown
                        >,
                });

                void pool.run({
                    id: "b",

                    run: () =>
                        b
                            .promise as Promise<
                            unknown
                        >,
                });

                await Promise.resolve();

                const snapshot =
                    pool.getSnapshot();

                expect(
                    snapshot.running,
                ).toBe(1);

                expect(
                    snapshot.queued,
                ).toBe(1);
            },
        );

        it(
            "cancels queued tasks that have not started",
            async () => {
                const pool =
                    createConcurrencyPool(
                        {
                            concurrency: 1,
                        },
                    );

                const a =
                    createControlledTask(
                        "a",
                    );

                const b =
                    createControlledTask(
                        "b",
                    );

                const p1 =
                    pool.run({
                        id: "a",

                        run: () =>
                            a
                                .promise as Promise<
                                unknown
                            >,
                    });

                const p2 =
                    pool.run({
                        id: "b",

                        run: () =>
                            b
                                .promise as Promise<
                                unknown
                            >,
                    });

                await Promise.resolve();

                const cancelled =
                    pool.cancelPending();

                expect(
                    cancelled,
                ).toEqual(["b"]);

                a.start();

                const r1 =
                    await p1;

                const r2 =
                    await p2;

                expect(
                    r1.item.status,
                ).toBe(
                    "completed",
                );

                expect(
                    r2.cancelled,
                ).toBe(true);

                expect(
                    r2.item.status,
                ).toBe(
                    "cancelled",
                );
            },
        );

        it(
            "captures failure state on a rejected task",
            async () => {
                const pool =
                    createConcurrencyPool(
                        {
                            concurrency: 1,
                        },
                    );

                const result =
                    await pool.run({
                        id: "boom",

                        run: async () => {
                            throw new Error(
                                "task crashed",
                            );
                        },
                    });

                expect(
                    result.item.status,
                ).toBe("failed");

                expect(
                    result.item.error,
                ).toBe(
                    "task crashed",
                );
            },
        );
    },
);
