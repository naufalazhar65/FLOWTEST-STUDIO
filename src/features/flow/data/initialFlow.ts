import type { Edge } from "reactflow";
import type { FlowNode } from "../types/flowNode";

export const initialNodes: FlowNode[] = [
  {
    id: "1",
    type: "flow",
    position: {
      x: 250,
      y: 80,
    },
    data: {
      action: "tap",
      title: "Tap",
      subtitle: "Tap an element",

      locatorStrategy: "id",
      locator: "",

      debug: {
        breakpoint: false,
      },
    },
  },

  {
    id: "2",
    type: "flow",
    position: {
      x: 250,
      y: 260,
    },
    data: {
      action: "input",
      title: "Input",
      subtitle: "Type text into element",

      locatorStrategy: "id",
      locator: "",

      text: "",

      debug: {
        breakpoint: false,
      },
    },
  },

  {
    id: "3",
    type: "flow",
    position: {
      x: 250,
      y: 440,
    },
    data: {
      action: "assert",
      title: "Assert",
      subtitle: "Verify element exists",

      locatorStrategy: "id",
      locator: "",

      expected: "",

      debug: {
        breakpoint: false,
      },
    },
  },
];

export const initialEdges: Edge[] = [
  {
    id: "e1",
    source: "1",
    target: "2",
  },

  {
    id: "e2",
    source: "2",
    target: "3",
  },
];