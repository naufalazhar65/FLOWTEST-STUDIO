import { create } from "zustand";
import { persist } from "zustand/middleware";

import type {
    SuiteTestCase,
    TestSuite,
} from "../types/TestSuite";

interface SuiteStore {
    suites: TestSuite[];

    selectedSuiteId: string | null;

    addSuite(
        suite: TestSuite,
    ): void;

    updateSuite(
        id: string,
        updates: Partial<TestSuite>,
    ): void;

    removeSuite(
        id: string,
    ): void;

    addTestCase(
        suiteId: string,
        testCase: SuiteTestCase,
    ): void;

    removeTestCase(
        suiteId: string,
        testCaseId: string,
    ): void;

    toggleTestCase(
        suiteId: string,
        testCaseId: string,
    ): void;

    selectSuite(
        id: string | null,
    ): void;

    clearSuites(): void;
}

export const useSuiteStore =
    create<SuiteStore>()(
        persist(
            (set) => ({
                suites: [],

                selectedSuiteId: null,

                addSuite(suite) {
                    set((state) => ({
                        suites: [
                            ...state.suites,
                            suite,
                        ],
                    }));
                },

                updateSuite(
                    id,
                    updates,
                ) {
                    set((state) => ({
                        suites:
                            state.suites.map(
                                (suite) =>
                                    suite.id === id
                                        ? {
                                            ...suite,
                                            ...updates,
                                            updatedAt:
                                                new Date().toISOString(),
                                        }
                                        : suite,
                            ),
                    }));
                },

                removeSuite(id) {
                    set((state) => ({
                        suites:
                            state.suites.filter(
                                (suite) =>
                                    suite.id !== id,
                            ),

                        selectedSuiteId:
                            state.selectedSuiteId ===
                                id
                                ? null
                                : state.selectedSuiteId,
                    }));
                },

                addTestCase(
                    suiteId,
                    testCase,
                ) {
                    set((state) => ({
                        suites:
                            state.suites.map(
                                (suite) => {
                                    if (
                                        suite.id !==
                                        suiteId
                                    ) {
                                        return suite;
                                    }

                                    const exists =
                                        suite.testCases.some(
                                            (test) =>
                                                test.projectId ===
                                                testCase.projectId,
                                        );

                                    if (exists) {
                                        return suite;
                                    }

                                    return {
                                        ...suite,
                                        testCases: [
                                            ...suite.testCases,
                                            testCase,
                                        ],
                                        updatedAt:
                                            new Date().toISOString(),
                                    };
                                },
                            ),
                    }));
                },

                removeTestCase(
                    suiteId,
                    testCaseId,
                ) {
                    set((state) => ({
                        suites:
                            state.suites.map(
                                (suite) =>
                                    suite.id ===
                                        suiteId
                                        ? {
                                            ...suite,
                                            testCases:
                                                suite.testCases.filter(
                                                    (test) =>
                                                        test.id !==
                                                        testCaseId,
                                                ),
                                            updatedAt:
                                                new Date().toISOString(),
                                        }
                                        : suite,
                            ),
                    }));
                },

                toggleTestCase(
                    suiteId,
                    testCaseId,
                ) {
                    set((state) => ({
                        suites:
                            state.suites.map(
                                (suite) =>
                                    suite.id ===
                                        suiteId
                                        ? {
                                            ...suite,
                                            testCases:
                                                suite.testCases.map(
                                                    (test) =>
                                                        test.id ===
                                                            testCaseId
                                                            ? {
                                                                ...test,
                                                                enabled:
                                                                    !test.enabled,
                                                            }
                                                            : test,
                                                ),
                                            updatedAt:
                                                new Date().toISOString(),
                                        }
                                        : suite,
                            ),
                    }));
                },

                selectSuite(id) {
                    set({
                        selectedSuiteId: id,
                    });
                },

                clearSuites() {
                    set({
                        suites: [],
                        selectedSuiteId: null,
                    });
                },
            }),
            {
                name:
                    "flowtest-studio-suites",

                version: 1,
            },
        ),
    );