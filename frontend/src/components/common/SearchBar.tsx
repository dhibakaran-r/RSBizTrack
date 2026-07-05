import { Search, X } from "lucide-react";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

const SearchBar = ({
  value,
  onChange,
  placeholder = "Search...",
}: SearchBarProps) => {
  return (
    <div style={{
      position: "relative",
      width: 280,
    }}>
      <Search
        size={15}
        style={{
          position: "absolute",
          left: 10,
          top: "50%",
          transform: "translateY(-50%)",
          color: "#94a3b8",
          pointerEvents: "none",
        }}
      />
      <input
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        style={{
          width: "100%",
          padding: "8px 32px 8px 32px",
          fontSize: 13,
          border: "1px solid #e2e8f0",
          borderRadius: 8,
          outline: "none",
          color: "#1e293b",
          background: "white",
          boxSizing: "border-box",
        }}
        onFocus={e => (e.currentTarget.style.borderColor = "#2563eb")}
        onBlur={e => (e.currentTarget.style.borderColor = "#e2e8f0")}
      />
      {/* Clear button */}
      {value && (
        <button
          onClick={() => onChange("")}
          style={{
            position: "absolute",
            right: 8,
            top: "50%",
            transform: "translateY(-50%)",
            background: "none",
            border: "none",
            cursor: "pointer",
            color: "#94a3b8",
            display: "flex",
            padding: 2,
          }}
        >
          <X size={13} />
        </button>
      )}
    </div>
  );
};

export default SearchBar;