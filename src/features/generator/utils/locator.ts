export function locatorStrategy(
    strategy: string,
): string {
    const normalized =
        strategy.trim().toLowerCase();

    const mapping: Record<
        string,
        string
    > = {
        id: "AppiumBy.ID",

        xpath: "AppiumBy.XPATH",

        accessibilityid:
            "AppiumBy.ACCESSIBILITY_ID",

        "accessibility id":
            "AppiumBy.ACCESSIBILITY_ID",

        classname:
            "AppiumBy.CLASS_NAME",

        "class name":
            "AppiumBy.CLASS_NAME",

        androiduiautomator:
            "AppiumBy.ANDROID_UIAUTOMATOR",

        "android uiautomator":
            "AppiumBy.ANDROID_UIAUTOMATOR",

        "-android uiautomator":
            "AppiumBy.ANDROID_UIAUTOMATOR",

        iospredicatestring:
            "AppiumBy.IOS_PREDICATE",

        "-ios predicate string":
            "AppiumBy.IOS_PREDICATE",

        iosclasschain:
            "AppiumBy.IOS_CLASS_CHAIN",

        "-ios class chain":
            "AppiumBy.IOS_CLASS_CHAIN",
    };

    const result = mapping[normalized];

    if (!result) {
        throw new Error(
            `Unsupported locator strategy: ${strategy}`,
        );
    }

    return result;
}