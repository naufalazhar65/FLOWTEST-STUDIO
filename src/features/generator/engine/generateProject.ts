import type { FlowNode } from "../../flow/types/flowNode";
import type { GeneratedProject } from "../types/GeneratedProject";

import { generatePython } from "./generatePython";

import { actionsTemplate } from "../templates/actionsTemplate";
import { driverTemplate } from "../templates/driverTemplate";
import { variablesTemplate } from "../templates/variablesTemplate";

export function generateProject(
    nodes: FlowNode[],
): GeneratedProject {
    return {
        files: [
            {
                path: "tests/test_generated.py",
                content: generatePython(nodes),
            },
            {
                path: "framework/actions.py",
                content: actionsTemplate(),
            },
            {
                path: "framework/driver.py",
                content: driverTemplate(),
            },
            {
                path: "framework/variables.py",
                content: variablesTemplate(),
            },
        ],
    };
}