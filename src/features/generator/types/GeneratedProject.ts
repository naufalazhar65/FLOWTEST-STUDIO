import type { GeneratedFile } from "./GeneratedFile";

export interface GeneratedProject {
    files: GeneratedFile[];

    generatedAt: Date;

    generator: string;

    framework: string;
}