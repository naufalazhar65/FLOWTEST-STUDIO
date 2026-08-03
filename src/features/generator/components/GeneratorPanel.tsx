import { GeneratorWorkspace } from "./GeneratorWorkspace";

export function GeneratorPanel() {
    return (
        <div className="flex h-full w-full min-h-0 overflow-hidden">
            <GeneratorWorkspace />
        </div>
    );
}