import {
    create,
} from "zustand";

import type {
    TestDataRow,
} from "../types/TestDataSet";

import type {
    TestDataFormat,
} from "../services/loadTestData";

interface TestDataState {
    fileName: string | null;

    format:
    TestDataFormat | null;

    rows: TestDataRow[];

    setDataset(
        fileName: string,
        format: TestDataFormat,
        rows: TestDataRow[],
    ): void;

    clearDataset(): void;
}

export const useTestDataStore =
    create<TestDataState>()(
        (set) => ({
            fileName:
                null,

            format:
                null,

            rows: [],

            setDataset(
                fileName,
                format,
                rows,
            ) {
                set({
                    fileName,

                    format,

                    rows,
                });
            },

            clearDataset() {
                set({
                    fileName:
                        null,

                    format:
                        null,

                    rows: [],
                });
            },
        }),
    );