import type { Command } from "../types/Command";

const commands: Command[] = [];

export function registerCommand(
    command: Command,
): void {
    const existingIndex =
        commands.findIndex(
            (item) =>
                item.id === command.id,
        );

    if (existingIndex >= 0) {
        commands[existingIndex] =
            command;

        return;
    }

    commands.push(command);
}

export function getCommands(): Command[] {
    return commands;
}

export async function executeCommand(
    id: string,
): Promise<void> {
    const command =
        commands.find(
            (item) => item.id === id,
        );

    if (!command) {
        throw new Error(
            `Command not found: ${id}`,
        );
    }

    await command.run();
}