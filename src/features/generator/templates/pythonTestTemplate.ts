export function pythonTestTemplate(
    body: string,
): string {
    return `
from framework.driver import create_driver
from framework.actions import *
from framework.variables import *

driver = create_driver()

set_driver(driver)


def test_generated():

${body}

    driver.quit()
`.trim();
}