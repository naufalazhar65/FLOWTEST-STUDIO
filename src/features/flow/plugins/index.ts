import { tapNode } from "./Tap";
import { inputNode } from "./Input";
import { assertNode } from "./Assert";
import { setVariableNode } from "./SetVariable";

import type { NodePlugin } from "../types/NodePlugin";

export const plugins: NodePlugin[] = [
  tapNode,
  inputNode,
  assertNode,
  setVariableNode,
];