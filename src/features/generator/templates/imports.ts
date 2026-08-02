export function importsTemplate(): string {
    return [
        "from appium.webdriver.common.appiumby import AppiumBy",
        "from framework.actions import *",
    ].join("\n");
}