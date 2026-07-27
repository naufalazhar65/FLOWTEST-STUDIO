import { plugins } from "../plugins";
import type {
  NodePlugin,
  NodeType,
} from "../types/NodePlugin";

export const nodeRegistry: Record<
  NodeType,
  NodePlugin
> = plugins.reduce(
  (registry, plugin) => {
    registry[plugin.type] = plugin;
    return registry;
  },
  {} as Record<NodeType, NodePlugin>
);