import {
    generateProject,
} from "../engine/generateProject";

import {
    useGeneratorStore,
} from "../store/useGeneratorStore";

import {
    useFlowStore,
} from "../../flow/store/useFlowStore";

import {
    useAppiumConfigStore,
} from "../../execution/store/useAppiumConfigStore";

import {
    buildCapabilities,
    type LaunchCapabilities,
} from "../../execution/services/appium/buildCapabilities";

import type {
    LaunchAppNodeData,
} from "../../flow/types/flowNode";

function getLaunchNode(
    nodes: ReturnType<
        typeof useFlowStore.getState
    >["nodes"],
): LaunchAppNodeData | undefined {
    const launchNode =
        nodes.find(
            (node) =>
                node.data.action ===
                "launchApp",
        );

    if (
        !launchNode ||
        launchNode.data.action !==
        "launchApp"
    ) {
        return undefined;
    }

    return launchNode.data;
}

export class GeneratorService {
    generate() {
        const {
            nodes,
            edges,
        } =
            useFlowStore.getState();

        const appiumConfig =
            useAppiumConfigStore.getState()
                .config;

        const launchNode =
            getLaunchNode(nodes);

        const platform =
            launchNode?.platform ??
            appiumConfig.platformName;

        const launchCapabilities:
            LaunchCapabilities = {
            platform,

            noReset:
                launchNode?.noReset ??
                false,
        };

        if (platform === "Android") {
            launchCapabilities.appPackage =
                launchNode?.appPackage ??
                "";

            launchCapabilities.appActivity =
                launchNode?.appActivity ??
                "";
        }

        if (platform === "iOS") {
            launchCapabilities.bundleId =
                launchNode?.bundleId ??
                "";

            launchCapabilities.app =
                launchNode?.app ??
                "";
        }

        const capabilities =
            buildCapabilities(
                launchCapabilities,
            );

        const project =
            generateProject(
                nodes,
                edges,
                {
                    capabilities,

                    serverUrl:
                        appiumConfig.serverUrl,
                },
            );

        useGeneratorStore
            .getState()
            .setProject(project);

        return project;
    }

    clear() {
        useGeneratorStore
            .getState()
            .clear();
    }
}

export const generatorService =
    new GeneratorService();