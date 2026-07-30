import type {
  AssertOperator,
} from "../../flow/types/flowNode";

function toNumber(value: string): number {
  return Number(value);
}

function toBoolean(value: string): boolean {
  return value.toLowerCase() === "true";
}

export function compare(
  actual: string,
  expected: string,
  operator: AssertOperator,
): boolean {
  switch (operator) {
    case "equals":
      return actual === expected;

    case "notEquals":
      return actual !== expected;

    case "contains":
      return actual.includes(expected);

    case "notContains":
      return !actual.includes(expected);

    case "startsWith":
      return actual.startsWith(expected);

    case "endsWith":
      return actual.endsWith(expected);

    case "greaterThan":
      return toNumber(actual) > toNumber(expected);

    case "greaterThanOrEqual":
      return (
        toNumber(actual) >=
        toNumber(expected)
      );

    case "lessThan":
      return (
        toNumber(actual) <
        toNumber(expected)
      );

    case "lessThanOrEqual":
      return (
        toNumber(actual) <=
        toNumber(expected)
      );

    case "isTrue":
      return toBoolean(actual);

    case "isFalse":
      return !toBoolean(actual);

    case "isEmpty":
      return actual.trim().length === 0;

    case "isNotEmpty":
      return actual.trim().length > 0;

    case "matches":
      return new RegExp(expected).test(actual);

    default: {
      const exhaustive: never =
        operator;

      throw new Error(
        `Unsupported assert operator: ${exhaustive}`,
      );
    }
  }
}