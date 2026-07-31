import type { LucideIcon } from "lucide-react";
import {
  ArrowDownUp,
  Camera,
  Clock3,
  Hand,
  Keyboard,
  MousePointerClick,
  Rocket,
  Search,
  ShieldCheck,
  Timer,
} from "lucide-react";

export interface ExecutionNodeTheme {
  color: string;
  icon: LucideIcon;
}

export const executionNodeTheme: Record<
  string,
  ExecutionNodeTheme
> = {
  launchApp: {
    color: "#3B82F6",
    icon: Rocket,
  },

  tap: {
    color: "#22C55E",
    icon: MousePointerClick,
  },

  input: {
    color: "#06B6D4",
    icon: Keyboard,
  },

  assert: {
    color: "#F59E0B",
    icon: ShieldCheck,
  },

  wait: {
    color: "#A855F7",
    icon: Timer,
  },

  delay: {
    color: "#FB923C",
    icon: Clock3,
  },

  swipe: {
    color: "#EC4899",
    icon: Hand,
  },

  scroll: {
    color: "#14B8A6",
    icon: ArrowDownUp,
  },

  screenshot: {
    color: "#8B5CF6",
    icon: Camera,
  },

  getter: {
    color: "#64748B",
    icon: Search,
  },
};

export function getExecutionNodeTheme(
  type?: string,
): ExecutionNodeTheme {
  return (
    executionNodeTheme[type ?? ""] ?? {
      color: "#6B7280",
      icon: Search,
    }
  );
}