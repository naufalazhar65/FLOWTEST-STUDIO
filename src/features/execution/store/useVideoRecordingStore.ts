import { create } from "zustand";

interface VideoRecordingState {
    enabled: boolean;

    setEnabled(
        enabled: boolean,
    ): void;

    toggle(): void;

    reset(): void;
}

export const useVideoRecordingStore =
    create<VideoRecordingState>(
        (set) => ({
            enabled: false,

            setEnabled(enabled) {
                set({
                    enabled,
                });
            },

            toggle() {
                set((state) => ({
                    enabled:
                        !state.enabled,
                }));
            },

            reset() {
                set({
                    enabled: false,
                });
            },
        }),
    );