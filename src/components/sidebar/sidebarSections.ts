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
}

export const sidebarSections: SidebarSectionConfig[] = [
    {
        id: "interaction",
        title: "Interaction",
        icon: MousePointer2,
        defaultOpen: true,
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
        actions: [
            "setVariable",
        ],
    },

    {
        id: "synchronization",
        title: "Synchronization",
        icon: Clock3,
        defaultOpen: false,
        actions: [
            "delay",
        ],
    },

    {
        id: "device",
        title: "Device",
        icon: Smartphone,
        defaultOpen: false,
        actions: [
            "launchApp",
            "closeApp",
            "back",
            "home",
            "screenshot",
        ],
    },

    {
        id: "logic",
        title: "Logic",
        icon: GitBranch,
        defaultOpen: false,
        actions: [
            "if",
        ],
    },
];