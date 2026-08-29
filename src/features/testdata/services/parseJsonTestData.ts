import type {
    TestDataRow,
} from "../types/TestDataSet";

export function parseJsonTestData(
    content: string,
): TestDataRow[] {
    let parsed: unknown;

    try {
        parsed = JSON.parse(
            content,
        );
    } catch (error) {
        throw new Error(
            `Invalid JSON test data: ${
                error instanceof Error
                    ? error.message
                    : String(error)
            }`,
            {
                cause: error,
            },
        );
    }

    if (!Array.isArray(parsed)) {
        throw new Error(
            "JSON test data must contain an array of objects.",
        );
    }

    return parsed.map(
        (row, index) => {
            if (
                row === null ||
                typeof row !== "object" ||
                Array.isArray(row)
            ) {
                throw new Error(
                    `Test data row ${index + 1} must be an object.`,
                );
            }

            return row as TestDataRow;
        },
    );
}