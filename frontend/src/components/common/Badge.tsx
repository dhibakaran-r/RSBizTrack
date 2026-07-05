interface BadgeProps {
  label: string;
  type?: "success" | "danger" | "warning" | "info" | "default";
}

const colors = {
  success: { bg: "#dcfce7", color: "#166534" },
  danger:  { bg: "#fee2e2", color: "#991b1b" },
  warning: { bg: "#fef3c7", color: "#92400e" },
  info:    { bg: "#dbeafe", color: "#1e40af" },
  default: { bg: "#f1f5f9", color: "#475569" },
};

const Badge = ({ label, type = "default" }: BadgeProps) => {
  const { bg, color } = colors[type];
  return (
    <span style={{
      background: bg,
      color,
      fontSize: 11,
      fontWeight: 500,
      padding: "3px 10px",
      borderRadius: 99,
      display: "inline-block",
      whiteSpace: "nowrap",
    }}>
      {label}
    </span>
  );
};

export default Badge;