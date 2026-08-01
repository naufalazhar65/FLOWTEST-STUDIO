interface DividerProps {
  vertical?: boolean;

  length?: number;

  color?: string;
}

export function Divider({
  vertical = true,
  length,
  color = "#30363D",
}: DividerProps) {
  return (
    <div
      style={
        vertical
          ? {
            width: 1,
            height: length ?? 24,
            background: color,
            flexShrink: 0,
          }
          : {
            height: 1,
            width: length ?? "100%",
            background: color,
            flexShrink: 0,
          }
      }
    />
  );
}