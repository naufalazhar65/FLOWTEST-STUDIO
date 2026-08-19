import {
    beforeEach,
    describe,
    expect,
    it,
    vi,
} from "vitest";

const mocks =
    vi.hoisted(
        () => ({
            getPageSource:
                vi.fn(),

            testLocator:
                vi.fn(),
        }),
    );

vi.mock(
    "../../inspector/services/getPageSource",
    () => ({
        getPageSource:
            mocks.getPageSource,
    }),
);

vi.mock(
    "../../inspector/services/testLocator",
    () => ({
        testLocator:
            mocks.testLocator,
    }),
);

import {
    resolveAILocatorFromApp,
} from "./resolveAILocatorFromApp";

function createPageSource(): string {
    return `
        <hierarchy>
            <android.widget.EditText
                text=""
                content-desc="Username"
                resource-id="com.demo:id/username_input"
                class="android.widget.EditText"
                displayed="true"
                enabled="true"
                selected="false"
                accessible="true"
            />

            <android.widget.EditText
                text=""
                content-desc="Password"
                resource-id="com.demo:id/password_input"
                class="android.widget.EditText"
                displayed="true"
                enabled="true"
                selected="false"
                accessible="true"
            />

            <android.widget.Button
                text="Login"
                content-desc="Login"
                resource-id="com.demo:id/login_button"
                class="android.widget.Button"
                displayed="true"
                enabled="true"
                selected="false"
                accessible="true"
            />
        </hierarchy>
    `;
}

describe(
    "resolveAILocatorFromApp",
    () => {
        beforeEach(
            () => {
                vi.resetAllMocks();

                mocks.getPageSource
                    .mockResolvedValue(
                        createPageSource(),
                    );

                mocks.testLocator
                    .mockResolvedValue({
                        found:
                            true,

                        elementId:
                            "real-element",
                    });
            },
        );

        it(
            "returns notFound when the target is empty",
            async () => {
                const result =
                    await resolveAILocatorFromApp(
                        "   ",
                    );

                expect(
                    result.status,
                ).toBe(
                    "notFound",
                );

                expect(
                    result.target,
                ).toBe(
                    "   ",
                );

                expect(
                    result.selected,
                ).toBeNull();

                expect(
                    result.candidates,
                ).toEqual(
                    [],
                );

                expect(
                    result.matchedElementId,
                ).toBeNull();

                expect(
                    result.error,
                ).toBe(
                    "Locator target is required.",
                );

                expect(
                    mocks.getPageSource,
                ).not.toHaveBeenCalled();

                expect(
                    mocks.testLocator,
                ).not.toHaveBeenCalled();
            },
        );

        it(
            "resolves a semantic target against the active app",
            async () => {
                const result =
                    await resolveAILocatorFromApp(
                        "username",
                    );

                expect(
                    result.status,
                ).toBe(
                    "resolved",
                );

                expect(
                    result.selected,
                ).toMatchObject({
                    strategy:
                        "id",

                    value:
                        "com.demo:id/username_input",

                    recommended:
                        true,
                });

                expect(
                    mocks.getPageSource,
                ).toHaveBeenCalledTimes(
                    1,
                );

                expect(
                    mocks.testLocator,
                ).toHaveBeenCalled();
            },
        );

        it(
            "returns notFound when semantic resolution finds nothing",
            async () => {
                const result =
                    await resolveAILocatorFromApp(
                        "remember me",
                    );

                expect(
                    result.status,
                ).toBe(
                    "notFound",
                );

                expect(
                    result.selected,
                ).toBeNull();

                expect(
                    mocks.testLocator,
                ).not.toHaveBeenCalled();
            },
        );

        it(
            "returns unavailable when page source cannot be retrieved",
            async () => {
                mocks.getPageSource
                    .mockRejectedValue(
                        new Error(
                            "No active Appium session.",
                        ),
                    );

                const result =
                    await resolveAILocatorFromApp(
                        "username",
                    );

                expect(
                    result.status,
                ).toBe(
                    "unavailable",
                );

                expect(
                    result.error,
                ).toBe(
                    "No active Appium session.",
                );
            },
        );

        it(
            "tries the next candidate when the first locator fails",
            async () => {
                mocks.testLocator
                    .mockResolvedValueOnce({
                        found:
                            false,

                        error:
                            "Element not found.",
                    })
                    .mockResolvedValueOnce({
                        found:
                            true,

                        elementId:
                            "real-element",
                    });

                const result =
                    await resolveAILocatorFromApp(
                        "login",
                    );

                expect(
                    result.status,
                ).toBe(
                    "resolved",
                );

                expect(
                    mocks.testLocator,
                ).toHaveBeenCalledTimes(
                    2,
                );
            },
        );

        it(
            "returns notFound when all candidates fail",
            async () => {
                mocks.testLocator
                    .mockResolvedValue({
                        found:
                            false,

                        error:
                            "Element not found.",
                    });

                const result =
                    await resolveAILocatorFromApp(
                        "login",
                    );

                expect(
                    result.status,
                ).toBe(
                    "notFound",
                );

                expect(
                    result.selected,
                ).toBeNull();
            },
        );
    },
);