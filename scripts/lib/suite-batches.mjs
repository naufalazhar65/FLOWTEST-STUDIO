import {
    basename,
    extname,
    join,
    resolve,
} from "node:path";

const INVALID_ID_CHARS =
    /[^a-z0-9._-]+/g;

const TRAILING_DOTS =
    /[._-]+$/g;

export function normalizeId(
    value,
) {
    const slug = String(
        value,
    )
        .toLowerCase()
        .trim()
        .replace(
            INVALID_ID_CHARS,
            "-",
        )
        .replace(
            TRAILING_DOTS,
            "",
        );

    return slug || "flow";
}

export function flowLabel(
    flowPath,
) {
    return basename(
        flowPath,
        extname(
            flowPath,
        ),
    );
}

export function planSuiteBatches({
    flowCount,
    concurrency,
}) {
    const limit =
        Math.max(
            1,
            Math.floor(
                concurrency,
            ) || 1,
        );

    if (
        flowCount <= 0
    ) {
        return {
            batches: [],
            total: 0,
        };
    }

    const batches = [];

    for (
        let start = 0;
        start < flowCount;
        start += limit
    ) {
        const count = Math.min(
            limit,
            flowCount - start,
        );

        batches.push({
            index: batches.length,
            batchSize: count,
            range: [
                start,
                start + count - 1,
            ],
        });
    }

    return {
        batches,
        total: flowCount,
    };
}

export function flowOutputPaths({
    outputDirectory,
    flowPath,
}) {
    const label =
        flowLabel(
            flowPath,
        );

    const id =
        normalizeId(
            label,
        );

    const flowRoot =
        join(
            outputDirectory,
            id,
        );

    return {
        label,
        id,
        artifactDir:
            resolve(
                flowRoot,
            ),
        reportPath:
            resolve(
                join(
                    outputDirectory,
                    `${id}.junit.xml`,
                ),
            ),
    };
}

export function summarizeRunResults(
    results,
) {
    const byFlow =
        results.map(
            (result) => ({
                label:
                    result.label,
                exitCode:
                    result.exitCode,
                reportPath:
                    result.reportPath,
            }),
        );

    const passed =
        results.filter(
            (result) =>
                result.exitCode ===
                0,
        ).length;

    const failed =
        results.length -
        passed;

    return {
        total:
            results.length,
        passed,
        failed,
        byFlow,
    };
}
