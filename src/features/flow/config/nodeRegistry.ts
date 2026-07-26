import { plugins } from "../plugins";

export const nodeRegistry = Object.fromEntries(
  plugins.map((plugin) => [
    plugin.type,
    plugin,
  ])
);

export type NodeType = keyof typeof nodeRegistry;