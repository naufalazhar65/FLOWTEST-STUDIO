export async function runFlowsPool({
    flowCount,
    concurrency,
    runOne,
}) {
    const results = [];

    let nextIndex = 0;

    const workerCount =
        Math.max(
            1,
            Math.min(
                Math.floor(
                    concurrency,
                ) || 1,
                flowCount,
            ),
        );

    async function worker() {
        while (
            nextIndex <
            flowCount
        ) {
            const index =
                nextIndex;

            nextIndex += 1;

            const result =
                await runOne(
                    index,
                );

            results.push(
                result,
            );
        }
    }

    const workers = [];

    for (
        let index = 0;
        index < workerCount;
        index += 1
    ) {
        workers.push(
            worker(),
        );
    }

    await Promise.all(
        workers,
    );

    return results;
}
