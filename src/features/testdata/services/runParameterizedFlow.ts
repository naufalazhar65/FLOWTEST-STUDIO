import {
    ExecutionController,
} from "../../execution/services/ExecutionController";

import type {
    ExecutionControllerOptions,
} from "../../execution/services/ExecutionController";

import type {
    FlowNode,
} from "../../flow/types/flowNode";

import type {
    Edge,
} from "reactflow";

import type {
    TestDataRow,
} from "../types/TestDataSet";

import {
    runTestDataRows,
} from "./runTestDataRows";

export interface RunParameterizedFlowOptions {
    nodes: FlowNode[];

    edges: Edge[];

    environmentName?:
    ExecutionControllerOptions[
    "environmentName"
    ];

    onRowComplete?: (
        rowIndex: number,
    ) => void;
}

export async function runParameterizedFlow(
    rows: TestDataRow[],
    {
        nodes,
        edges,
        environmentName,
        onRowComplete,
    }: RunParameterizedFlowOptions,
) {
    return runTestDataRows(
        rows,
        {
            executeRow:
                async (
                    row,
                    rowIndex,
                ) => {
                    await ExecutionController.run(
                        nodes,
                        {
                            edges,
                        },
                        {
                            environmentName,

                            testDataRow:
                                row,
                        },
                    );

                    onRowComplete?.(
                        rowIndex,
                    );
                },
        },
    );
}