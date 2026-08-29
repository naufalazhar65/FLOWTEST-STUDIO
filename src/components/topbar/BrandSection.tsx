import { Logo } from "./Logo";

export function BrandSection() {
    return (
        <div className="flex items-center gap-2" aria-label="FlowTest Studio brand">
            <Logo />
        </div>
    );
}