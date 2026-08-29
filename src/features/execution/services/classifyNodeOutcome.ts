export type NodeOutcome =
    | "deterministicPass"
    | "flaky"
    | "transientFailure"
    | "deterministicFailure"
    | "notExecuted";

export interface NodeOutcomeEvidence {
    status: string;

    attempts: number;

    retries: number;
}

export interface FlakinessSummary {
    flaky: number;

    deterministicPass: number;

    deterministicFailure: number;

    transientFailure: number;

    notExecuted: number;

    flakyRate: number;
}

export function classifyNodeOutcome(
    node: Pick<NodeOutcomeEvidence, "status"> &
        Partial<NodeOutcomeEvidence>,
): NodeOutcome {
    const status = node.status;

    if (
        status === "idle" ||
        status === "running" ||
        status === "stopped"
    ) {
        return "notExecuted";
    }

    const attempts =
        node.attempts ?? 1;

    const retried =
        attempts > 1 ||
        (node.retries ?? 0) > 0;

    if (status === "passed") {
        return retried
            ? "flaky"
            : "deterministicPass";
    }

    if (status === "failed") {
        return retried
            ? "transientFailure"
            : "deterministicFailure";
    }

    return "notExecuted";
}

export function summarizeFlakiness(
    nodes: Array<
        Pick<NodeOutcomeEvidence, "status"> &
            Partial<NodeOutcomeEvidence>
    >,
): FlakinessSummary {
    const summary: FlakinessSummary = {
        flaky: 0,

        deterministicPass: 0,

        deterministicFailure: 0,

        transientFailure: 0,

        notExecuted: 0,

        flakyRate: 0,
    };

    for (const node of nodes) {
        const outcome =
            classifyNodeOutcome(
                node,
            );

        switch (outcome) {
            case "flaky":
                summary.flaky +=
                    1;

                break;

            case "deterministicPass":
                summary.deterministicPass +=
                    1;

                break;

            case "deterministicFailure":
                summary.deterministicFailure +=
                    1;

                break;

            case "transientFailure":
                summary.transientFailure +=
                    1;

                break;

            case "notExecuted":
            default:
                summary.notExecuted +=
                    1;

                break;
        }
    }

    const executed =
        summary.flaky +
        summary.deterministicPass +
        summary.deterministicFailure +
        summary.transientFailure;

    if (executed > 0) {
        summary.flakyRate =
            summary.flaky /
            executed;
    }

    return summary;
}
