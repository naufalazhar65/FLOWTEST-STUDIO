import type { AppiumCapabilities } from "../AppiumSession";

export type LaunchCapabilities = AppiumCapabilities;

export type EnsureSession = (
    capabilities: LaunchCapabilities,
) => Promise<void>;

export type SessionPost = <T>(
    path: string,
    body: unknown,
) => Promise<T>;

export interface Driver {
    launchApp(
        capabilities: LaunchCapabilities,
    ): Promise<void>;

    closeApp(options: {
        appPackage?: string;
        bundleId?: string;
    }): Promise<void>;

    back(): Promise<void>;

    home(): Promise<void>;
}