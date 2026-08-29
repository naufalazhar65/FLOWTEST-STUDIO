import {
    describe,
    expect,
    it,
} from "vitest";

import {
    runFlowsPool,
} from "./suite-runner.mjs";

function delay(
    duration,
) {
    return new Promise(
        (resolve) =>
            setTimeout(
                resolve,
                duration,
            ),
    );
}

describe("runFlowsPool", () => {
    it("runs at most concurrency flows at a time", async () => {
        const concurrency = 2;

        const total = 5;

        let active = 0;

        let maxActive = 0;

        const spawnOne =
            async (
                index,
            ) => {
                active += 1;

                if (
                    active > maxActive
                ) {
                    maxActive =
                        active;
                }

                await delay(
                    20,
                );

                active -= 1;

                return {
                    index,
                    exitCode: 0,
                };
            };

        const results =
            await runFlowsPool({
                flowCount: total,
                concurrency,
                runOne:
                    spawnOne,
            });

        expect(
            maxActive,
        ).toBe(
            concurrency,
        );

        expect(
            results.length,
        ).toBe(
            total,
        );

        expect(
            results.map(
                (result) =>
                    result.index,
            ).sort(),
        ).toEqual(
            Array.from(
                {
                    length:
                        total,
                },
                (
                    _,
                    index,
                ) =>
                    index,
            ),
        );
    });

    it("runOne is invoked for every flow at least once", async () => {
        const called = [];

        const results =
            await runFlowsPool({
                flowCount: 3,
                concurrency: 3,
                runOne:
                    async (
                        index,
                    ) => {
                        called.push(
                            index,
                        );

                        return {
                            index,
                            exitCode: 0,
                        };
                    },
            });

        expect(
            called,
        ).toHaveLength(
            3,
        );

        expect(
            results,
        ).toHaveLength(
            3,
        );
    });
});
