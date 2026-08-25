import {
    loadTestDataRow,
} from "./loadTestDataRow";

import type {
    TestDataRow,
} from "../types/TestDataSet";

import type {
    TestDataRunResult,
} from "../types/TestDataRunResult";

export interface RunTestDataRowsOptions {
    executeRow(
        row: TestDataRow,
        rowIndex: number,
    ): Promise<void>;
}

export async function runTestDataRows(
    rows: TestDataRow[],
    options: RunTestDataRowsOptions,
): Promise<
    TestDataRunResult[]
> {
    const results:
        TestDataRunResult[] = [];

    for (
        let index = 0;
        index < rows.length;
        index += 1
    ) {
        const row =
            rows[index];

        const startedAt =
            Date.now();

        try {
            loadTestDataRow(
                row,
            );

            await options.executeRow(
                row,
                index,
            );

            const finishedAt =
                Date.now();

            results.push({
                rowIndex:
                    index,

                data:
                    row,

                status:
                    "passed",

                startedAt,

                finishedAt,

                duration:
                    finishedAt -
                    startedAt,
            });
        } catch (error) {
            const finishedAt =
                Date.now();

            results.push({
                rowIndex:
                    index,

                data:
                    row,

                status:
                    "failed",

                startedAt,

                finishedAt,

                duration:
                    finishedAt -
                    startedAt,

                error:
                    error instanceof Error
                        ? error.message
                        : String(
                              error,
                          ),
            });
        }
    }

    return results;
}