export function pytestIniTemplate(): string {
    return `
[pytest]
python_files = test_*.py
python_functions = test_*
addopts = -v
`.trim();
}