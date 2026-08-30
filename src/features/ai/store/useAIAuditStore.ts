import { create } from "zustand";

import type {
    Edge,
} from "reactflow";

import type {
    AIAuditRecord,
} from "../types/AIAuditRecord";

import type {
    AIFlowPlan,
} from "../types/AIFlowPlan";

import type {
    ModificationPlan,
} from "../../modification/types/ModificationPlan";

import type {
    FlowNode,
} from "../../flow/types/flowNode";

import {
    computePlanDiff,
} from "../services/flowPlanDiff";

import {
    useFlowStore,
} from "../../flow/store/useFlowStore";

export type AuditPlanInput =
    | {
        kind: "flow";

        plan: AIFlowPlan;
    }
    | {
        kind: "modification";

        plan: ModificationPlan;
    };

export interface AuditBeforeSnapshot {
    nodes: FlowNode[];

    edges: Edge[];
}

interface AIAuditStore {
    records: AIAuditRecord[];

    recordAppliedPlan: (
        input: AuditPlanInput,
        before?: AuditBeforeSnapshot,
    ) => void;

    rollback: (
        id: string,
    ) => void;

    clearHistory: () => void;
}

export const useAIAuditStore =
    create<AIAuditStore>(
        (
            set,
            get,
        ) => ({
            records: [],

            recordAppliedPlan: (
                input,
                before,
            ) => {
                const flow =
                    before
                        ? null
                        : useFlowStore.getState();

                const beforeNodes:
                    FlowNode[] =
                    before?.nodes ??
                    flow?.nodes ??
                    [];

                const beforeEdges:
                    Edge[] =
                    before?.edges ??
                    flow?.edges ??
                    [];

                const diff =
                    computePlanDiff(
                        input,
                        beforeNodes,
                        beforeEdges,
                    );

                const record:
                    AIAuditRecord = {
                    id:
                        crypto.randomUUID(),

                    kind: input.kind,

                    summary:
                        input.plan.summary,

                    createdAt:
                        Date.now(),

                    status:
                        "applied",

                    diff,

                    beforeNodes,

                    beforeEdges,
                };

                set(
                    (
                        state,
                    ) => ({
                        records: [
                            record,
                            ...state.records,
                        ],
                    }),
                );
            },

            rollback: (
                id,
            ) => {
                const record =
                    get()
                        .records.find(
                            (
                                item,
                            ) =>
                                item.id ===
                                id,
                        );

                if (
                    !record
                ) {
                    return;
                }

                if (
                    record.status !==
                    "applied"
                ) {
                    return;
                }

                const flow =
                    useFlowStore.getState();

                flow.runInHistoryBatch(
                    () => {
                        flow.setNodes(
                            record.beforeNodes,
                        );

                        flow.setEdges(
                            record.beforeEdges,
                        );
                    },
                );

                set(
                    (
                        state,
                    ) => ({
                        records:
                            state.records.map(
                                (
                                    item,
                                ) =>
                                    item.id ===
                                    id
                                    ? {
                                        ...item,

                                        status:
                                            "rolledBack",
                                    }
                                    : item,
                            ),
                    }),
                );
            },

            clearHistory:
                () =>
                    set({
                        records:
                            [],
                    }),
        }),
    );
