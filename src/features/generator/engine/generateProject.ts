import type { Edge } from "reactflow";

import type { FlowNode } from "../../flow/types/flowNode";
import type { GeneratedProject } from "../types/GeneratedProject";

import { generatePython } from "./generatePython";
import { orderNodes } from "./orderNodes";

import { actionsTemplate } from "../templates/actionsTemplate";
import { assertionsTemplate } from "../templates/assertionsTemplate";
import { driverTemplate } from "../templates/driverTemplate";
import { variablesTemplate } from "../templates/variablesTemplate";
import { waitsTemplate } from "../templates/waitsTemplate";
import { readmeTemplate } from "../templates/readmeTemplate";
import { pytestTemplate } from "../templates/pytestTemplate";
import { requirementsTemplate } from "../templates/requirementsTemplate";

export function generateProject(
    nodes: FlowNode[],
    edges: Edge[],
): GeneratedProject {
    const orderedNodes = orderNodes(
        nodes,
        edges,
    );

    return {
        generatedAt: new Date(),

        generator: "FlowTest Studio",

        framework: "Pytest + Appium",

        files: [
            {
                path: "tests/test_generated.py",
                content: generatePython(
                    orderedNodes,
                ),
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
            {
                path: "framework/assertions.py",
                content: assertionsTemplate(),
            },
            {
                path: "framework/waits.py",
                content: waitsTemplate(),
            },
            {
                path: "README.md",
                content: readmeTemplate(),
            },
            {
                path: "requirements.txt",
                content: requirementsTemplate(),
            },
            {
                path: "pytest.ini",
                content: pytestTemplate(),
            },
        ],
    };
}