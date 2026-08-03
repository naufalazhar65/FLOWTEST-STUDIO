export function waitsTemplate(): string {
    return `
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

driver = None


def set_driver(instance):
    global driver
    driver = instance


def wait_until_visible(strategy, locator, timeout=10):
    return WebDriverWait(
        driver,
        timeout,
    ).until(
        EC.visibility_of_element_located(
            (strategy, locator),
        ),
    )


def wait_until_clickable(strategy, locator, timeout=10):
    return WebDriverWait(
        driver,
        timeout,
    ).until(
        EC.element_to_be_clickable(
            (strategy, locator),
        ),
    )


def wait_until_present(strategy, locator, timeout=10):
    return WebDriverWait(
        driver,
        timeout,
    ).until(
        EC.presence_of_element_located(
            (strategy, locator),
        ),
    )
`.trim();
}