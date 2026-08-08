import type { ReactNode } from "react";

export interface Command {
    id: string;

    title: string;

    subtitle?: string;

    category: CommandCategory;

    icon?: ReactNode;

    keywords?: string[];

    shortcut?: string;

    run(): void | Promise<void>;
}

export type CommandCategory =
    | "Project"
    | "Flow"
    | "Execution"
    | "Device"
    | "Settings"
    | "Developer";