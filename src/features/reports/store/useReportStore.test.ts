import {
    beforeEach,
    describe,
    expect,
    it,
} from "vitest";

import {
    useReportStore,
} from "./useReportStore";

import type {
    TestReport,
} from "../types/TestReport";

function createReport(
    id: string,
    projectId: string,
): TestReport {
    return {
        id,

        projectId,

        status: "passed",

        startedAt: 1000,

        finishedAt: 2000,

        duration: 1000,

        totalNodes: 3,

        executedNodes: 3,

        passedNodes: 3,

        failedNodes: 0,

        environment: {
            platform: "Android",

            platformVersion: "14",

            deviceName:
                "Android Emulator",

            automationName:
                "UiAutomator2",

            sessionId: "session-1",
        },

        nodes: [],

        logs: [],
    };
}

describe(
    "useReportStore",
    () => {
        beforeEach(() => {
            useReportStore
                .getState()
                .clearReports();
        });

        it(
            "starts with no reports",
            () => {
                expect(
                    useReportStore
                        .getState()
                        .reports,
                ).toEqual([]);
            },
        );

        it(
            "adds a report with its projectId",
            () => {
                const report =
                    createReport(
                        "report-a-1",
                        "project-a",
                    );

                useReportStore
                    .getState()
                    .addReport(
                        report,
                    );

                expect(
                    useReportStore
                        .getState()
                        .reports,
                ).toEqual([
                    report,
                ]);
            },
        );

        it(
            "keeps reports from different projects separate",
            () => {
                const reportA =
                    createReport(
                        "report-a-1",
                        "project-a",
                    );

                const reportB =
                    createReport(
                        "report-b-1",
                        "project-b",
                    );

                useReportStore
                    .getState()
                    .addReport(
                        reportA,
                    );

                useReportStore
                    .getState()
                    .addReport(
                        reportB,
                    );

                const reports =
                    useReportStore
                        .getState()
                        .reports;

                expect(
                    reports,
                ).toHaveLength(2);

                expect(
                    reports.find(
                        (report) =>
                            report.id ===
                            "report-a-1",
                    )?.projectId,
                ).toBe(
                    "project-a",
                );

                expect(
                    reports.find(
                        (report) =>
                            report.id ===
                            "report-b-1",
                    )?.projectId,
                ).toBe(
                    "project-b",
                );
            },
        );

        it(
            "can retrieve a report by id",
            () => {
                const report =
                    createReport(
                        "report-a-1",
                        "project-a",
                    );

                useReportStore
                    .getState()
                    .addReport(
                        report,
                    );

                expect(
                    useReportStore
                        .getState()
                        .getReport(
                            "report-a-1",
                        ),
                ).toEqual(
                    report,
                );
            },
        );

        it(
            "returns undefined for an unknown report id",
            () => {
                expect(
                    useReportStore
                        .getState()
                        .getReport(
                            "unknown-report",
                        ),
                ).toBeUndefined();
            },
        );

        it(
            "removes only the requested report",
            () => {
                const reportA =
                    createReport(
                        "report-a-1",
                        "project-a",
                    );

                const reportB =
                    createReport(
                        "report-b-1",
                        "project-b",
                    );

                useReportStore
                    .getState()
                    .addReport(
                        reportA,
                    );

                useReportStore
                    .getState()
                    .addReport(
                        reportB,
                    );

                useReportStore
                    .getState()
                    .removeReport(
                        "report-a-1",
                    );

                expect(
                    useReportStore
                        .getState()
                        .reports,
                ).toEqual([
                    reportB,
                ]);
            },
        );

        it(
            "clears all reports",
            () => {
                const reportA =
                    createReport(
                        "report-a-1",
                        "project-a",
                    );

                const reportB =
                    createReport(
                        "report-b-1",
                        "project-b",
                    );

                useReportStore
                    .getState()
                    .addReport(
                        reportA,
                    );

                useReportStore
                    .getState()
                    .addReport(
                        reportB,
                    );

                useReportStore
                    .getState()
                    .clearReports();

                expect(
                    useReportStore
                        .getState()
                        .reports,
                ).toEqual([]);
            },
        );
    },
);