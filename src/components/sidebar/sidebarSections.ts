import type { LucideIcon } from "lucide-react";
import {
    Clock3,
    Database,
    GitBranch,
    MousePointer2,
    Smartphone,
    SquareDashedMousePointer,
} from "lucide-react";

export interface SidebarSectionConfig {
    id: string;
    title: string;
    icon: LucideIcon;
    defaultOpen: boolean;
    actions: string[];

    /**
     * Accent color used across the UI
     * (sidebar, nodes, timeline, execution console, etc.)
     */
    accent: string;
}

export const sidebarSections: SidebarSectionConfig[] = [
    {
        id: "interaction",
        title: "Interaction",
        icon: MousePointer2,
        defaultOpen: true,
        accent: "#3B82F6",
        actions: [
            "tap",
            "input",
            "swipe",
            "scroll",
        ],
    },

    {
        id: "element",
        title: "Element",
        icon: SquareDashedMousePointer,
        defaultOpen: true,
        accent: "#8B5CF6",
        actions: [
            "getText",
            "elementExists",
            "wait",
            "assert",
            "getAttribute",
        ],
    },

    {
        id: "variables",
        title: "Variables",
        icon: Database,
        defaultOpen: false,
        accent: "#F59E0B",
        actions: [
            "setVariable",
        ],
    },

    {
        id: "synchronization",
        title: "Synchronization",
        icon: Clock3,
        defaultOpen: false,
        accent: "#06B6D4",
        actions: [
            "delay",
        ],
    },

    {
        id: "device",
        title: "Device",
        icon: Smartphone,
        defaultOpen: false,
        accent: "#22C55E",
        actions: [
            "launchApp",
            "closeApp",
            "back",
            "home",
            "screenshot",
            "getCurrentActivity",
            "getCurrentPackage",
            "getOrientation",
            "getPlatformVersion",
            "getDeviceName",
            "getDeviceTime",
            "getDisplayed",
            "getSelected",
            "getEnabled",
            "getLocation",
            "getSize",
            "getRect",
        ],
    },

    {
        id: "logic",
        title: "Logic",
        icon: GitBranch,
        defaultOpen: false,
        accent: "#F97316",
        actions: [
            "if",
        ],
    },
];