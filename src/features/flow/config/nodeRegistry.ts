import {
  MousePointerClick,
  Keyboard,
  BadgeCheck,
} from "lucide-react";

import type { LucideIcon } from "lucide-react";
import type { NodeField } from "../types/nodeField";

export interface NodeDefinition {
  title: string;
  subtitle: string;
  color: string;
  icon: LucideIcon;

  defaults: Record<string, string>;

  fields: NodeField[];
}

export const nodeRegistry: Record<
  string,
  NodeDefinition
> = {
  tap: {
    title: "Tap",
    subtitle: "Tap an element",
    color: "#22C55E",
    icon: MousePointerClick,

    defaults: {
      action: "tap",
      locatorStrategy: "id",
      locator: "",
    },

    fields: [
      {
        key: "locatorStrategy",
        label: "Locator Strategy",
        type: "select",
        options: [
          "id",
          "xpath",
          "accessibilityId",
        ],
      },

      {
        key: "locator",
        label: "Locator",
        type: "text",
      },
    ],
  },

  input: {
    title: "Input",
    subtitle: "Type text into element",
    color: "#3B82F6",
    icon: Keyboard,

    defaults: {
      action: "input",
      locatorStrategy: "id",
      locator: "",
      text: "",
    },

    fields: [
      {
        key: "locatorStrategy",
        label: "Locator Strategy",
        type: "select",
        options: [
          "id",
          "xpath",
          "accessibilityId",
        ],
      },

      {
        key: "locator",
        label: "Locator",
        type: "text",
      },

      {
        key: "text",
        label: "Text",
        type: "text",
      },
    ],
  },

  assert: {
    title: "Assert",
    subtitle: "Verify element exists",
    color: "#F59E0B",
    icon: BadgeCheck,

    defaults: {
      action: "assert",
      locatorStrategy: "id",
      locator: "",
      expected: "",
    },

    fields: [
      {
        key: "locatorStrategy",
        label: "Locator Strategy",
        type: "select",
        options: [
          "id",
          "xpath",
          "accessibilityId",
        ],
      },

      {
        key: "locator",
        label: "Locator",
        type: "text",
      },

      {
        key: "expected",
        label: "Expected",
        type: "text",
      },
    ],
  },
};

export type NodeType =
  keyof typeof nodeRegistry;