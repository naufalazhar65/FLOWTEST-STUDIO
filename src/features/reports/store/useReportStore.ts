import { create } from "zustand";
import { persist } from "zustand/middleware";

import type {
    TestReport,
} from "../types/TestReport";

import {
    summarizeFlakiness,
} from "../../execution/services/classifyNodeOutcome";

interface ReportStore {
    reports: TestReport[];

    addReport(
        report: TestReport,
    ): void;

    removeReport(
        id: string,
    ): void;

    clearReports(): void;

    getReport(
        id: string,
    ): TestReport | undefined;
}

function normalizeReport(
    report: Partial<TestReport>,
): TestReport {
    return {
        id:
            report.id ??
            crypto.randomUUID(),

        projectId:
            report.projectId ??
            "",

        status:
            report.status ??
            "failed",

        startedAt:
            report.startedAt ??
            0,

        finishedAt:
            report.finishedAt ??
            0,

        duration:
            report.duration ??
            0,

        totalNodes:
            report.totalNodes ??
            0,

        executedNodes:
            report.executedNodes ??
            0,

        passedNodes:
            report.passedNodes ??
            0,

        failedNodes:
            report.failedNodes ??
            0,

        flakyNodes:
            report.flakyNodes ??
            summarizeFlakiness(
                report.nodes ?? [],
            ).flaky,

        environment: {
            platform:
                report.environment
                    ?.platform ??
                "",

            platformVersion:
                report.environment
                    ?.platformVersion ??
                "",

            deviceName:
                report.environment
                    ?.deviceName ??
                "",

            automationName:
                report.environment
                    ?.automationName ??
                "",

            sessionId:
                report.environment
                    ?.sessionId ??
                null,
        },

        nodes:
            report.nodes ??
            [],

        logs:
            report.logs ??
            [],
    };
}

export const useReportStore =
    create<ReportStore>()(
        persist(
            (set, get) => ({
                reports: [],

                addReport(report) {
                    set((state) => ({
                        reports: [
                            report,
                            ...state.reports,
                        ].slice(
                            0,
                            20,
                        ),
                    }));
                },

                removeReport(id) {
                    set((state) => ({
                        reports:
                            state.reports.filter(
                                (report) =>
                                    report.id !==
                                    id,
                            ),
                    }));
                },

                clearReports() {
                    set({
                        reports: [],
                    });
                },

                getReport(id) {
                    return get().reports.find(
                        (report) =>
                            report.id ===
                            id,
                    );
                },
            }),
            {
                name:
                    "flowtest-studio-reports",

                version: 3,

                migrate(
                    persistedState,
                ) {
                    if (!persistedState) {
                        return persistedState;
                    }

                    const state =
                        persistedState as {
                            reports?: Array<
                                Partial<TestReport>
                            >;
                        };

                    return {
                        ...state,

                        reports:
                            (
                                state.reports ??
                                []
                            ).map(
                                normalizeReport,
                            ),
                    };
                },
            },
        ),
    );