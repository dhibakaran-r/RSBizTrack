import { createSupplier, updateSupplier } from "@/api/modules/supplierAPI";
import FormInput from "@/components/common/FormInput";
import Modal from "@/components/common/Modal";
import type { SupplierCreate, SupplierUpdate } from "@/types/suppliers";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";

interface Props {
  open: boolean;
  editItem?: { id?: number; name: string; description?: string | null } | null;
  closeModal: () => void;
  onSuccess: () => void;
}

const emptyForm = { name: "", description: "" };

function SuppliersAddEdit({ open, editItem, closeModal, onSuccess }: Props) {
  const [form, setForm] = useState(emptyForm);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const [saving, setSaving] = useState(false);

  const isEditMode = !!editItem;

  const validate = (): boolean => {
    const errors: Record<string, string> = {};
    if (!form.name.trim()) {
      errors.name = "Supplier name is required";
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;

    try {
      setSaving(true);

      if (isEditMode && editItem) {
        const payload: SupplierUpdate = { name: form.name.trim() };
        await updateSupplier(editItem.id, payload);
        toast.success("Supplier updated successfully!");
        onSuccess();
        closeModal();
      } else {
        const payload: SupplierCreate = { name: form.name.trim() };
        await createSupplier(payload);
        toast.success("Supplier created successfully!");
        onSuccess();
        closeModal();
      }
    } catch (err: any) {
      toast.error(err.response?.data?.detail || "Something went wrong");
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    if (editItem) {
      setForm({ name: editItem.name, description: editItem.description ?? "" });
      setFormErrors({});
    } else {
      setForm(emptyForm);
      setFormErrors({});
    }
  }, [editItem]);

  return (
    <Modal open={open} title={editItem ? "Edit Supplier" : "Add Supplier"} onClose={() => closeModal()}>
      <FormInput
        label="Supplier Name"
        value={form.name}
        onChange={(val) => setForm({ ...form, name: val })}
        placeholder="e.g. Hardware Shop"
        required
        error={formErrors.name}
      />
      <FormInput
        label="Description"
        value={form.description}
        onChange={(val) => setForm({ ...form, description: val })}
        placeholder="Brief description (optional)"
      />

      <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", marginTop: 8 }}>
        <button
          onClick={() => closeModal()}
          style={{ padding: "8px 18px", fontSize: 14, border: "1px solid #e2e8f0", borderRadius: 8, background: "white", color: "#475569", cursor: "pointer" }}
          disabled={saving}
        >
          Cancel
        </button>
        <button
          onClick={handleSave}
          disabled={saving}
          style={{ padding: "8px 18px", fontSize: 14, border: "none", borderRadius: 8, background: saving ? "#93c5fd" : "#2563eb", color: "white", cursor: saving ? "not-allowed" : "pointer", fontWeight: 500 }}
        >
          {saving ? "Saving..." : isEditMode ? "Update" : "Create"}
        </button>
      </div>
    </Modal>
  );
}

export default SuppliersAddEdit;
