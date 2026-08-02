import { useGeneratorStore } from "../store/useGeneratorStore";

export function useCopyCode() {
    const code = useGeneratorStore(
        (state) => state.code,
    );

    return async () => {
        if (!code) {
            return false;
        }

        try {
            await navigator.clipboard.writeText(
                code,
            );

            return true;
        } catch {
            return false;
        }
    };
}