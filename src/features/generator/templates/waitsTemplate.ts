export function waitsTemplate(): string {
    return `
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

driver = None


def set_driver(instance):
    global driver
    driver = instance


def wait_until_visible(
    strategy,
    locator,
    timeout=10,
    polling_interval=0.5,
):
    return WebDriverWait(
        driver,
        timeout,
        poll_frequency=polling_interval,
    ).until(
        EC.visibility_of_element_located(
            (strategy, locator),
        ),
    )


def wait_until_clickable(
    strategy,
    locator,
    timeout=10,
    polling_interval=0.5,
):
    return WebDriverWait(
        driver,
        timeout,
        poll_frequency=polling_interval,
    ).until(
        EC.element_to_be_clickable(
            (strategy, locator),
        ),
    )


def wait_until_present(
    strategy,
    locator,
    timeout=10,
    polling_interval=0.5,
):
    return WebDriverWait(
        driver,
        timeout,
        poll_frequency=polling_interval,
    ).until(
        EC.presence_of_element_located(
            (strategy, locator),
        ),
    )
`.trim();
}