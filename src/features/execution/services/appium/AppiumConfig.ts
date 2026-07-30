export interface AppiumConfiguration {
    serverUrl: string;

    platformName: "Android" | "iOS";

    automationName: string;

    deviceName: string;

    platformVersion?: string;
}

export class AppiumConfig {
    private config: AppiumConfiguration = {
        serverUrl: "http://127.0.0.1:4723",
        platformName: "Android",
        automationName: "UiAutomator2",
        deviceName: "Android Emulator",
    };

    get(): AppiumConfiguration {
        return this.config;
    }

    update(
        config: Partial<AppiumConfiguration>,
    ): void {
        this.config = {
            ...this.config,
            ...config,
        };
    }
}

export const appiumConfig =
    new AppiumConfig();