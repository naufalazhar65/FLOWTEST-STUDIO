import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";

import type {
  FlowNodeData,
  NodeAction,
} from "./flowNode";

import type { NodeField } from "./nodeField";

export type NodeType = NodeAction;

export type NodeDefaults =
  | {
    action: "tap";
    locatorStrategy: string;
    locator: string;
  }
  | {
    action: "input";
    locatorStrategy: string;
    locator: string;
    text: string;
  }
  | {
    action: "assert";
    locatorStrategy: string;
    locator: string;
    expected: string;
  }
  | {
    action: "setVariable";
    variableName: string;
    value: string;
  }
  | {
    action: "delay";
    duration: number;
  }

  | {
    action: "swipe";
    direction:
    | "up"
    | "down"
    | "left"
    | "right";
    distance: number;
    duration: number;
  }
  | {
    action: "scroll";
    direction:
    | "up"
    | "down";
    amount: number;
  };


export interface NodePlugin {
  type: NodeType;

  title: string;

  subtitle: string;

  color: string;

  icon: LucideIcon;

  defaults: NodeDefaults;

  fields: NodeField[];

  preview?: (
    data: FlowNodeData
  ) => ReactNode;
}