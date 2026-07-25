interface TextFieldProps {
  label: string;
  value: string;
  placeholder?: string;
  onChange: (value: string) => void;
}

export function TextField({
  label,
  value,
  placeholder,
  onChange,
}: TextFieldProps) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 6,
        marginBottom: 18,
      }}
    >
      <label
        style={{
          fontSize: 13,
          color: "#9CA3AF",
        }}
      >
        {label}
      </label>

      <input
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        style={{
          background: "#0D1117",
          border: "1px solid #30363D",
          color: "#FFF",
          padding: "10px 12px",
          borderRadius: 8,
          outline: "none",
        }}
      />
    </div>
  );
}