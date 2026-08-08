export interface OpenProjectResult {
    handle: FileSystemFileHandle;

    file: File;
}

export interface OpenProjectResult {
    file: File;
    handle: FileSystemFileHandle;
}

export async function openProject(): Promise<
    OpenProjectResult | null
> {
    if (
        !("showOpenFilePicker" in window)
    ) {
        alert(
            "Your browser does not support File System Access API.",
        );

        return null;
    }

    try {
        const [handle] =
            await window.showOpenFilePicker({
                multiple: false,

                types: [
                    {
                        description:
                            "FlowTest Studio Project",

                        accept: {
                            "application/json": [
                                ".flow",
                            ],
                        },
                    },
                ],
            });

        const file =
            await handle.getFile();

        return {
            file,
            handle,
        };
    } catch {
        return null;
    }
}