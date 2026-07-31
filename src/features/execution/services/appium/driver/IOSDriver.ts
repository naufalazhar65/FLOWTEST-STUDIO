import type {
    Driver,
    EnsureSession,
    LaunchCapabilities,
    SessionPost,
} from "./Driver";

export class IOSDriver implements Driver {
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
        const bundleId =
            options.bundleId?.trim();

        if (!bundleId) {
            throw new Error(
                "bundleId is required.",
            );
        }

        const terminated =
            await this.sessionPost<boolean>(
                "/appium/device/terminate_app",
                {
                    appId: bundleId,
                },
            );

        if (!terminated) {
            throw new Error(
                `Failed to terminate app: ${bundleId}`,
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
        throw new Error(
            "Home is not supported on iOS.",
        );
    }
}