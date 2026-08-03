import { useState } from "react";

import { ExplorerSearch } from "./ExplorerSearch";
import { ExplorerFolder } from "./ExplorerFolder";
import { ExplorerFile } from "./ExplorerFile";

import { useGeneratorStore } from "../store/useGeneratorStore";
import { buildFileTree } from "../utils/buildFileTree";

export function GeneratorExplorer() {
    const [search, setSearch] =
        useState("");

    const project =
        useGeneratorStore(
            state => state.project,
        );

    const activeFile =
        useGeneratorStore(
            (state) => state.activeFile,
        );

    const openFile =
        useGeneratorStore(
            (state) => state.openFile,
        );

    if (!project) {
        return (
            <div className="p-4 text-sm text-neutral-500">
                No generated project.
            </div>
        );
    }

    const {
        rootFiles,
        folders,
    } = buildFileTree(
        project.files,
    );

    return (
        <>
            <ExplorerSearch
                value={search}
                onChange={setSearch}
            />

            <div className="py-2">
                {rootFiles.map(file => (

                    <ExplorerFile
                        key={file.path}
                        active={activeFile === file.path}
                        name={file.path}
                        onClick={() => openFile(file.path)}
                    />

                ))}
                {folders.map(folder => {

                    const files =
                        folder.files.filter(file =>
                            file.path
                                .toLowerCase()
                                .includes(
                                    search.toLowerCase(),
                                ),
                        );

                    if (
                        files.length === 0
                    ) {
                        return null;
                    }

                    return (
                        <ExplorerFolder
                            key={folder.name}
                            name={folder.name}
                        >
                            {files.map((file) => (
                                <ExplorerFile
                                    key={file.path}
                                    active={
                                        activeFile ===
                                        file.path
                                    }
                                    name={
                                        file.path.split("/").pop() ??
                                        file.path
                                    }
                                    onClick={() =>
                                        openFile(file.path)
                                    }
                                />
                            ))}
                        </ExplorerFolder>
                    );
                })}
            </div>
        </>
    );
}