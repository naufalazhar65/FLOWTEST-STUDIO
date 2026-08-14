import { useMemo, useState } from "react";

import { ExplorerSearch } from "./ExplorerSearch";
import { ExplorerFolder } from "./ExplorerFolder";
import { ExplorerFile } from "./ExplorerFile";

import { useGeneratorStore } from "../store/useGeneratorStore";
import { buildFileTree } from "../utils/buildFileTree";

export function GeneratorExplorer() {
    const [search, setSearch] =
        useState("");

    const [openFolders, setOpenFolders] =
        useState<Record<string, boolean>>(
            {},
        );

    const project =
        useGeneratorStore(
            (state) => state.project,
        );

    const activeFile =
        useGeneratorStore(
            (state) => state.activeFile,
        );

    const openFile =
        useGeneratorStore(
            (state) => state.openFile,
        );

    const fileTree = useMemo(() => {
        if (!project) {
            return {
                rootFiles: [],
                folders: [],
            };
        }

        return buildFileTree(
            project.files,
        );
    }, [project]);

    const normalizedSearch =
        search.trim().toLowerCase();

    const filteredRootFiles =
        useMemo(() => {
            if (!normalizedSearch) {
                return fileTree.rootFiles;
            }

            return fileTree.rootFiles.filter(
                (file) =>
                    file.path
                        .toLowerCase()
                        .includes(
                            normalizedSearch,
                        ),
            );
        }, [
            fileTree.rootFiles,
            normalizedSearch,
        ]);

    const filteredFolders =
        useMemo(() => {
            return fileTree.folders
                .map((folder) => {
                    const files =
                        normalizedSearch
                            ? folder.files.filter(
                                (file) =>
                                    file.path
                                        .toLowerCase()
                                        .includes(
                                            normalizedSearch,
                                        ),
                            )
                            : folder.files;

                    return {
                        ...folder,
                        files,
                    };
                })
                .filter(
                    (folder) =>
                        folder.files.length > 0,
                );
        }, [
            fileTree.folders,
            normalizedSearch,
        ]);

    const resultCount =
        filteredRootFiles.length +
        filteredFolders.reduce(
            (count, folder) =>
                count + folder.files.length,
            0,
        );

    function toggleFolder(
        folderName: string,
    ) {
        setOpenFolders((state) => ({
            ...state,

            [folderName]:
                !(
                    state[folderName] ??
                    true
                ),
        }));
    }

    function isFolderOpen(
        folderName: string,
    ): boolean {
        if (normalizedSearch) {
            return true;
        }

        return (
            openFolders[folderName] ??
            true
        );
    }

    if (!project) {
        return (
            <div
                className="
                    flex
                    h-full
                    items-center
                    justify-center
                    px-4
                    text-center
                "
            >
                <div>
                    <div className="text-sm text-neutral-400">
                        No generated project
                    </div>

                    <div className="mt-1 text-xs text-neutral-600">
                        Generate a project to browse its files.
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex h-full min-h-0 flex-col">
            <ExplorerSearch
                value={search}
                onChange={setSearch}
            />

            <div className="min-h-0 flex-1 overflow-y-auto py-2">
                {resultCount === 0 ? (
                    <div className="px-4 py-8 text-center">
                        <div className="text-sm text-neutral-400">
                            No files found
                        </div>

                        <div className="mt-1 text-xs text-neutral-600">
                            Try a different search term.
                        </div>
                    </div>
                ) : (
                    <>
                        {filteredRootFiles.map(
                            (file) => (
                                <ExplorerFile
                                    key={file.path}
                                    active={
                                        activeFile ===
                                        file.path
                                    }
                                    name={file.path}
                                    onClick={() =>
                                        openFile(
                                            file.path,
                                        )
                                    }
                                />
                            ),
                        )}

                        {filteredFolders.map(
                            (folder) => (
                                <ExplorerFolder
                                    key={folder.name}
                                    name={folder.name}
                                    open={isFolderOpen(
                                        folder.name,
                                    )}
                                    onToggle={() =>
                                        toggleFolder(
                                            folder.name,
                                        )
                                    }
                                >
                                    {folder.files.map(
                                        (file) => (
                                            <ExplorerFile
                                                key={
                                                    file.path
                                                }
                                                active={
                                                    activeFile ===
                                                    file.path
                                                }
                                                name={
                                                    file.path
                                                        .split(
                                                            "/",
                                                        )
                                                        .pop() ??
                                                    file.path
                                                }
                                                onClick={() =>
                                                    openFile(
                                                        file.path,
                                                    )
                                                }
                                            />
                                        ),
                                    )}
                                </ExplorerFolder>
                            ),
                        )}
                    </>
                )}
            </div>
        </div>
    );
}