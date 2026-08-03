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
`.trim();
}