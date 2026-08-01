import {
    Smartphone,
    Apple,
    Globe,
    Hand,
    Cpu,
    Boxes,
    GitBranch,
    ShieldCheck,
} from "lucide-react";

import type {
    NodeCategory,
    NodePlatform,
} from "../../features/flow/types/NodePlugin";

export const platformMetadata: Record<
    NodePlatform,
    {
        title: string;
        icon: typeof Globe;
        accent: string;
    }
> = {
    "cross-platform": {
        title: "Cross Platform",
        icon: Globe,
        accent: "#3B82F6",
    },

    android: {
        title: "Android",
        icon: Smartphone,
        accent: "#22C55E",
    },

    ios: {
        title: "iOS",
        icon: Apple,
        accent: "#A855F7",
    },
};

export const categoryMetadata: Record<
    NodeCategory,
    {
        title: string;
        icon: typeof Hand;
    }
> = {
    interaction: {
        title: "Interaction",
        icon: Hand,
    },

    element: {
        title: "Element",
        icon: Boxes,
    },

    device: {
        title: "Device",
        icon: Smartphone,
    },

    variables: {
        title: "Variables",
        icon: Cpu,
    },

    logic: {
        title: "Logic",
        icon: GitBranch,
    },

    validation: {
        title: "Validation",
        icon: ShieldCheck,
    },
};