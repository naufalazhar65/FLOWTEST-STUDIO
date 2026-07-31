import type {
    Driver,
    EnsureSession,
    LaunchCapabilities,
    SessionPost,
} from "./Driver";

export class AndroidDriver implements Driver {
    private readonly ensureSession: EnsureSession;
    private readonly sessionPost: SessionPost;

    constructor(
        ensureSession: EnsureSession,
        sessionPost: SessionPost,
    ) {
        this.ensureSession = ensureSession;
        this.sessionPost = sessionPost;
    }

    async launchApp(
        capabilities: LaunchCapabilities,
    ): Promise<void> {
        await this.ensureSession(capabilities);
    }

    async closeApp(options: {
        appPackage?: string;
        bundleId?: string;
    }): Promise<void> {
        const appId =
            options.appPackage?.trim();

        if (!appId) {
            throw new Error(
                "appPackage is required.",
            );
        }

        const terminated =
            await this.sessionPost<boolean>(
                "/appium/device/terminate_app",
                {
                    appId,
                },
            );

        if (!terminated) {
            throw new Error(
                `Failed to terminate app: ${appId}`,
            );
        }
    }

    async back(): Promise<void> {
        await this.sessionPost(
            "/back",
            {},
        );
    }

    async home(): Promise<void> {
        await this.sessionPost(
            "/appium/device/press_keycode",
            {
                keycode: 3,
            },
        );
    }
}