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
`.trim();
}