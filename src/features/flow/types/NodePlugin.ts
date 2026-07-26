import type { LucideIcon } from "lucide-react";
import type { NodeField } from "./nodeField";
import type {
  FlowNodeData,
  NodeAction,
} from "./flowNode";

export interface NodePlugin {
  type: NodeAction;

  title: string;
  subtitle: string;

  color: string;

  icon: LucideIcon;

  defaults: Pick<
    FlowNodeData,
    | "action"
    | "locatorStrategy"
    | "locator"
    | "text"
    | "expected"
  >;

  fields: NodeField[];
}