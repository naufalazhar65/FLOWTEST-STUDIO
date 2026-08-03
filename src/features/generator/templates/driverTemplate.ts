export function driverTemplate(): string {
    return `
from appium import webdriver

from appium.options.android import UiAutomator2Options
from appium.options.ios import XCUITestOptions


def create_driver(capabilities):
    """
    Create an Appium driver.

    capabilities:
        dict containing desired capabilities.
    """

    platform = capabilities.get(
        "platformName",
        "",
    ).lower()

    if platform == "android":
        options = UiAutomator2Options()

    elif platform == "ios":
        options = XCUITestOptions()

    else:
        raise ValueError(
            f"Unsupported platform: {platform}"
        )

    options.load_capabilities(
        capabilities,
    )

    return webdriver.Remote(
        command_executor=capabilities.get(
            "serverUrl",
            "http://127.0.0.1:4723",
        ),
        options=options,
    )
`.trim();
}