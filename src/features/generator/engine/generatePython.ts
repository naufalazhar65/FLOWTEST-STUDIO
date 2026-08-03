import type { FlowNode } from "../../flow/types/flowNode";

import { pythonTestTemplate } from "../templates/pythonTestTemplate";
import { generateNode } from "./generateNode";

import type { GeneratorContext } from "../types/GeneratorContext";

export function generatePython(
    nodes: FlowNode[],
): string {
    const context: GeneratorContext = {
        framework:
            "selenium-python-mobile",

        indent: "    ",

        newline: "\n",
    };

    const body = nodes
        .map((node) =>
            generateNode(
                node,
                context,
            ),
        )
        .map(
            (line) =>
                `${context.indent}${line.replace(
                    /\n/g,
                    `\n${context.indent}`,
                )}`,
        )
        .join(
            `${context.newline}${context.newline}`,
        );

    return pythonTestTemplate(
        body,
    );
}