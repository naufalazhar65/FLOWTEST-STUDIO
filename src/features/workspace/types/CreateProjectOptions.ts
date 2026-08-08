export type ProjectPlatform =
    | "android"
    | "ios"
    | "cross-platform";

export interface CreateProjectOptions {
    name: string;

    platform: ProjectPlatform;
}