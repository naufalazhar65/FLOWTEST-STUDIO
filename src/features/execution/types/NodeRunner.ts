import type {
  FlowNode,
  FlowNodeData,
} from "../../flow/types/flowNode";

import type { ExecutionContext } from "./ExecutionContext";
import type { RunnerResult } from "./RunnerResult";

export interface NodeRunner<
  T extends FlowNodeData = FlowNodeData,
> {
  run(
    node: FlowNode & {
      data: T;
    },
    context: ExecutionContext,
  ): Promise<void | RunnerResult>;
}