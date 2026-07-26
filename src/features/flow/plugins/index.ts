import { tapNode } from "./Tap";
import { inputNode } from "./Input";
import { assertNode } from "./Assert";

export const plugins = [
  tapNode,
  inputNode,
  assertNode,
];