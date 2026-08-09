import { createProduct, updateProduct } from "@/api/modules/productApi";
import FormInput from "@/components/common/FormInput";
import Modal from "@/components/common/Modal";
import type { ProductCreate, ProductUpdate } from "@/types/product";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";

interface Props {
  open: boolean;
  editItem?: { id?: number; name: string; description?: string | null } | null;
  closeModal: () => void;
  onSuccess: () => void;
}

const emptyForm = { name: "", description: "" };

function ProductsAddEdit({ open, editItem, closeModal, onSuccess }: Props) {
  const [form, setForm] = useState(emptyForm);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const [saving, setSaving] = useState(false);

  const isEditMode = !!editItem;

  const validate = (): boolean => {
    const errors: Record<string, string> = {};
    if (!form.name.trim()) {
      errors.name = "Product name is required";
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;

    try {
      setSaving(true);

      if (isEditMode && editItem) {
        const payload: ProductUpdate = {
          name: form.name.trim(),
          description: form.description.trim() || undefined,
        };
        await updateProduct(editItem.id, payload);
        toast.success("Product updated successfully!");
        onSuccess();
        closeModal();
      } else {
        const payload: ProductCreate = {
          name: form.name.trim(),
          description: form.description.trim() || undefined,
        };
        await createProduct(payload);
        toast.success("Product created successfully!");
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
    <Modal open={open} title={editItem ? "Edit Product" : "Add Product"} onClose={() => closeModal()}>
      <FormInput
        label="Product Name"
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

export default ProductsAddEdit;
