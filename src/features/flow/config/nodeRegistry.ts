import {
  MousePointerClick,
  Keyboard,
  BadgeCheck,
} from "lucide-react";

export const nodeRegistry = {
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
  },
} as const;

export type NodeType = keyof typeof nodeRegistry;