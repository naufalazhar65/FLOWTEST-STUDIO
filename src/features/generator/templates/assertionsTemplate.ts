export function assertionsTemplate(): string {
    return `
def assert_equals(actual, expected):
    assert actual == expected, (
        f"Expected '{expected}', "
        f"but got '{actual}'."
    )


def assert_not_equals(actual, expected):
    assert actual != expected, (
        f"Did not expect '{expected}'."
    )


def assert_contains(actual, expected):
    assert expected in actual, (
        f"'{expected}' not found in '{actual}'."
    )


def assert_not_contains(actual, expected):
    assert expected not in actual, (
        f"'{expected}' unexpectedly found in '{actual}'."
    )


def assert_starts_with(actual, expected):
    assert actual.startswith(expected), (
        f"'{actual}' does not start with '{expected}'."
    )


def assert_ends_with(actual, expected):
    assert actual.endswith(expected), (
        f"'{actual}' does not end with '{expected}'."
    )


def assert_greater_than(actual, expected):
    assert float(actual) > float(expected), (
        f"{actual} is not greater than {expected}."
    )


def assert_less_than(actual, expected):
    assert float(actual) < float(expected), (
        f"{actual} is not less than {expected}."
    )


def assert_true(value):
    assert bool(value), (
        "Expected value to be True."
    )


def assert_false(value):
    assert not bool(value), (
        "Expected value to be False."
    )


def compare(actual, expected, operator):
    actual = str(actual)
    expected = str(expected)

    if operator == "equals":
        return actual == expected

    if operator == "notEquals":
        return actual != expected

    if operator == "contains":
        return expected in actual

    if operator == "notContains":
        return expected not in actual

    if operator == "startsWith":
        return actual.startswith(expected)

    if operator == "endsWith":
        return actual.endswith(expected)

    if operator == "greaterThan":
        return float(actual) > float(expected)

    if operator == "greaterThanOrEqual":
        return float(actual) >= float(expected)

    if operator == "lessThan":
        return float(actual) < float(expected)

    if operator == "lessThanOrEqual":
        return float(actual) <= float(expected)

    if operator == "isTrue":
        return actual.lower() == "true"

    if operator == "isFalse":
        return actual.lower() != "true"

    if operator == "isEmpty":
        return actual.strip() == ""

    if operator == "isNotEmpty":
        return actual.strip() != ""

    if operator == "matches":
        import re

        return re.search(
            expected,
            actual,
        ) is not None

    raise ValueError(
        f"Unsupported assert operator: {operator}"
    )
`.trim();
}