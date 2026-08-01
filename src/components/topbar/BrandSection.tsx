import { Logo } from "./Logo";

export function BrandSection() {
    return (
        <div
            style={{
                display: "flex",
                alignItems: "center",
            }}
        >
            <Logo />
        </div>
    );
}