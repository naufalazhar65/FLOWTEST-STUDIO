import type { Edge } from "reactflow";

import type { FlowNode } from "../../flow/types/flowNode";

export interface GraphTransition {
    edge: Edge;
    nextNode: FlowNode;
}