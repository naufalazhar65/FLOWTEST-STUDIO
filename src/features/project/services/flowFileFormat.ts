import type { Edge } from "reactflow";

import type { FlowProject } from "../../flow/types/FlowProject";

import type { FlowNodeData } from "../../flow/types/flowNode";

const FLOW_FILE_FORMAT_VERSION = 1;

interface StoredPosition {
    x: number;

    y: number;
}

interface StoredNode {
    id: string;

    type: string;

    position: StoredPosition;

    data: FlowNodeData;
}

interface StoredEdge {
    id: string;

    source: string;

    target: string;
}

interface StoredProject {
    formatVersion: number;

    id: string;

    name: string;

    createdAt: string;

    updatedAt: string;

    nodes: StoredNode[];

    edges: StoredEdge[];

    aiSettings?: FlowProject["aiSettings"];
}

interface ParsedProject {
    id?: string;

    name?: string;

    createdAt?: string;

    updatedAt?: string;

    nodes?: FlowProject["nodes"];

    edges?: Edge[];

    aiSettings?: FlowProject["aiSettings"];
}

function sanitizeNode(
    node: FlowProject["nodes"][number],
): StoredNode {
    return {
        id: node.id,
        type: node.type ?? "default",
        position: {
            x: node.position.x,
            y: node.position.y,
        },
        data: node.data,
    };
}

function sanitizeEdge(
    edge: Edge,
): StoredEdge {
    return {
        id: edge.id,
        source: edge.source,
        target: edge.target,
    };
}

export function serializeProject(
    project: FlowProject,
): string {
    const stored: StoredProject = {
        formatVersion: FLOW_FILE_FORMAT_VERSION,
        id: project.id,
        name: project.name,
        createdAt: project.createdAt,
        updatedAt: project.updatedAt,
        nodes: project.nodes.map(
            sanitizeNode,
        ),
        edges: project.edges.map(
            sanitizeEdge,
        ),
    };

    if (project.aiSettings) {
        stored.aiSettings = project.aiSettings;
    }

    return JSON.stringify(
        stored,
        null,
        2,
    );
}

export function deserializeProject(
    text: string,
): FlowProject {
    const parsed =
        JSON.parse(
            text,
        ) as ParsedProject;

    return {
        id: parsed.id ?? "",
        name: parsed.name ?? "Untitled",
        createdAt: parsed.createdAt ?? "",
        updatedAt: parsed.updatedAt ?? "",
        nodes: parsed.nodes ?? [],
        edges: parsed.edges ?? [],
        aiSettings: parsed.aiSettings,
    };
}

export const flowFileFormat = {
    version: FLOW_FILE_FORMAT_VERSION,

    serialize: serializeProject,

    deserialize: deserializeProject,
};
