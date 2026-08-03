export function requirementsTemplate(): string {
    return `
pytest>=8.0.0
Appium-Python-Client>=5.2.4
selenium>=4.35.0
`.trim();
}