import type {
    TestSuite,
} from "../../types/TestSuite";

import type {
    FlowProject,
} from "../../../flow/types/FlowProject";

export interface SuiteFlowDescriptor {
    testCaseId: string;

    projectId: string;

    projectName: string;

    project: FlowProject;
}

export function planSuiteFlows(
    suite: TestSuite,
): SuiteFlowDescriptor[] {
    return suite.testCases
        .filter(
            (testCase) =>
                testCase.enabled,
        )
        .map(
            (testCase) => ({
                testCaseId:
                    testCase.id,

                projectId:
                    testCase.projectId,

                projectName:
                    testCase.projectName,

                project: {
                    id:
                        testCase.project.id,

                    name:
                        testCase.projectName,

                    createdAt:
                        testCase.project.createdAt,

                    updatedAt:
                        testCase.project.updatedAt,

                    nodes:
                        testCase.project.nodes,

                    edges:
                        testCase.project.edges,
                },
            }),
        );
}
