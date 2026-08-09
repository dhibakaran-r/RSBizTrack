import { updateStock } from "@/api/modules/stockApi";
import FormInput from "@/components/common/FormInput";
import Modal from "@/components/common/Modal";
import type { StockWithProduct, StockUpdate } from "@/types/stock";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";

interface Props {
  open: boolean;
  editItem?: StockWithProduct | null;
  closeModal: () => void;
  onSuccess: () => void;
}

function StockAddEdit({ open, editItem, closeModal, onSuccess }: Props) {
  const [quantity, setQuantity] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (editItem) setQuantity(String(editItem.quantity));
    else setQuantity("");
  }, [editItem]);

  const handleSave = async () => {
    if (!editItem) return;

    const qty = parseFloat(quantity);
    if (isNaN(qty) || qty < 0) {
      toast.error("Please enter a valid quantity");
      return;
    }

    try {
      setSaving(true);
      const payload: StockUpdate = { quantity: qty };
      await updateStock(editItem.id, payload);
      toast.success("Stock updated successfully!");
      closeModal();
      onSuccess();
    } catch (err) {
      toast.error("Failed to update stock");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal open={open} title={`Update Stock — ${editItem?.product_name}`} onClose={() => closeModal()} width={400}>
      <div style={{ background: "#f8fafc", borderRadius: 8, padding: "12px 16px", marginBottom: 16, fontSize: 13, color: "#475569" }}>
        Current quantity:
        <strong style={{ marginLeft: 6, color: "#1e293b" }}>{editItem?.quantity}</strong>
      </div>

      <FormInput label="New Quantity" value={quantity} onChange={setQuantity} type="number" placeholder="Enter new quantity" required />

      <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", marginTop: 8 }}>
        <button onClick={() => closeModal()} style={{ padding: "8px 18px", fontSize: 14, border: "1px solid #e2e8f0", borderRadius: 8, background: "white", color: "#475569", cursor: "pointer" }} disabled={saving}>
          Cancel
        </button>
        <button onClick={handleSave} disabled={saving} style={{ padding: "8px 18px", fontSize: 14, border: "none", borderRadius: 8, background: saving ? "#93c5fd" : "#2563eb", color: "white", cursor: saving ? "not-allowed" : "pointer", fontWeight: 500 }}>
          {saving ? "Saving..." : "Update Stock"}
        </button>
      </div>
    </Modal>
  );
}

export default StockAddEdit;
