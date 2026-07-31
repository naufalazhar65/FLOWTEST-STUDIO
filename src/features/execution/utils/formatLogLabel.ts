const LABELS: Record<string, string> = {
    appPackage: "App Package",
    appActivity: "App Activity",
    noReset: "No Reset",

    actual: "Actual",
    expected: "Expected",
    operator: "Operator",

    locator: "Locator",
    locatorStrategy: "Locator Strategy",

    value: "Value",

    delay: "Delay",

    timeout: "Timeout",
    pollingInterval: "Polling Interval",

    reason: "Reason",

    variable: "Variable",

    attribute: "Attribute",

    package: "Package",

    activity: "Activity",

    platform: "Platform",

    platformVersion: "Platform Version",

    device: "Device",

    deviceName: "Device",

    sessionId: "Session ID",

    screenshot: "Screenshot",

    width: "Width",

    height: "Height",

    orientation: "Orientation",
};

export function formatLogLabel(
    key: string
) {
    return LABELS[key] ?? key;
}