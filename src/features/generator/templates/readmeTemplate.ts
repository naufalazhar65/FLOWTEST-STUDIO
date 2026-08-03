export function readmeTemplate(): string {
    return `
# FlowTest Studio Generated Project

This project was generated automatically by FlowTest Studio.

## Install dependencies

\`\`\`bash
pip install -r requirements.txt
\`\`\`

## Execute tests

\`\`\`bash
pytest
\`\`\`

## Project structure

\`\`\`
tests/
framework/
requirements.txt
pytest.ini
\`\`\`
`.trim();
}