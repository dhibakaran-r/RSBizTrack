interface FormInputProps {
  label: string;
  value: string | number;
  onChange: (value: string) => void;
  type?: string;
  placeholder?: string;
  required?: boolean;
  error?: string;
  disabled?: boolean;
}

const FormInput = ({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
  required,
  error,
  disabled,
}: FormInputProps) => {
  return (
    <div style={{ marginBottom: 16 }}>
      {/* Label */}
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

      {/* Input */}
      <input
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        style={{
          width: "100%",
          padding: "9px 12px",
          fontSize: 14,
          border: `1px solid ${error ? "#dc2626" : "#e2e8f0"}`,
          borderRadius: 8,
          outline: "none",
          color: "#1e293b",
          background: disabled ? "#f8fafc" : "white",
          boxSizing: "border-box",
          transition: "border-color 0.15s ease",
        }}
        onFocus={e => {
          e.currentTarget.style.borderColor = error ? "#dc2626" : "#2563eb";
        }}
        onBlur={e => {
          e.currentTarget.style.borderColor = error ? "#dc2626" : "#e2e8f0";
        }}
      />

      {/* Error message */}
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

export default FormInput;