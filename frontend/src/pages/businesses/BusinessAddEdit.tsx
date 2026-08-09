import { createBusiness, updateBusiness } from "@/api/modules/businessApi";
import FormInput from "@/components/common/FormInput";
import Modal from "@/components/common/Modal";
import type { BusinessCreate, BusinessUpdate } from "@/types/business";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";

interface ConfirmDialogProps {
  open: boolean;
  editItem?: { id?: number; name: string; description?: string | null } | null;
  closeModal: () => void;
  onSuccess: () => void;
}

const emptyForm = { name: "", description: "" };

function BusinessAddEdit({
  open,
  editItem,
  closeModal,
  onSuccess
}: ConfirmDialogProps) {
  const [form, setForm] = useState(emptyForm);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const [saving, setSaving] = useState(false);

  const isEditMode = !!editItem;

    // ── Form validation ──
  const validate = (): boolean => {
    const errors: Record<string, string> = {};
    if (!form.name.trim()) {
      errors.name = "Business name is required";
    }
    setFormErrors(errors);
    // Returns true if no errors
    return Object.keys(errors).length === 0;
  };


  // ── Save (Create or Update) ──
  const handleSave = async () => {
    // Validate first
    if (!validate()) return;

    try {
      setSaving(true);

      if (isEditMode && editItem) {
        // Update existing
        const payload: BusinessUpdate = {
          name: form.name.trim(),
          description: form.description.trim() || undefined,
        };
        const response = await updateBusiness(editItem.id, payload);
        if(response.success) {
          console.log("edit response: ", JSON.stringify(response));
          toast.success(response.message || "Business updated successfully!");
          onSuccess();
          closeModal();
        }
      } else {
        // Create new
        const payload: BusinessCreate = {
          name: form.name.trim(),
          description: form.description.trim() || undefined,
        };
        const response = await createBusiness(payload);
        if(response.success) {
          console.log("create response: ", JSON.stringify(response));
          toast.success(response.message || "Business created successfully!");
          onSuccess();
          closeModal();
        }
      }
    } catch (err: any) {
      toast.error(err.response?.data?.detail || "Something went wrong");
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    if(editItem) {
      setForm({
        name: editItem.name,
        description: editItem.description ?? "",
      });
      setFormErrors({});
    } else {
        setForm(emptyForm);
        setFormErrors({});
    }
  }, [editItem]);

  return (
    <Modal
      open={open}
      title={editItem ? "Edit Business" : "Add Business"}
      onClose={() => closeModal()}
    >
      <FormInput
        label="Business Name"
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

      {/* Modal actions */}
      <div
        style={{
          display: "flex",
          gap: 10,
          justifyContent: "flex-end",
          marginTop: 8,
        }}
      >
        <button
          onClick={() => closeModal()}
          style={{
            padding: "8px 18px",
            fontSize: 14,
            border: "1px solid #e2e8f0",
            borderRadius: 8,
            background: "white",
            color: "#475569",
            cursor: "pointer",
          }}
          disabled={saving}
        >
          Cancel
        </button>
        <button
          onClick={handleSave}
          disabled={saving}
          style={{
            padding: "8px 18px",
            fontSize: 14,
            border: "none",
            borderRadius: 8,
            background: saving ? "#93c5fd" : "#2563eb",
            color: "white",
            cursor: saving ? "not-allowed" : "pointer",
            fontWeight: 500,
          }}
        >
          {saving ? "Saving..." : isEditMode ? "Update" : "Create"}
        </button>
      </div>
    </Modal>
  );
}

export default BusinessAddEdit;
