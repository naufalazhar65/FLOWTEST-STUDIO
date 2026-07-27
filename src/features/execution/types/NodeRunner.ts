import type { FlowNode } from "../../flow/types/flowNode";
import type { ExecutionContext } from "./ExecutionContext";

export interface NodeRunner {
  run(
    node: FlowNode,
    context: ExecutionContext
  ): Promise<void>;
}