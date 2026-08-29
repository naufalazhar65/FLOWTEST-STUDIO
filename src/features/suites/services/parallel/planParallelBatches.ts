export interface ParallelTask {
    id: string;

    dependencies?: string[];
}

export interface PlannedBatch {
    index: number;

    batchSize: number;

    taskIds: string[];
}

export interface PlannedExecution {
    batches: PlannedBatch[];

    totalTasks: number;

    maxConcurrency: number;
}

export function planParallelBatches(
    tasks: ParallelTask[],
    concurrency: number,
): PlannedExecution {
    const maxConcurrency =
        Math.max(
            1,
            Math.floor(
                concurrency,
            ),
        );

    const byId = new Map<
        string,
        ParallelTask
    >();

    for (const task of tasks) {
        byId.set(
            task.id,
            task,
        );
    }

    const pending = new Set(
        tasks.map(
            (task) =>
                task.id,
        ),
    );

    const completed =
        new Set<string>();

    const batches: PlannedBatch[] = [];

    let batchIndex = 0;

    while (pending.size > 0) {
        const ready: string[] = [];

        for (const id of pending) {
            const task =
                byId.get(id);

            if (!task) {
                continue;
            }

            const deps =
                task.dependencies ??
                [];

            const blocked =
                deps.some(
                    (dep) =>
                        !completed.has(
                            dep,
                        ),
                );

            if (!blocked) {
                ready.push(id);
            }
        }

        if (ready.length === 0) {
            const blocked =
                [...pending];

            batches.push({
                index:
                    batchIndex,

                batchSize:
                    blocked.length,

                taskIds:
                    blocked,
            });

            for (const id of blocked) {
                completed.add(id);
            }

            batchIndex += 1;

            continue;
        }

        const slice =
            ready.slice(
                0,
                maxConcurrency,
            );

        batches.push({
            index:
                batchIndex,

            batchSize:
                slice.length,

            taskIds:
                slice,
        });

        for (const id of slice) {
            pending.delete(id);

            completed.add(id);
        }

        batchIndex += 1;
    }

    return {
        batches,

        totalTasks:
            tasks.length,

        maxConcurrency,
    };
}
