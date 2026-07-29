import type { RunnerResult } from "../types/RunnerResult";
import { useExecutionLogStore } from "../store/useExecutionLogStore";
import { storeResult } from "./storeResult";

export async function executeDeviceGetter<T>(
    getter: () => Promise<T>,
    variableName: string,
    label: string,
): Promise<RunnerResult> {
    const value = await getter();

    useExecutionLogStore.getState().addLog(
        "success",
        `${label} = ${String(value)}`,
    );

    storeResult(variableName, value);

    return {
        outputs: ["next"],
    };
}