import type { Edge } from "reactflow";

import type { FlowNode } from "../../flow/types/flowNode";
import type { GeneratedProject } from "../types/GeneratedProject";

import {
    generatePython,
} from "./generatePython";

import { orderNodes } from "./orderNodes";

import { actionsTemplate } from "../templates/actionsTemplate";
import { assertionsTemplate } from "../templates/assertionsTemplate";
import { driverTemplate } from "../templates/driverTemplate";
import { variablesTemplate } from "../templates/variablesTemplate";
import { waitsTemplate } from "../templates/waitsTemplate";
import { readmeTemplate } from "../templates/readmeTemplate";
import { pytestIniTemplate } from "../templates/pytestIniTemplate";
import { requirementsTemplate } from "../templates/requirementsTemplate";

export interface GenerateProjectOptions {
    capabilities?:
    Record<string, unknown>;

    serverUrl?: string;
}

const DEFAULT_CAPABILITIES:
    Record<string, unknown> = {
    platformName: "Android",

    "appium:automationName":
        "UiAutomator2",

    "appium:deviceName":
        "Android Emulator",

    "appium:noReset": false,
};

const DEFAULT_SERVER_URL =
    "http://127.0.0.1:4723";

export function generateProject(
    nodes: FlowNode[],
    edges: Edge[],
    options: GenerateProjectOptions = {},
): GeneratedProject {
    /*
     * Keep the existing linear ordering for
     * compatibility with the generator tests
     * and for flows without graph edges.
     */
    const orderedNodes =
        orderNodes(
            nodes,
            edges,
        );

    /*
     * When edges exist, the Python generator
     * must receive the original graph nodes.
     *
     * orderNodes() follows the default "next"
     * output and therefore cannot represent
     * IF true/false branches by itself.
     */
    const generatorNodes =
        edges.length > 0
            ? nodes
            : orderedNodes;

    const capabilities =
        options.capabilities ??
        DEFAULT_CAPABILITIES;

    const serverUrl =
        options.serverUrl ??
        DEFAULT_SERVER_URL;

    return {
        generatedAt:
            new Date(),

        generator:
            "FlowTest Studio",

        framework:
            "Pytest + Appium",

        files: [
            {
                path:
                    "tests/test_generated.py",

                content:
                    generatePython(
                        generatorNodes,
                        {
                            capabilities,
                            serverUrl,

                            /*
                             * Keep the previous
                             * generatePython() call
                             * contract when there
                             * are no edges.
                             */
                            ...(edges.length > 0
                                ? { edges }
                                : {}),
                        },
                    ),
            },

            {
                path:
                    "framework/actions.py",

                content:
                    actionsTemplate(),
            },

            {
                path:
                    "framework/driver.py",

                content:
                    driverTemplate(),
            },

            {
                path:
                    "framework/variables.py",

                content:
                    variablesTemplate(),
            },

            {
                path:
                    "framework/assertions.py",

                content:
                    assertionsTemplate(),
            },

            {
                path:
                    "framework/waits.py",

                content:
                    waitsTemplate(),
            },

            {
                path:
                    "README.md",

                content:
                    readmeTemplate(),
            },

            {
                path:
                    "requirements.txt",

                content:
                    requirementsTemplate(),
            },

            {
                path:
                    "pytest.ini",

                content:
                    pytestIniTemplate(),
            },
        ],
    };
}