import { create } from "zustand";
import { persist } from "zustand/middleware";

import type { TestReport } from "../types/TestReport";

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
                        ],
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
                            report.id === id,
                    );
                },
            }),
            {
                name: "flowtest-studio-reports",
                version: 1,
            },
        ),
    );