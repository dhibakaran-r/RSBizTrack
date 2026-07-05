import { X } from "lucide-react";
import { useEffect } from "react";

interface ModalProps {
  open: boolean;
  title: string;
  onClose: () => void;
  children: React.ReactNode;
  width?: number;
}

const Modal = ({
  open,
  title,
  onClose,
  children,
  width = 480,
}: ModalProps) => {
  // Close on Escape key press
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (open) window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open]);

  if (!open) return null;

  return (
    // Backdrop
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.4)",
        zIndex: 200,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 16,
      }}
    >
      {/* Modal box — stop click propagation */}
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: "white",
          borderRadius: 12,
          width: "100%",
          maxWidth: width,
          boxShadow: "0 20px 60px rgba(0,0,0,0.15)",
          display: "flex",
          flexDirection: "column",
          maxHeight: "90vh",
        }}
      >
        {/* Header */}
        <div style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "16px 20px",
          borderBottom: "1px solid #e2e8f0",
          flexShrink: 0,
        }}>
          <span style={{
            fontSize: 15,
            fontWeight: 600,
            color: "#1e293b",
          }}>
            {title}
          </span>
          <button
            onClick={onClose}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "#94a3b8",
              display: "flex",
              padding: 4,
              borderRadius: 6,
            }}
            onMouseEnter={e => (e.currentTarget.style.color = "#1e293b")}
            onMouseLeave={e => (e.currentTarget.style.color = "#94a3b8")}
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div style={{
          padding: "20px",
          overflowY: "auto",
          flex: 1,
        }}>
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;