import {
    loadTestData,
} from "./loadTestData";

import type {
    TestDataFormat,
} from "./loadTestData";

import type {
    TestDataRow,
} from "../types/TestDataSet";

export interface ImportTestDataResult {
    file: File;

    format: TestDataFormat;

    rows: TestDataRow[];
}

function detectFormat(
    fileName: string,
): TestDataFormat {
    const extension =
        fileName
            .split(".")
            .pop()
            ?.toLowerCase();

    if (
        extension === "json"
    ) {
        return "json";
    }

    if (
        extension === "csv"
    ) {
        return "csv";
    }

    throw new Error(
        `Unsupported test data file type: .${extension ?? ""
        }`,
    );
}

export async function importTestDataFile(
    file: File,
): Promise<ImportTestDataResult> {
    const format =
        detectFormat(
            file.name,
        );

    const content =
        await file.text();

    const rows =
        loadTestData(
            content,
            format,
        );

    return {
        file,

        format,

        rows,
    };
}