import { create } from "zustand";

interface GeneratorState {
    code: string;

    setCode(
        code: string,
    ): void;

    clear(): void;
}

export const useGeneratorStore =
    create<GeneratorState>(
        (set) => ({
            code: "",

            setCode: (code) =>
                set({
                    code,
                }),

            clear: () =>
                set({
                    code: "",
                }),
        }),
    );