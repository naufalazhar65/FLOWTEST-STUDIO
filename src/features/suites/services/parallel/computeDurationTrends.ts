export interface DurationSample {
    label: string;

    duration: number;
}

export interface DurationTrend {
    label: string;

    samples: number;

    average: number;

    min: number;

    max: number;

    median: number;

    total: number;
}

export interface DurationAnalytics {
    trends: DurationTrend[];

    slowest: DurationTrend | null;

    overall: {
        samples: number;

        total: number;

        average: number;
    };
}

export function computeDurationTrends(
    samples: DurationSample[],
): DurationAnalytics {
    const byLabel = new Map<
        string,
        DurationSample[]
    >();

    for (const sample of samples) {
        const list =
            byLabel.get(
                sample.label,
            ) ?? [];

        list.push(sample);

        byLabel.set(
            sample.label,
            list,
        );
    }

    const trends: DurationTrend[] = [];

    for (const [
        label,
        list,
    ] of byLabel) {
        const durations =
            list.map(
                (sample) =>
                    sample.duration,
            );

        trends.push({
            label,

            samples:
                durations.length,

            average:
                durations.reduce(
                    (sum, d) =>
                        sum + d,
                    0,
                ) /
                durations.length,

            min: Math.min(
                ...durations,
            ),

            max: Math.max(
                ...durations,
            ),

            median:
                medianOf(
                    durations,
                ),

            total:
                durations.reduce(
                    (sum, d) =>
                        sum + d,
                    0,
                ),
        });
    }

    trends.sort(
        (a, b) =>
            b.total -
            a.total,
    );

    const slowest =
        trends.length > 0
            ? trends[0]
            : null;

    const overallDurations =
        samples.map(
            (sample) =>
                sample.duration,
        );

    const overallTotal =
        overallDurations.reduce(
            (sum, d) =>
                sum + d,
            0,
        );

    return {
        trends,

        slowest,

        overall: {
            samples:
                samples.length,

            total:
                overallTotal,

            average:
                samples.length > 0
                    ? overallTotal /
                        samples.length
                    : 0,
        },
    };
}

function medianOf(
    values: number[],
): number {
    if (values.length === 0) {
        return 0;
    }

    const sorted = [
        ...values,
    ].sort(
        (a, b) =>
            a - b,
    );

    const middle =
        Math.floor(
            sorted.length / 2,
        );

    if (
        sorted.length % 2 ===
        1
    ) {
        return sorted[middle];
    }

    return (
        sorted[middle - 1] +
        sorted[middle]
    ) /
        2;
}
