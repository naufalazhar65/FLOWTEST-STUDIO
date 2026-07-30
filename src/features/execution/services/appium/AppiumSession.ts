export class AppiumSession {
    private sessionId?: string;

    getSessionId(): string {
        if (!this.sessionId) {
            throw new Error(
                "No active Appium session."
            );
        }

        return this.sessionId;
    }

    setSessionId(sessionId: string): void {
        this.sessionId = sessionId;
    }

    hasSession(): boolean {
        return this.sessionId !== undefined;
    }

    clear(): void {
        this.sessionId = undefined;
    }
}

export const appiumSession =
    new AppiumSession();