import type { NodePlugin } from "../types/NodePlugin";

import { tapNode } from "./Tap";
import { inputNode } from "./Input";
import { assertNode } from "./Assert";

export const plugins: NodePlugin[] = [
  tapNode,
  inputNode,
  assertNode,
];