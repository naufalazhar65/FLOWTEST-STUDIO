import { Loader2 } from "lucide-react";

export function SplashScreen() {
    return (
        <div
            style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                height: "100vh",
                gap: 16,
            }}
        >
            <Loader2
                size={36}
                className="spin"
            />

            <div>
                Loading FlowTest Studio...
            </div>
        </div>
    );
}