import type { FlowNode } from "../types/flowNode";
import { validateNode } from "./validateNode";

export interface FlowValidationError {
  nodeId: string;
  nodeTitle: string;
  errors: string[];
}

export interface FlowValidationResult {
  valid: boolean;
  errors: FlowValidationError[];
}

export function validateFlow(
  nodes: FlowNode[]
): FlowValidationResult {
  const errors: FlowValidationError[] = [];

  for (const node of nodes) {
    const result = validateNode(node.data);

    if (!result.valid) {
      errors.push({
        nodeId: node.id,
        nodeTitle: node.data.title,
        errors: result.errors,
      });
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}