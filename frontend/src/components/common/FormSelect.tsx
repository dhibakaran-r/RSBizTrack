interface Option {
  value: string | number;
  label: string;
}

interface FormSelectProps {
  label: string;
  value: string | number;
  onChange: (value: string) => void;
  options: Option[];
  placeholder?: string;
  required?: boolean;
  error?: string;
  disabled?: boolean;
}

const FormSelect = ({
  label,
  value,
  onChange,
  options,
  placeholder = "Select...",
  required,
  error,
  disabled,
}: FormSelectProps) => {
  return (
    <div style={{ marginBottom: 16 }}>
      <label style={{
        display: "block",
        fontSize: 13,
        fontWeight: 500,
        color: "#374151",
        marginBottom: 6,
      }}>
        {label}
        {required && (
          <span style={{ color: "#dc2626", marginLeft: 3 }}>*</span>
        )}
      </label>

      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        disabled={disabled}
        style={{
          width: "100%",
          padding: "9px 12px",
          fontSize: 14,
          border: `1px solid ${error ? "#dc2626" : "#e2e8f0"}`,
          borderRadius: 8,
          outline: "none",
          color: value ? "#1e293b" : "#94a3b8",
          background: disabled ? "#f8fafc" : "white",
          boxSizing: "border-box",
          cursor: disabled ? "not-allowed" : "pointer",
        }}
        onFocus={e => {
          e.currentTarget.style.borderColor = error ? "#dc2626" : "#2563eb";
        }}
        onBlur={e => {
          e.currentTarget.style.borderColor = error ? "#dc2626" : "#e2e8f0";
        }}
      >
        <option value="">{placeholder}</option>
        {options.map(opt => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>

      {error && (
        <span style={{
          fontSize: 12,
          color: "#dc2626",
          marginTop: 4,
          display: "block",
        }}>
          {error}
        </span>
      )}
    </div>
  );
};

export default FormSelect;