import type {
    AppiumCapabilities,
} from "./AppiumSession";

export interface CapabilityValidationResult {
    valid: boolean;
    errors: string[];
}

function getCapability(
    capabilities: AppiumCapabilities,
    key: string,
    prefixedKey?: string,
): unknown {
    return (
        capabilities[key] ??
        (
            prefixedKey
                ? capabilities[prefixedKey]
                : undefined
        )
    );
}

function getStringCapability(
    capabilities: AppiumCapabilities,
    key: string,
    prefixedKey?: string,
): string {
    const value = getCapability(
        capabilities,
        key,
        prefixedKey,
    );

    return typeof value === "string"
        ? value.trim()
        : "";
}

export function validateCapabilities(
    capabilities: AppiumCapabilities,
): CapabilityValidationResult {
    const errors: string[] = [];

    const platformName =
        getStringCapability(
            capabilities,
            "platformName",
            "appium:platformName",
        ).toLowerCase();

    const automationName =
        getStringCapability(
            capabilities,
            "automationName",
            "appium:automationName",
        );

    const deviceName =
        getStringCapability(
            capabilities,
            "deviceName",
            "appium:deviceName",
        );

    const platformVersion =
        getStringCapability(
            capabilities,
            "platformVersion",
            "appium:platformVersion",
        );

    const udid =
        getStringCapability(
            capabilities,
            "udid",
            "appium:udid",
        );

    const noReset =
        getCapability(
            capabilities,
            "noReset",
            "appium:noReset",
        );

    if (
        platformName !== "android" &&
        platformName !== "ios"
    ) {
        errors.push(
            "Platform name must be either Android or iOS.",
        );
    }

    if (!automationName) {
        errors.push(
            "Automation name is required.",
        );
    } else if (
        platformName === "android" &&
        automationName !== "UiAutomator2"
    ) {
        errors.push(
            "Android requires the UiAutomator2 automation driver.",
        );
    } else if (
        platformName === "ios" &&
        automationName !== "XCUITest"
    ) {
        errors.push(
            "iOS requires the XCUITest automation driver.",
        );
    }

    if (!deviceName) {
        errors.push(
            "Device name is required. Select a connected Android or iOS device.",
        );
    }

    if (
        platformVersion &&
        typeof getCapability(
            capabilities,
            "platformVersion",
            "appium:platformVersion",
        ) !== "string"
    ) {
        errors.push(
            "Platform version must be a string.",
        );
    }

    if (
        udid &&
        typeof getCapability(
            capabilities,
            "udid",
            "appium:udid",
        ) !== "string"
    ) {
        errors.push(
            "Device UDID must be a string.",
        );
    }

    if (
        noReset !== undefined &&
        typeof noReset !== "boolean"
    ) {
        errors.push(
            "noReset must be a boolean value.",
        );
    }

    return {
        valid: errors.length === 0,
        errors,
    };
}

export function assertValidCapabilities(
    capabilities: AppiumCapabilities,
): void {
    const result =
        validateCapabilities(capabilities);

    if (result.valid) {
        return;
    }

    throw new Error(
        [
            "Invalid Appium capabilities:",
            ...result.errors.map(
                (error) => `- ${error}`,
            ),
        ].join("\n"),
    );
}