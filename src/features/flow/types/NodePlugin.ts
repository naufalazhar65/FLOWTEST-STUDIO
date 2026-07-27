import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";

import type {
  FlowNodeData,
  NodeAction,
} from "./flowNode";

import type { NodeField } from "./nodeField";

export type NodeType = NodeAction;

export interface NodePlugin {
  type: NodeType;

  title: string;

  subtitle: string;

  color: string;

  icon: LucideIcon;

defaults: FlowNodeData;

  fields: NodeField[];

  preview?: (
    data: FlowNodeData
  ) => ReactNode;
}