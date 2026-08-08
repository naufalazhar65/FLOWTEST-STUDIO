import { create } from "zustand";

interface CommandStore {
    open: boolean;

    query: string;

    openPalette(): void;

    closePalette(): void;

    setQuery(
        value: string,
    ): void;
}

export const useCommandStore =
    create<CommandStore>((set) => ({
        open: false,

        query: "",

        openPalette() {
            set({
                open: true,
            });
        },

        closePalette() {
            set({
                open: false,
                query: "",
            });
        },

        setQuery(query) {
            set({
                query,
            });
        },
    }));