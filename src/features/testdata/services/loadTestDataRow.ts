import {
    clearVariables,
    setVariable,
} from "../../execution/variables/VariableStore";

import type {
    TestDataRow,
} from "../types/TestDataSet";

export interface LoadTestDataRowOptions {
    replaceExisting?: boolean;
}

export function loadTestDataRow(
    row: TestDataRow,
    options: LoadTestDataRowOptions = {},
): void {
    if (
        options.replaceExisting !== false
    ) {
        clearVariables();
    }

    for (
        const [
            name,
            value,
        ] of Object.entries(row)
    ) {
        setVariable(
            name,
            value,
        );
    }
}