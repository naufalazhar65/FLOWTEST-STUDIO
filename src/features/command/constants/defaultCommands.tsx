import {
    FolderPlus,
    FolderOpen,
    Play,
    Save,
    SaveAll,
    X,
    Copy,
    Clipboard,
    Undo2,
    Redo2,
} from "lucide-react";

import {
    registerCommand,
} from "../services/commandRegistry";

import {
    useWorkspaceStore,
} from "../../workspace/store/useWorkspaceStore";

import {
    openProjectWorkflow,
} from "../../project/services/openProjectWorkflow";

import {
    saveProjectWorkflow,
    saveProjectAsWorkflow,
} from "../../project/workflows/saveProjectWorkflow";

import {
    closeProject,
} from "../../project/services/closeProject";

import {
    useFlowStore,
} from "../../flow/store/useFlowStore";

registerCommand({
    id: "project.new",

    title: "Create Project",

    subtitle:
        "Create a new FlowTest Studio project",

    category: "Project",

    icon: (
        <FolderPlus size={18} />
    ),

    shortcut: "⌘N",

    run() {
        useWorkspaceStore
            .getState()
            .openCreateProject();
    },
});

registerCommand({
    id: "project.open",

    title: "Open Project",

    subtitle:
        "Open an existing project",

    category: "Project",

    icon: (
        <FolderOpen size={18} />
    ),

    shortcut: "⌘O",

    async run() {
        await openProjectWorkflow();
    },
});

registerCommand({
    id: "project.save",

    title: "Save Project",

    subtitle:
        "Save current project",

    category: "Project",

    icon: (
        <Save size={18} />
    ),

    shortcut: "⌘S",

    async run() {
        await saveProjectWorkflow();
    },
});

registerCommand({
    id: "project.saveAs",

    title: "Save Project As",

    subtitle:
        "Save project to a new file",

    category: "Project",

    icon: (
        <SaveAll size={18} />
    ),

    shortcut: "⇧⌘S",

    async run() {
        await saveProjectAsWorkflow();
    },
});

registerCommand({
    id: "project.close",

    title: "Close Project",

    subtitle:
        "Close the current project",

    category: "Project",

    icon: (
        <X size={18} />
    ),

    shortcut: "⇧⌘W",

    run() {
        closeProject();
    },
});

registerCommand({
    id: "flow.run",

    title: "Run Flow",

    subtitle:
        "Execute current flow",

    category: "Execution",

    icon: (
        <Play size={18} />
    ),

    shortcut: "⌘R",

    run() {
        // Akan kita hubungkan
        // ke execution workflow.
    },
});

registerCommand({
    id: "node.copy",

    title: "Copy Node",

    subtitle:
        "Copy the selected node",

    category: "Flow",

    icon: (
        <Copy size={18} />
    ),

    shortcut: "⌘C",

    run() {
        useFlowStore
            .getState()
            .copyNode();
    },
});

registerCommand({
    id: "node.paste",

    title: "Paste Node",

    subtitle:
        "Paste the copied node",

    category: "Flow",

    icon: (
        <Clipboard size={18} />
    ),

    shortcut: "⌘V",

    run() {
        useFlowStore
            .getState()
            .pasteNode();
    },
});

registerCommand({
    id: "edit.undo",

    title: "Undo",

    subtitle:
        "Undo the last change",

    category: "Flow",

    icon: (
        <Undo2 size={18} />
    ),

    shortcut: "⌘Z",

    run() {
        useFlowStore
            .getState()
            .undo();
    },
});

registerCommand({
    id: "edit.redo",

    title: "Redo",

    subtitle:
        "Redo the last change",

    category: "Flow",

    icon: (
        <Redo2 size={18} />
    ),

    shortcut: "⇧⌘Z",

    run() {
        useFlowStore
            .getState()
            .redo();
    },
});