import type {
    TestDataRow,
} from "../types/TestDataSet";

function parseCsvLine(
    line: string,
): string[] {
    const values: string[] = [];

    let current = "";
    let inQuotes = false;

    for (
        let index = 0;
        index < line.length;
        index += 1
    ) {
        const character =
            line[index];

        if (
            character === '"'
        ) {
            if (
                inQuotes &&
                line[index + 1] === '"'
            ) {
                current += '"';

                index += 1;

                continue;
            }

            inQuotes =
                !inQuotes;

            continue;
        }

        if (
            character === "," &&
            !inQuotes
        ) {
            values.push(
                current,
            );

            current = "";

            continue;
        }

        current +=
            character;
    }

    if (inQuotes) {
        throw new Error(
            "Invalid CSV: unterminated quoted value.",
        );
    }

    values.push(
        current,
    );

    return values;
}

export function parseCsvTestData(
    content: string,
): TestDataRow[] {
    const lines =
        content
            .replace(
                /^\uFEFF/,
                "",
            )
            .split(/\r?\n/)
            .filter(
                (line) =>
                    line.trim()
                        .length > 0,
            );

    if (
        lines.length === 0
    ) {
        throw new Error(
            "CSV test data is empty.",
        );
    }

    const headers =
        parseCsvLine(
            lines[0],
        ).map(
            (header) =>
                header.trim(),
        );

    if (
        headers.length === 0 ||
        headers.some(
            (header) =>
                header.length === 0,
        )
    ) {
        throw new Error(
            "CSV test data must contain non-empty headers.",
        );
    }

    const duplicateHeaders =
        headers.filter(
            (
                header,
                index,
            ) =>
                headers.indexOf(
                    header,
                ) !== index,
        );

    if (
        duplicateHeaders.length > 0
    ) {
        throw new Error(
            `CSV test data contains duplicate headers: ${[
                ...new Set(
                    duplicateHeaders,
                ),
            ].join(", ")}`,
        );
    }

    return lines
        .slice(1)
        .map(
            (
                line,
                rowIndex,
            ) => {
                const values =
                    parseCsvLine(
                        line,
                    );

                if (
                    values.length !==
                    headers.length
                ) {
                    throw new Error(
                        `CSV test data row ${rowIndex + 2
                        } has ${values.length
                        } columns; expected ${headers.length
                        }.`,
                    );
                }

                return Object.fromEntries(
                    headers.map(
                        (
                            header,
                            columnIndex,
                        ) => [
                                header,
                                values[
                                columnIndex
                                ],
                            ],
                    ),
                ) as TestDataRow;
            },
        );
}