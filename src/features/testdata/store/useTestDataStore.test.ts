import {
    beforeEach,
    describe,
    expect,
    it,
} from "vitest";

import {
    useTestDataStore,
} from "./useTestDataStore";

describe(
    "useTestDataStore",
    () => {
        beforeEach(() => {
            useTestDataStore
                .getState()
                .clearDataset();
        });

        it(
            "stores an imported dataset",
            () => {
                const rows = [
                    {
                        username:
                            "user1",
                    },
                    {
                        username:
                            "user2",
                    },
                ];

                useTestDataStore
                    .getState()
                    .setDataset(
                        "users.json",
                        "json",
                        rows,
                    );

                const state =
                    useTestDataStore.getState();

                expect(
                    state.fileName,
                ).toBe(
                    "users.json",
                );

                expect(
                    state.format,
                ).toBe("json");

                expect(
                    state.rows,
                ).toEqual(
                    rows,
                );
            },
        );

        it(
            "clears the dataset",
            () => {
                useTestDataStore
                    .getState()
                    .setDataset(
                        "users.csv",
                        "csv",
                        [
                            {
                                username:
                                    "user1",
                            },
                        ],
                    );

                useTestDataStore
                    .getState()
                    .clearDataset();

                const state =
                    useTestDataStore.getState();

                expect(
                    state.fileName,
                ).toBeNull();

                expect(
                    state.format,
                ).toBeNull();

                expect(
                    state.rows,
                ).toEqual([]);
            },
        );
    },
);