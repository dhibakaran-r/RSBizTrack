import { AlertTriangle } from "lucide-react";
import Modal from "./Modal";

interface ConfirmDialogProps {
  open: boolean;
  title?: string;
  message: string;
  confirmLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
  loading?: boolean;
}

const ConfirmDialog = ({
  open,
  title = "Confirm Delete",
  message,
  confirmLabel = "Delete",
  onConfirm,
  onCancel,
  loading,
}: ConfirmDialogProps) => {
  return (
    <Modal open={open} title={title} onClose={onCancel} width={400}>
      <div style={{ textAlign: "center", padding: "8px 0" }}>
        {/* Warning icon */}
        <div style={{
          width: 52,
          height: 52,
          borderRadius: "50%",
          background: "#fee2e2",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          margin: "0 auto 16px",
        }}>
          <AlertTriangle size={24} color="#dc2626" />
        </div>

        <p style={{
          fontSize: 14,
          color: "#475569",
          marginBottom: 24,
          lineHeight: 1.6,
        }}>
          {message}
        </p>

        {/* Action buttons */}
        <div style={{
          display: "flex",
          gap: 10,
          justifyContent: "center",
        }}>
          <button
            onClick={onCancel}
            style={{
              padding: "8px 20px",
              fontSize: 14,
              border: "1px solid #e2e8f0",
              borderRadius: 8,
              background: "white",
              color: "#475569",
              cursor: "pointer",
              fontWeight: 500,
            }}
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            style={{
              padding: "8px 20px",
              fontSize: 14,
              border: "none",
              borderRadius: 8,
              background: loading ? "#fca5a5" : "#dc2626",
              color: "white",
              cursor: loading ? "not-allowed" : "pointer",
              fontWeight: 500,
            }}
          >
            {loading ? "Deleting..." : confirmLabel}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default ConfirmDialog;