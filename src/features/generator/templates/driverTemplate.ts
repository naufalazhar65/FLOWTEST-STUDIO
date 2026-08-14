export function driverTemplate(): string {
    return `
from appium import webdriver

from appium.options.android import UiAutomator2Options
from appium.options.ios import XCUITestOptions


def create_driver(
    capabilities,
    server_url,
):
    """
    Create an Appium driver.

    capabilities:
        Dictionary containing W3C/Appium
        session capabilities.

    server_url:
        Appium server URL.
    """

    platform = str(
        capabilities.get(
            "platformName",
            "",
        )
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
        command_executor=server_url,
        options=options,
    )
`.trim();
}