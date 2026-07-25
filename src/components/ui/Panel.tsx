import type { ReactNode } from "react";

type PanelProps = {
  children: ReactNode;
  title?: string;
};

export function Panel({ title, children }: PanelProps) {
  return (
    <section
      style={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        background: "#161B22",
        border: "1px solid #30363D",
      }}
    >
      {title && (
        <header
          style={{
            padding: "12px 16px",
            borderBottom: "1px solid #30363D",
            fontWeight: 600,
          }}
        >
          {title}
        </header>
      )}

      <div
        style={{
          flex: 1,
          overflow: "auto",
          padding: 16,
        }}
      >
        {children}
      </div>
    </section>
  );
}