export function actionsTemplate(): string {
    return `
from appium.webdriver.common.appiumby import AppiumBy

_driver = None


def set_driver(driver):
    global _driver
    _driver = driver


def get_driver():
    if _driver is None:
        raise RuntimeError(
            "Driver has not been initialized."
        )

    return _driver


def _by(strategy):
    mapping = {
        "id": AppiumBy.ID,
        "xpath": AppiumBy.XPATH,
        "accessibility id": AppiumBy.ACCESSIBILITY_ID,
        "class name": AppiumBy.CLASS_NAME,
        "android uiautomator": AppiumBy.ANDROID_UIAUTOMATOR,
        "-android uiautomator": AppiumBy.ANDROID_UIAUTOMATOR,
        "-ios predicate string": AppiumBy.IOS_PREDICATE,
        "-ios class chain": AppiumBy.IOS_CLASS_CHAIN,
    }

    if strategy not in mapping:
        raise ValueError(
            f"Unsupported locator strategy: {strategy}"
        )

    return mapping[strategy]


def find(
    locator_strategy,
    locator,
):
    return get_driver().find_element(
        _by(locator_strategy),
        locator,
    )


def tap(
    locator_strategy,
    locator,
):
    find(
        locator_strategy,
        locator,
    ).click()


def input_text(
    locator_strategy,
    locator,
    value,
):
    element = find(
        locator_strategy,
        locator,
    )

    element.clear()

    element.send_keys(value)


def clear_text(
    locator_strategy,
    locator,
):
    find(
        locator_strategy,
        locator,
    ).clear()


def get_text(
    locator_strategy,
    locator,
):
    return find(
        locator_strategy,
        locator,
    ).text


def get_attribute(
    locator_strategy,
    locator,
    attribute,
):
    return find(
        locator_strategy,
        locator,
    ).get_attribute(attribute)


def element_exists(
    locator_strategy,
    locator,
):
    try:
        find(
            locator_strategy,
            locator,
        )

        return True

    except Exception:
        return False


def is_displayed(
    locator_strategy,
    locator,
):
    return find(
        locator_strategy,
        locator,
    ).is_displayed()


def is_enabled(
    locator_strategy,
    locator,
):
    return find(
        locator_strategy,
        locator,
    ).is_enabled()


def is_selected(
    locator_strategy,
    locator,
):
    return find(
        locator_strategy,
        locator,
    ).is_selected()

def long_press(
    locator_strategy,
    locator,
    duration=1000,
):
    driver = get_driver()

    element = find(
        locator_strategy,
        locator,
    )

    driver.execute_script(
        "mobile: longClickGesture",
        {
            "elementId": element.id,
            "duration": duration,
        },
    )


def double_tap(
    locator_strategy,
    locator,
):
    driver = get_driver()

    element = find(
        locator_strategy,
        locator,
    )

    driver.execute_script(
        "mobile: doubleClickGesture",
        {
            "elementId": element.id,
        },
    )


def drag(
    locator_strategy,
    locator,
    direction,
    distance,
    duration,
):
    driver = get_driver()

    element = find(
        locator_strategy,
        locator,
    )

    driver.execute_script(
        "mobile: dragGesture",
        {
            "elementId": element.id,
            "direction": direction,
            "percent": distance / 100,
            "speed": duration,
        },
    )


def pinch(
    locator_strategy,
    locator,
    percent,
    duration,
):
    driver = get_driver()

    element = find(
        locator_strategy,
        locator,
    )

    driver.execute_script(
        "mobile: pinchOpenGesture",
        {
            "elementId": element.id,
            "percent": percent,
            "speed": duration,
        },
    )


def zoom(
    locator_strategy,
    locator,
    percent,
    duration,
):
    driver = get_driver()

    element = find(
        locator_strategy,
        locator,
    )

    driver.execute_script(
        "mobile: pinchCloseGesture",
        {
            "elementId": element.id,
            "percent": percent,
            "speed": duration,
        },
    )


def fling(
    locator_strategy,
    locator,
    direction,
    speed,
):
    driver = get_driver()

    element = find(
        locator_strategy,
        locator,
    )

    driver.execute_script(
        "mobile: flingGesture",
        {
            "elementId": element.id,
            "direction": direction,
            "speed": speed,
        },
    )


def swipe(
    direction,
    percent=0.8,
):
    driver = get_driver()

    size = driver.get_window_size()

    driver.execute_script(
        "mobile: swipeGesture",
        {
            "left": 0,
            "top": 0,
            "width": size["width"],
            "height": size["height"],
            "direction": direction,
            "percent": percent,
        },
    )


def scroll(
    direction,
    percent=0.8,
):
    driver = get_driver()

    size = driver.get_window_size()

    driver.execute_script(
        "mobile: scrollGesture",
        {
            "left": 0,
            "top": 0,
            "width": size["width"],
            "height": size["height"],
            "direction": direction,
            "percent": percent,
        },
    )
`.trim();
}