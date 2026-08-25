export interface TestDataRow {
    [key: string]: unknown;
}

export interface TestDataSet {
    name: string;

    source:
        | "json"
        | "csv";

    rows: TestDataRow[];
}