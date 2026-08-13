import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";

import type {
  FlowNodeData,
  NodeAction,
} from "./flowNode";

import type { NodeField } from "./nodeField";

export type NodeType = NodeAction;

type DerivedNodeDefaults =
  FlowNodeData extends infer T
  ? T extends FlowNodeData
  ? Omit<
    T,
    "title" | "subtitle" | "debug"
  >
  : never
  : never;

export type NodeDefaults =
  DerivedNodeDefaults;

export type NodePlatform =
  | "cross-platform"
  | "android"
  | "ios";

export type NodeCategory =
  | "interaction"
  | "element"
  | "device"
  | "variables"
  | "logic"
  | "validation";

export interface NodeHandles {
  outputs: string[];
}

export interface NodePlugin {
  type: NodeType;

  title: string;

  subtitle: string;

  color: string;

  icon: LucideIcon;

  /**
   * Platform yang didukung plugin ini.
   */
  supportedPlatforms: NodePlatform[];

  /**
   * Digunakan untuk grouping pada Sidebar.
   */
  category: NodeCategory;

  handles?: NodeHandles;

  defaults: NodeDefaults;

  fields: NodeField[];

  preview?: (
    data: FlowNodeData,
  ) => ReactNode;
}