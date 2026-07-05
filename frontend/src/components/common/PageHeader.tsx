import { Plus } from "lucide-react";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  onAdd?: () => void;
  addLabel?: string;
}

const PageHeader = ({
  title,
  subtitle,
  onAdd,
  addLabel = "Add New",
}: PageHeaderProps) => {
  return (
    <div style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: 24,
    }}>
      <div>
        <h1 style={{
          fontSize: 20,
          fontWeight: 700,
          color: "#1e293b",
          marginBottom: 2,
        }}>
          {title}
        </h1>
        {subtitle && (
          <p style={{ fontSize: 13, color: "#94a3b8" }}>{subtitle}</p>
        )}
      </div>

      {onAdd && (
        <button
          onClick={onAdd}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            background: "#2563eb",
            color: "white",
            border: "none",
            borderRadius: 8,
            padding: "9px 16px",
            fontSize: 14,
            fontWeight: 500,
            cursor: "pointer",
          }}
          onMouseEnter={e => (e.currentTarget.style.background = "#1d4ed8")}
          onMouseLeave={e => (e.currentTarget.style.background = "#2563eb")}
        >
          <Plus size={16} />
          {addLabel}
        </button>
      )}
    </div>
  );
};

export default PageHeader;