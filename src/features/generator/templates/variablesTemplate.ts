export function variablesTemplate(): string {
    return `
_variables = {}


def set_variable(name, value):
    _variables[name] = value


def get_variable(name, default=None):
    return _variables.get(name, default)


def has_variable(name):
    return name in _variables


def remove_variable(name):
    if name in _variables:
        del _variables[name]


def clear_variables():
    _variables.clear()


def resolve_variables(value):
    if not isinstance(value, str):
        return value

    import re

    pattern = r"\\$\\{([^}]+)\\}"

    def replace(match):
        expression = match.group(1).strip()

        parts = expression.split(".")

        variable_name = parts.pop(0)

        if variable_name not in _variables:
            return match.group(0)

        value = _variables[variable_name]

        for key in parts:
            if isinstance(value, dict):
                value = value.get(key)

            else:
                value = getattr(
                    value,
                    key,
                    None,
                )

            if value is None:
                return match.group(0)

        return str(value)

    return re.sub(
        pattern,
        replace,
        value,
    )
`.trim();
}