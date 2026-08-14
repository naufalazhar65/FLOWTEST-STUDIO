export function pytestIniTemplate(): string {
    return `
[pytest]
python_files = test_*.py
python_classes = Test*
python_functions = test_*

pythonpath = .

addopts = -v
`.trim();
}