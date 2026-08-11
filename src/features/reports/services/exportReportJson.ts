import type { TestReport } from "../types/TestReport";

export function exportReportJson(
    report: TestReport,
): void {
    const json = JSON.stringify(
        report,
        null,
        2,
    );

    const blob = new Blob(
        [json],
        {
            type: "application/json",
        },
    );

    const url =
        URL.createObjectURL(blob);

    const anchor =
        document.createElement("a");

    anchor.href = url;

    anchor.download =
        `flowtest-report-${formatTimestamp(
            report.startedAt,
        )}.json`;

    document.body.appendChild(
        anchor,
    );

    anchor.click();

    document.body.removeChild(
        anchor,
    );

    URL.revokeObjectURL(url);
}

function formatTimestamp(
    timestamp: number,
): string {
    const date =
        new Date(timestamp);

    const year =
        date.getFullYear();

    const month =
        String(
            date.getMonth() + 1,
        ).padStart(2, "0");

    const day =
        String(
            date.getDate(),
        ).padStart(2, "0");

    const hours =
        String(
            date.getHours(),
        ).padStart(2, "0");

    const minutes =
        String(
            date.getMinutes(),
        ).padStart(2, "0");

    const seconds =
        String(
            date.getSeconds(),
        ).padStart(2, "0");

    return [
        year,
        month,
        day,
    ].join("") +
        "-" +
        [
            hours,
            minutes,
            seconds,
        ].join("");
}