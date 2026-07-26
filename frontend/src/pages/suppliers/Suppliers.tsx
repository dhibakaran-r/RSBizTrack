import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Building2 } from "lucide-react";

// Components
import PageHeader from "@/components/common/PageHeader";
import SearchBar from "@/components/common/SearchBar";
import DataTable from "@/components/common/DataTable";
import type { Column } from "@/components/common/DataTable";
import Modal from "@/components/common/Modal";
import FormInput from "@/components/common/FormInput";
import Badge from "@/components/common/Badge";
import ConfirmDialog from "@/components/common/ConfirmDialog";

// API + Types
import {
  getAllSuppliers,
  createSupplier,
  updateSupplier,
  deleteSupplier,
} from "@/api/modules/supplierAPI";
import type { Supplier, SupplierCreate, SupplierUpdate } from "@/types/suppliers";

  
const emptyForm = { name: "", description: "" };

const Suppliers = () => {
  // ── State ──
  const [supplieres, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [editItem, setEditItem] = useState<Supplier | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

  // Delete state
  const [deleteItem, setDeleteItem] = useState<Supplier | null>(null);
  const [deleting, setDeleting] = useState(false);

  // Pagination state
  const [page, setPage] = useState(1);
  const pageSize = 10;

  // ── Fetch all supplieres ──
  const fetchSuppliers = async () => {
    try {
      setLoading(true);
      const data = await getAllSuppliers();
      setSuppliers(data);
    } catch (err) {
      toast.error("Failed to load supplieres");
    } finally {
      setLoading(false);
    }
  };

  // Fetch on mount
  useEffect(() => {
    fetchSuppliers();
  }, []);

  // ── Search filter ──
  // Filter supplieres based on search input — client side
  const filtered = supplieres.filter((b) =>
    b.name.toLowerCase().includes(search.toLowerCase())
    // (b.description ?? "").toLowerCase().includes(search.toLowerCase())
  );

  // Paginate filtered results
  const paginated = filtered.slice((page - 1) * pageSize, page * pageSize);

  // ── Table columns definition ──
  const columns: Column<Supplier>[] = [
    {
      header: "Name",
      accessor: "name",
    },
    {
      header: "Phone",
      accessor: (row) => row.phone || (
        <span style={{ color: "#94a3b8", fontStyle: "italic" }}>
          No phone
        </span>
      ),
    },
    {
      header: "Email",
      accessor: (row) => row.email || (
        <span style={{ color: "#94a3b8", fontStyle: "italic" }}>
          No email
        </span>
      ),
      width: 100,
    },
    {
      header: "Address",
      accessor: (row) => row.address || (
        <span style={{ color: "#94a3b8", fontStyle: "italic" }}>
          No address
        </span>
      ),
      width: 100,
    },
    {
      header: "GSTIN",
      accessor: (row) => row.gstin || (
        <span style={{ color: "#94a3b8", fontStyle: "italic" }}>
          No GSTIN
        </span>
      ),
      width: 100,
    },
  ];

  // ── Open Add modal ──
  const handleAdd = () => {
    setEditItem(null);
    setForm(emptyForm);
    setFormErrors({});
    setModalOpen(true);
  };

  // ── Open Edit modal ──
  const handleEdit = (supplier: Supplier) => {
    setEditItem(supplier);
    setForm({
      name: supplier.name,
      // description: supplier.description ?? "",
    });
    setFormErrors({});
    setModalOpen(true);
  };

  // ── Open Delete confirm ──
  const handleDeleteClick = (supplier: Supplier) => {
    setDeleteItem(supplier);
  };

  // ── Form validation ──
  const validate = (): boolean => {
    const errors: Record<string, string> = {};
    if (!form.name.trim()) {
      errors.name = "Supplier name is required";
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

      if (editItem) {
        // Update existing
        const payload: SupplierUpdate = {
          name: form.name.trim(),
          // description: form.description.trim() || undefined,
        };
        await updateSupplier(editItem.id, payload);
        toast.success("Supplier updated successfully!");
      } else {
        // Create new
        const payload: SupplierCreate = {
          name: form.name.trim(),
          // description: form.description.trim() || undefined,
        };
        await createSupplier(payload);
        toast.success("Supplier created successfully!");
      }

      // Close modal + refresh list
      setModalOpen(false);
      fetchSuppliers();
    } catch (err: any) {
      toast.error(
        err.response?.data?.detail || "Something went wrong"
      );
    } finally {
      setSaving(false);
    }
  };

  // ── Confirm Delete ──
  const handleDeleteConfirm = async () => {
    if (!deleteItem) return;

    try {
      setDeleting(true);
      await deleteSupplier(deleteItem.id);
      toast.success("Supplier deleted successfully!");
      setDeleteItem(null);
      fetchSuppliers();
    } catch (err: any) {
      toast.error(
        err.response?.data?.detail || "Failed to delete supplier"
      );
    } finally {
      setDeleting(false);
    }
  };

  // ── Render ──
  return (
    <div>
      {/* Page Header */}
      <PageHeader
        title="Suppliers"
        subtitle="Manage your supplier verticals"
        onAdd={handleAdd}
        addLabel="Add Supplier"
      />

      {/* Search + Stats bar */}
      <div style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 16,
        gap: 12,
        flexWrap: "wrap",
      }}>
        <SearchBar
          value={search}
          onChange={(val) => {
            setSearch(val);
            setPage(1); // Reset to page 1 on search
          }}
          placeholder="Search supplieres..."
        />

        {/* Total count */}
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: 6,
          fontSize: 13,
          color: "#64748b",
        }}>
          <Building2 size={15} />
          <span>
            {loading ? "..." : `${filtered.length} supplieres`}
          </span>
        </div>
      </div>

      {/* Data Table */}
      <DataTable
        columns={columns}
        data={paginated}
        loading={loading}
        onEdit={handleEdit}
        onDelete={handleDeleteClick}
        emptyMessage="No supplieres found. Add your first supplier!"
        page={page}
        pageSize={pageSize}
        total={filtered.length}
        onPageChange={setPage}
      />

      {/* Add / Edit Modal */}
      <Modal
        open={modalOpen}
        title={editItem ? "Edit Supplier" : "Add Supplier"}
        onClose={() => setModalOpen(false)}
      >
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

        {/* Modal actions */}
        <div style={{
          display: "flex",
          gap: 10,
          justifyContent: "flex-end",
          marginTop: 8,
        }}>
          <button
            onClick={() => setModalOpen(false)}
            style={{
              padding: "8px 18px",
              fontSize: 14,
              border: "1px solid #e2e8f0",
              borderRadius: 8,
              background: "white",
              color: "#475569",
              cursor: "pointer",
            }}
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
            {saving
              ? "Saving..."
              : editItem
              ? "Update"
              : "Create"
            }
          </button>
        </div>
      </Modal>

      {/* Delete Confirm Dialog */}
      <ConfirmDialog
        open={!!deleteItem}
        message={`Are you sure you want to delete "${deleteItem?.name}"? This action cannot be undone.`}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteItem(null)}
        loading={deleting}
      />
    </div>
  );
};

export default Suppliers;