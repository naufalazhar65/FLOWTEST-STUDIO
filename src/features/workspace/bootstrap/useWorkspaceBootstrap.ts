import { useEffect, useState } from "react";

export function useWorkspaceBootstrap() {
    const [
        loading,
        setLoading,
    ] = useState(true);

    useEffect(() => {
        async function bootstrap() {
            /**
             * Nanti:
             *
             * Restore Session
             * Load Recent Project
             * Load Settings
             */

            setLoading(false);
        }

        void bootstrap();
    }, []);

    return {
        loading,
    };
}