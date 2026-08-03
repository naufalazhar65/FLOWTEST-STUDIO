import type { GeneratedFile } from "../types/GeneratedFile";

export interface FileTreeFolder {
    name: string;
    files: GeneratedFile[];
}

export interface FileTree {
    rootFiles: GeneratedFile[];
    folders: FileTreeFolder[];
}

export function buildFileTree(
    files: GeneratedFile[],
): FileTree {

    const rootFiles: GeneratedFile[] = [];

    const folders = new Map<
        string,
        GeneratedFile[]
    >();

    for (const file of files) {

        const parts = file.path.split("/");

        // file di root project
        if (parts.length === 1) {
            rootFiles.push(file);
            continue;
        }

        const folder = parts[0];

        const list =
            folders.get(folder) ?? [];

        list.push(file);

        folders.set(
            folder,
            list,
        );
    }

    return {
        rootFiles,
        folders: [...folders.entries()].map(
            ([name, files]) => ({
                name,
                files,
            }),
        ),
    };
}