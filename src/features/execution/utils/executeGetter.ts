// import type { RunnerResult } from "../types/RunnerResult";
// import { useExecutionLogStore } from "../store/useExecutionLogStore";
// import { storeResult } from "./storeResult";

// export async function executeGetter<T>(
//     getter: () => Promise<T>,
//     options: {
//         variableName: string;
//         label: string;
//     },
// ): Promise<RunnerResult> {
//     const value = await getter();

//     useExecutionLogStore.getState().addLog(
//         "success",
//         `${options.label} = ${String(value)}`,
//     );

//     storeResult(
//         options.variableName,
//         value,
//     );

//     return {
//         outputs: ["next"],
//     };
// }