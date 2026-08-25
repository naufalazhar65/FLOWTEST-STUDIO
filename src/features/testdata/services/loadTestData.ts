import type {
    TestDataRow,
} from "../types/TestDataSet";

import {
    parseCsvTestData,
} from "./parseCsvTestData";

import {
    parseJsonTestData,
} from "./parseJsonTestData";

export type TestDataFormat =
    | "json"
    | "csv";

export function loadTestData(
    content: string,
    format: TestDataFormat,
): TestDataRow[] {
    switch (format) {
        case "json":
            return parseJsonTestData(
                content,
            );

        case "csv":
            return parseCsvTestData(
                content,
            );

        default:
            throw new Error(
                `Unsupported test data format: ${format}`,
            );
    }
}