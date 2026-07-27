import { plugins } from "../plugins";

import type {
  NodePlugin,
  NodeType,
} from "../types/NodePlugin";

const registry = new Map<
  NodeType,
  NodePlugin
>();

plugins.forEach((plugin) => {
  registry.set(plugin.type, plugin);
});

export function getPlugins(): readonly NodePlugin[] {
  return plugins;
}

export function getNodePlugin(
  type: NodeType
): NodePlugin {
  const plugin = registry.get(type);

  if (!plugin) {
    throw new Error(
      `Unknown plugin: ${type}`
    );
  }

  return plugin;
}

export function hasNodePlugin(
  type: NodeType
): boolean {
  return registry.has(type);
}