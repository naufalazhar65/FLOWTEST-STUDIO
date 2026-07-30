export type AppiumCapabilities = Record<
    string,
    unknown
>;

export class AppiumSession {
    private sessionId?: string;

    private capabilities?: AppiumCapabilities;

    getSessionId(): string {
        if (!this.sessionId) {
            throw new Error(
                "No active Appium session.",
            );
        }

        return this.sessionId;
    }

    setSessionId(
        sessionId: string,
    ): void {
        this.sessionId = sessionId;
    }

    hasSession(): boolean {
        return this.sessionId !== undefined;
    }

    getCapabilities(): AppiumCapabilities {
        if (!this.capabilities) {
            throw new Error(
                "No Appium capabilities available.",
            );
        }

        return this.capabilities;
    }

    setCapabilities(
        capabilities: AppiumCapabilities,
    ): void {
        this.capabilities = capabilities;
    }

    clear(): void {
        this.sessionId = undefined;
        this.capabilities = undefined;
    }
}

export const appiumSession =
    new AppiumSession();