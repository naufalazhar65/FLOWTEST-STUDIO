    import {
        appiumSession,
    } from "./AppiumSession";

    import {
        webDriverClient,
    } from "./WebDriverClient";

    import {
        useVideoRecordingStore,
    } from "../../store/useVideoRecordingStore";

    export type VideoRecordingPlatform =
        | "Android"
        | "iOS";

    export interface VideoRecordingArtifact {
        platform: VideoRecordingPlatform;

        base64: string;

        mimeType: "video/mp4";

        fileName: string;
    }

    interface ExecuteResponse {
        value: unknown;
    }

    class VideoRecordingService {
        private recording = false;

        private platform:
            | VideoRecordingPlatform
            | null = null;

        isRecording(): boolean {
            return this.recording;
        }

        async startIfEnabled(): Promise<boolean> {
            const enabled =
                useVideoRecordingStore
                    .getState()
                    .enabled;

            if (!enabled) {
                return false;
            }

            if (this.recording) {
                return false;
            }

            if (
                !appiumSession.hasSession()
            ) {
                console.warn(
                    "[Video Recording] Cannot start recording without an active Appium session.",
                );

                return false;
            }

            const platform =
                this.resolvePlatform();

            if (!platform) {
                console.warn(
                    "[Video Recording] Unable to determine platform from Appium session.",
                );

                return false;
            }

            try {
                if (
                    platform ===
                    "Android"
                ) {
                    await this.execute(
                        "mobile: startMediaProjectionRecording",
                        {
                            resolution:
                                "1280x720",

                            maxDurationSec:
                                120,

                            priority:
                                "normal",
                        },
                    );
                } else {
                    await this.executeCommand(
                        "/appium/start_recording_screen",
                        {
                            options: {
                                timeLimit:
                                    120,

                                videoType:
                                    "libx264",

                                videoFps:
                                    10,

                                pixelFormat:
                                    "yuv420p",
                            },
                        },
                    );
                }

                this.recording = true;

                this.platform =
                    platform;

                console.info(
                    `[Video Recording] Started for ${platform}.`,
                );

                return true;
            } catch (error) {
                this.recording = false;

                this.platform = null;

                console.warn(
                    `[Video Recording] Failed to start recording for ${platform}.`,
                    error,
                );

                return false;
            }
        }

        async stop(): Promise<
            VideoRecordingArtifact | null
        > {
            if (
                !this.recording ||
                !this.platform
            ) {
                return null;
            }

            const platform =
                this.platform;

            try {
                if (
                    !appiumSession.hasSession()
                ) {
                    console.warn(
                        "[Video Recording] Cannot stop recording because the Appium session is no longer active.",
                    );

                    return null;
                }

                const response =
                    platform === "Android"
                        ? await this.execute(
                            "mobile: stopMediaProjectionRecording",
                            {},
                        )
                        : await this.executeCommand(
                            "/appium/stop_recording_screen",
                            {
                                options: {},
                            },
                        );

                const base64 =
                    this.extractVideoBase64(
                        response.value,
                    );

                if (!base64) {
                    console.warn(
                        `[Video Recording] ${platform} returned no video payload.`,
                    );

                    return null;
                }

                const timestamp =
                    new Date()
                        .toISOString()
                        .replace(
                            /[:.]/g,
                            "-",
                        );

                return {
                    platform,

                    base64,

                    mimeType:
                        "video/mp4",

                    fileName:
                        `flowtest-recording-${timestamp}.mp4`,
                };
            } catch (error) {
                console.warn(
                    `[Video Recording] Failed to stop recording for ${platform}.`,
                    error,
                );

                return null;
            } finally {
                this.recording = false;

                this.platform = null;
            }
        }

        private resolvePlatform():
            | VideoRecordingPlatform
            | null {
            if (
                !appiumSession.hasSession()
            ) {
                return null;
            }

            const capabilities =
                appiumSession.getCapabilities();

            const raw =
                capabilities as Record<
                    string,
                    unknown
                >;

            const platformName =
                String(
                    raw.platformName ??
                        raw[
                            "appium:platformName"
                        ] ??
                        "",
                ).toLowerCase();

            if (
                platformName ===
                "android"
            ) {
                return "Android";
            }

            if (
                platformName === "ios"
            ) {
                return "iOS";
            }

            return null;
        }

        private extractVideoBase64(
            value: unknown,
        ): string {
            return typeof value ===
                "string"
                ? value
                : "";
        }

        private async execute(
            script: string,
            args: Record<
                string,
                unknown
            >,
        ): Promise<ExecuteResponse> {
            const sessionId =
                appiumSession.getSessionId();

            return webDriverClient.post<ExecuteResponse>(
                `/session/${sessionId}/execute/sync`,
                {
                    script,

                    args: [args],
                },
            );
        }

        private async executeCommand(
            path: string,
            body: unknown,
        ): Promise<ExecuteResponse> {
            const sessionId =
                appiumSession.getSessionId();

            return webDriverClient.post<ExecuteResponse>(
                `/session/${sessionId}${path}`,
                body,
            );
        }
    }

    export const videoRecordingService =
        new VideoRecordingService();