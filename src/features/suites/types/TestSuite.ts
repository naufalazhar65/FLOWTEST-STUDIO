import type { FlowProject } from "../../flow/types/FlowProject";

import type {
    SuiteRunResult,
} from "./SuiteRunResult";

export interface SuiteTestCase {
    id: string;

    projectId: string;

    projectName: string;

    enabled: boolean;

    project: FlowProject;
}

export interface TestSuite {
    id: string;

    name: string;

    description: string;

    testCases: SuiteTestCase[];

    createdAt: string;

    updatedAt: string;

    lastRun?: SuiteRunResult;

    runHistory?: SuiteRunResult[];
}