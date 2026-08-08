import { useState } from "react";

import { Button } from "../../../components/ui/Button";
import { DialogBody } from "../../../components/ui/DialogBody";
import { DialogFooter } from "../../../components/ui/DialogFooter";
import { DialogHeader } from "../../../components/ui/DialogHeader";
import { Input } from "../../../components/ui/Input";
import { Modal } from "../../../components/ui/Modal";
import { RadioGroup } from "../../../components/ui/RadioGroup";

import { createProject } from "../services/createProject";
import { useWorkspaceStore } from "../store/useWorkspaceStore";
import type { ProjectPlatform } from "../types/CreateProjectOptions";

export function CreateProjectDialog() {
    const open = useWorkspaceStore(
        (state) => state.createProjectOpen,
    );

    const close = useWorkspaceStore(
        (state) => state.closeCreateProject,
    );

    const [name, setName] = useState("");

    const [platform, setPlatform] =
        useState<ProjectPlatform>(
            "android",
        );

    const [error, setError] =
        useState("");

    async function handleCreate() {
        const trimmed =
            name.trim();

        if (!trimmed) {
            setError(
                "Project name is required.",
            );
            return;
        }

        await createProject({
            name: trimmed,
            platform,
        });

        setName("");

        setPlatform("android");

        setError("");

        close();
    }

    function handleClose() {
        setName("");

        setPlatform("android");

        setError("");

        close();
    }

    return (
        <Modal
            open={open}
            onClose={handleClose}
            width={560}
        >
            <DialogHeader
                title="Create Project"
                subtitle="Create a new FlowTest Studio project."
            />

            <DialogBody>
                <Input
                    label="Project Name"
                    placeholder="My First Project"
                    value={name}
                    error={error}
                    autoFocus
                    onChange={(e) => {
                        setName(
                            e.target.value,
                        );

                        if (error) {
                            setError("");
                        }
                    }}
                    onKeyDown={(
                        e,
                    ) => {
                        if (
                            e.key ===
                            "Enter"
                        ) {
                            void handleCreate();
                        }
                    }}
                />

                <RadioGroup
                    label="Platform"
                    value={platform}
                    onChange={(value) =>
                        setPlatform(value as ProjectPlatform)
                    }
                    options={[
                        {
                            label: "Android",
                            value: "android",
                        },
                        {
                            label: "iOS",
                            value: "ios",
                        },
                        {
                            label: "Cross Platform",
                            value: "cross-platform",
                        },
                    ]}
                />
            </DialogBody>

            <DialogFooter>
                <Button
                    variant="secondary"
                    onClick={
                        handleClose
                    }
                >
                    Cancel
                </Button>

                <Button
                    variant="primary"
                    onClick={() => {
                        void handleCreate();
                    }}
                >
                    Create
                </Button>
            </DialogFooter>
        </Modal>
    );
}