import type { FlowNode } from "../../flow/types/flowNode";
import type { ExecutionContext } from "../types/ExecutionContext";
import type { RunnerResult } from "../types/RunnerResult";

export interface NodeRunner {
  run(
    node: FlowNode,
    context: ExecutionContext
  ): Promise<void | RunnerResult>;
}