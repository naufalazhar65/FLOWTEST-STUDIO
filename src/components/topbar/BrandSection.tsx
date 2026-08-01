import { Logo } from "./Logo";
import { ProjectBadge } from "./ProjectBadge";

export function BrandSection() {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 16,
        minWidth: 280,
      }}
    >
      <Logo />

      <ProjectBadge />
    </div>
  );
}