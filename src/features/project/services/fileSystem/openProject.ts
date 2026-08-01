export interface OpenProjectResult {
    handle: FileSystemFileHandle;

    file: File;
}

export async function openProject(): Promise<OpenProjectResult | null> {
    try {
        const [handle] =
            await window.showOpenFilePicker({
                multiple: false,

                types: [
                    {
                        description:
                            "FlowTest Project",

                        accept: {
                            "application/json": [
                                ".flow",
                                ".json",
                            ],
                        },
                    },
                ],
            });

        const file =
            await handle.getFile();

        return {
            handle,
            file,
        };
    } catch {
        return null;
    }
}