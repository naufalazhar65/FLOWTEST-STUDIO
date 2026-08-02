import type { FlowNode } from "../../flow/types/flowNode";

import { emitterRegistry } from "../registry/emitterRegistry";

import { pythonTestTemplate } from "../templates/pythonTestTemplate";

import type { GeneratorContext } from "../types/GeneratorContext";

export function generatePython(
    nodes: FlowNode[],
): string {

    const context: GeneratorContext = {
        framework: "selenium-python-mobile",

        indent: "    ",

        newline: "\n",
    };

    const body = nodes
        .map((node) => {
            const emitter =
                emitterRegistry[
                node.data.action
                ];

            if (!emitter) {
                throw new Error(
                    `No emitter registered for "${node.data.action}"`,
                );
            }

            return emitter.emit(
                node,
                context,
            );
        })
        .map(
            (line) =>
                `    ${line.replace(
                    /\n/g,
                    "\n    ",
                )}`,
        )
        .join("\n\n");

    return pythonTestTemplate(
        body,
    );
}