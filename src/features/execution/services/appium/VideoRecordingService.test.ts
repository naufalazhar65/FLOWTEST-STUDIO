import {
    afterEach,
    describe,
    expect,
    it,
    vi,
} from "vitest";

const mocks = vi.hoisted(() => ({
    recordingState: {
        enabled: false,
    },

    appiumSession: {
        hasSession: vi.fn(),
        getSessionId: vi.fn(),
        getCapabilities: vi.fn(),
    },

    webDriverPost: vi.fn(),
}));

vi.mock(
    "./AppiumSession",
    () => ({
        appiumSession:
            mocks.appiumSession,
    }),
);

vi.mock(
    "./WebDriverClient",
    () => ({
        webDriverClient: {
            post:
                mocks.webDriverPost,
        },
    }),
);

vi.mock(
    "../../store/useVideoRecordingStore",
    () => ({
        useVideoRecordingStore: {
            getState: () =>
                mocks.recordingState,
        },
    }),
);

import {
    videoRecordingService,
} from "./VideoRecordingService";

describe(
    "VideoRecordingService",
    () => {
        afterEach(() => {
            mocks.recordingState.enabled =
                false;

            mocks.appiumSession.hasSession
                .mockReset();

            mocks.appiumSession
                .getSessionId
                .mockReset();

            mocks.appiumSession
                .getCapabilities
                .mockReset();

            mocks.webDriverPost
                .mockReset();

            /*
             * Ensure the singleton does not
             * leak recording state between tests.
             */
            if (
                videoRecordingService
                    .isRecording()
            ) {
                void videoRecordingService
                    .stop();
            }
        });

        it(
            "does not start when recording is disabled",
            async () => {
                mocks.recordingState.enabled =
                    false;

                const result =
                    await videoRecordingService
                        .startIfEnabled();

                expect(
                    result,
                ).toBe(false);

                expect(
                    mocks.webDriverPost,
                ).not.toHaveBeenCalled();
            },
        );

        it(
            "does not start without an Appium session",
            async () => {
                mocks.recordingState.enabled =
                    true;

                mocks.appiumSession
                    .hasSession
                    .mockReturnValue(
                        false,
                    );

                const result =
                    await videoRecordingService
                        .startIfEnabled();

                expect(
                    result,
                ).toBe(false);

                expect(
                    mocks.webDriverPost,
                ).not.toHaveBeenCalled();
            },
        );

        it(
            "starts Android recording",
            async () => {
                mocks.recordingState.enabled =
                    true;

                mocks.appiumSession
                    .hasSession
                    .mockReturnValue(
                        true,
                    );

                mocks.appiumSession
                    .getSessionId
                    .mockReturnValue(
                        "android-session",
                    );

                mocks.appiumSession
                    .getCapabilities
                    .mockReturnValue({
                        platformName:
                            "Android",
                    });

                mocks.webDriverPost
                    .mockResolvedValue({
                        value: "",
                    });

                const result =
                    await videoRecordingService
                        .startIfEnabled();

                expect(
                    result,
                ).toBe(true);

                expect(
                    videoRecordingService
                        .isRecording(),
                ).toBe(true);

                expect(
                    mocks.webDriverPost,
                ).toHaveBeenCalledWith(
                    "/session/android-session/execute/sync",
                    {
                        script:
                            "mobile: startMediaProjectionRecording",

                        args: [
                            {
                                resolution:
                                    "1280x720",

                                maxDurationSec:
                                    120,

                                priority:
                                    "normal",
                            },
                        ],
                    },
                );
            },
        );

        it(
            "starts iOS recording using the Appium command endpoint",
            async () => {
                mocks.recordingState.enabled =
                    true;

                mocks.appiumSession
                    .hasSession
                    .mockReturnValue(
                        true,
                    );

                mocks.appiumSession
                    .getSessionId
                    .mockReturnValue(
                        "ios-session",
                    );

                mocks.appiumSession
                    .getCapabilities
                    .mockReturnValue({
                        platformName:
                            "iOS",
                    });

                mocks.webDriverPost
                    .mockResolvedValue({
                        value: "",
                    });

                const result =
                    await videoRecordingService
                        .startIfEnabled();

                expect(
                    result,
                ).toBe(true);

                expect(
                    videoRecordingService
                        .isRecording(),
                ).toBe(true);

                expect(
                    mocks.webDriverPost,
                ).toHaveBeenCalledWith(
                    "/session/ios-session/appium/start_recording_screen",
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
            },
        );

        it(
            "creates an Android MP4 artifact when recording stops",
            async () => {
                mocks.recordingState.enabled =
                    true;

                mocks.appiumSession
                    .hasSession
                    .mockReturnValue(
                        true,
                    );

                mocks.appiumSession
                    .getSessionId
                    .mockReturnValue(
                        "android-session",
                    );

                mocks.appiumSession
                    .getCapabilities
                    .mockReturnValue({
                        platformName:
                            "Android",
                    });

                mocks.webDriverPost
                    .mockResolvedValueOnce({
                        value: "",
                    })
                    .mockResolvedValueOnce({
                        value:
                            "ANDROID_VIDEO_BASE64",
                    });

                await videoRecordingService
                    .startIfEnabled();

                const artifact =
                    await videoRecordingService
                        .stop();

                expect(
                    artifact,
                ).toMatchObject({
                    platform:
                        "Android",

                    base64:
                        "ANDROID_VIDEO_BASE64",

                    mimeType:
                        "video/mp4",
                });

                expect(
                    artifact?.fileName,
                ).toMatch(
                    /^flowtest-recording-.*\.mp4$/,
                );

                expect(
                    videoRecordingService
                        .isRecording(),
                ).toBe(false);
            },
        );

        it(
            "creates an iOS MP4 artifact when recording stops",
            async () => {
                mocks.recordingState.enabled =
                    true;

                mocks.appiumSession
                    .hasSession
                    .mockReturnValue(
                        true,
                    );

                mocks.appiumSession
                    .getSessionId
                    .mockReturnValue(
                        "ios-session",
                    );

                mocks.appiumSession
                    .getCapabilities
                    .mockReturnValue({
                        platformName:
                            "iOS",
                    });

                mocks.webDriverPost
                    .mockResolvedValueOnce({
                        value: "",
                    })
                    .mockResolvedValueOnce({
                        value:
                            "IOS_VIDEO_BASE64",
                    });

                await videoRecordingService
                    .startIfEnabled();

                const artifact =
                    await videoRecordingService
                        .stop();

                expect(
                    artifact,
                ).toMatchObject({
                    platform:
                        "iOS",

                    base64:
                        "IOS_VIDEO_BASE64",

                    mimeType:
                        "video/mp4",
                });

                expect(
                    artifact?.fileName,
                ).toMatch(
                    /^flowtest-recording-.*\.mp4$/,
                );

                expect(
                    videoRecordingService
                        .isRecording(),
                ).toBe(false);
            },
        );

        it(
            "returns null when the stop response has no video payload",
            async () => {
                mocks.recordingState.enabled =
                    true;

                mocks.appiumSession
                    .hasSession
                    .mockReturnValue(
                        true,
                    );

                mocks.appiumSession
                    .getSessionId
                    .mockReturnValue(
                        "ios-session",
                    );

                mocks.appiumSession
                    .getCapabilities
                    .mockReturnValue({
                        platformName:
                            "iOS",
                    });

                mocks.webDriverPost
                    .mockResolvedValue({
                        value: "",
                    });

                await videoRecordingService
                    .startIfEnabled();

                const artifact =
                    await videoRecordingService
                        .stop();

                expect(
                    artifact,
                ).toBeNull();

                expect(
                    videoRecordingService
                        .isRecording(),
                ).toBe(false);
            },
        );

        it(
            "does not mark recording as active when start fails",
            async () => {
                mocks.recordingState.enabled =
                    true;

                mocks.appiumSession
                    .hasSession
                    .mockReturnValue(
                        true,
                    );

                mocks.appiumSession
                    .getSessionId
                    .mockReturnValue(
                        "ios-session",
                    );

                mocks.appiumSession
                    .getCapabilities
                    .mockReturnValue({
                        platformName:
                            "iOS",
                    });

                mocks.webDriverPost
                    .mockRejectedValue(
                        new Error(
                            "Method is not implemented",
                        ),
                    );

                const result =
                    await videoRecordingService
                        .startIfEnabled();

                expect(
                    result,
                ).toBe(false);

                expect(
                    videoRecordingService
                        .isRecording(),
                ).toBe(false);
            },
        );
    },
);