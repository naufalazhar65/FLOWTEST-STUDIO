import { create } from "zustand";

import type {
    SelfHealingExecutionResult,
} from "../services/executeSelfHealing";

import type {
    SelfHealingPlan,
} from "../services/buildSelfHealingPlan";

export type HealingMetricKind =
    | "healed"
    | "healingFailed"
    | "rejected";

export interface HealingMetricEvent {
    id: string;

    projectId: string;

    timestamp: number;

    kind: HealingMetricKind;

    strategy:
    SelfHealingPlan["strategy"];

    rerunAttempted: boolean;

    rerunSucceeded: boolean;
}

export interface RecordHealingResultInput {
    projectId: string;

    result: SelfHealingExecutionResult;

    strategy:
    SelfHealingPlan["strategy"];
}

interface HealingMetricsStore {
    events: HealingMetricEvent[];

    recordHealingResult(
        input: RecordHealingResultInput,
    ): void;

    recordRejectedHealing(
        projectId: string,

        strategy:
        SelfHealingPlan["strategy"],
    ): void;

    clear(
        projectId?: string,
    ): void;
}

export const useHealingMetricsStore =
    create<HealingMetricsStore>(
        (set) => ({
            events: [],

            recordHealingResult(
                input,
            ) {
                const {
                    projectId,
                    result,
                    strategy,
                } = input;

                if (
                    result.status ===
                    "skipped"
                ) {
                    return;
                }

                const kind:
                    HealingMetricKind =
                    result.status ===
                        "applied"
                        ? "healed"
                        : result.status ===
                            "failed"
                          ? "healingFailed"
                          : "rejected";

                const event:
                    HealingMetricEvent =
                {
                    id: crypto.randomUUID(),

                    projectId,

                    timestamp: Date.now(),

                    kind,

                    strategy,

                    rerunAttempted:
                        result.rerunAttempted,

                    rerunSucceeded:
                        result.rerunSucceeded,
                };

                set((state) => ({
                    events: [
                        ...state.events,
                        event,
                    ],
                }));
            },

            recordRejectedHealing(
                projectId,
                strategy,
            ) {
                const event:
                    HealingMetricEvent =
                {
                    id: crypto.randomUUID(),

                    projectId,

                    timestamp: Date.now(),

                    kind: "rejected",

                    strategy,

                    rerunAttempted:
                        false,

                    rerunSucceeded:
                        false,
                };

                set((state) => ({
                    events: [
                        ...state.events,
                        event,
                    ],
                }));
            },

            clear(
                projectId,
            ) {
                if (
                    !projectId
                ) {
                    set({
                        events: [],
                    });

                    return;
                }

                set((state) => ({
                    events:
                        state.events.filter(
                            (
                                event,
                            ) =>
                                event.projectId !==
                                projectId,
                        ),
                }));
            },
        }),
    );

export interface HealingMetricsSummary {
    healed: number;

    healingFailed:
    number;

    rejected: number;

    total: number;

    rerunAttempted:
    number;

    rerunSucceeded:
    number;
}

export function summarizeHealingMetrics(
    events: HealingMetricEvent[],
): HealingMetricsSummary {
    const summary: HealingMetricsSummary =
    {
        healed: 0,

        healingFailed:
            0,

        rejected: 0,

        total: 0,

        rerunAttempted:
            0,

        rerunSucceeded:
            0,
    };

    for (
        const event of
        events
    ) {
        summary.total += 1;

        if (
            event.kind ===
            "healed"
        ) {
            summary.healed += 1;
        } else if (
            event.kind ===
            "healingFailed"
        ) {
            summary.healingFailed +=
                1;
        } else {
            summary.rejected +=
                1;
        }

        if (
            event.rerunAttempted
        ) {
            summary.rerunAttempted +=
                1;
        }

        if (
            event.rerunSucceeded
        ) {
            summary.rerunSucceeded +=
                1;
        }
    }

    return summary;
}
