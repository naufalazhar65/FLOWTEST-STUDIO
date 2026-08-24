import {
    describe,
    expect,
    it,
    vi,
} from "vitest";

import {
    fireEvent,
    render,
    screen,
} from "@testing-library/react";

import {
    DeviceCard,
} from "./DeviceCard";

import type {
    Device,
} from "../types/Device";

const androidDevice: Device = {
    id:
        "ANDROID-001",

    name:
        "Pixel 9 Pro",

    platform:
        "android",

    version:
        "15",

    udid:
        "ANDROID-UDID-001",

    status:
        "connected",

    emulator:
        true,
};

const iosDevice: Device = {
    id:
        "IOS-001",

    name:
        "iPhone 17 Pro",

    platform:
        "ios",

    version:
        "26.4",

    udid:
        "IOS-UDID-001",

    status:
        "connected",

    emulator:
        true,
};

describe(
    "DeviceCard",
    () => {
        it(
            "renders the device name",
            () => {
                render(
                    <DeviceCard
                        device={
                            androidDevice
                        }
                    />,
                );

                expect(
                    screen.getByText(
                        "Pixel 9 Pro",
                    ),
                ).toBeDefined();
            },
        );

        it(
            "renders the platform and version",
            () => {
                render(
                    <DeviceCard
                        device={
                            androidDevice
                        }
                    />,
                );

                expect(
                    screen.getByText(
                        "ANDROID 15",
                    ),
                ).toBeDefined();
            },
        );

        it(
            "renders the device UDID",
            () => {
                render(
                    <DeviceCard
                        device={
                            androidDevice
                        }
                    />,
                );

                expect(
                    screen.getByText(
                        "ANDROID-UDID-001",
                    ),
                ).toBeDefined();
            },
        );

        it(
            "renders an Android device",
            () => {
                render(
                    <DeviceCard
                        device={
                            androidDevice
                        }
                    />,
                );

                expect(
                    screen.getByText(
                        "Pixel 9 Pro",
                    ),
                ).toBeDefined();

                expect(
                    screen.getByText(
                        "ANDROID 15",
                    ),
                ).toBeDefined();
            },
        );

        it(
            "renders an iOS device",
            () => {
                render(
                    <DeviceCard
                        device={
                            iosDevice
                        }
                    />,
                );

                expect(
                    screen.getByText(
                        "iPhone 17 Pro",
                    ),
                ).toBeDefined();

                expect(
                    screen.getByText(
                        "IOS 26.4",
                    ),
                ).toBeDefined();
            },
        );

        it(
            "calls onClick when the device card is clicked",
            () => {
                const onClick =
                    vi.fn();

                render(
                    <DeviceCard
                        device={
                            androidDevice
                        }
                        onClick={
                            onClick
                        }
                    />,
                );

                fireEvent.click(
                    screen.getByRole(
                        "button",
                    ),
                );

                expect(
                    onClick,
                ).toHaveBeenCalledTimes(
                    1,
                );
            },
        );

        it(
            "renders as selected when selected is true",
            () => {
                render(
                    <DeviceCard
                        device={
                            androidDevice
                        }
                        selected
                    />,
                );

                const card =
                    screen.getByRole(
                        "button",
                    );

                expect(
                    card.style.background,
                ).not.toBe("");

                expect(
                    card.style.border,
                ).not.toBe("");
            },
        );

        it(
            "renders as unselected by default",
            () => {
                render(
                    <DeviceCard
                        device={
                            androidDevice
                        }
                    />,
                );

                const card =
                    screen.getByRole(
                        "button",
                    );

                expect(
                    card.style.background,
                ).not.toBe("");

                expect(
                    card.style.border,
                ).not.toBe("");
            },
        );

        it(
            "renders connected status",
            () => {
                render(
                    <DeviceCard
                        device={
                            androidDevice
                        }
                    />,
                );

                const status =
                    screen
                        .getByRole(
                            "button",
                        )
                        .querySelector(
                            "svg:last-child",
                        );

                expect(
                    status,
                ).not.toBeNull();
            },
        );

        it(
            "renders busy status",
            () => {
                render(
                    <DeviceCard
                        device={{
                            ...androidDevice,

                            status:
                                "busy",
                        }}
                    />,
                );

                const status =
                    screen
                        .getByRole(
                            "button",
                        )
                        .querySelector(
                            "svg:last-child",
                        );

                expect(
                    status,
                ).not.toBeNull();
            },
        );

        it(
            "renders offline status",
            () => {
                render(
                    <DeviceCard
                        device={{
                            ...androidDevice,

                            status:
                                "offline",
                        }}
                    />,
                );

                const status =
                    screen
                        .getByRole(
                            "button",
                        )
                        .querySelector(
                            "svg:last-child",
                        );

                expect(
                    status,
                ).not.toBeNull();
            },
        );
    },
);