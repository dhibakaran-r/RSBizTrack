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
  getAllBusinesses,
  createBusiness,
  updateBusiness,
  deleteBusiness,
} from "@/api/modules/businessApi";
import type { Business, BusinessCreate, BusinessUpdate } from "@/types/business";

  
const emptyForm = { name: "", description: "" };

const Businesses = () => {
  // ── State ──
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [editItem, setEditItem] = useState<Business | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

  // Delete state
  const [deleteItem, setDeleteItem] = useState<Business | null>(null);
  const [deleting, setDeleting] = useState(false);

  // Pagination state
  const [page, setPage] = useState(1);
  const pageSize = 10;

  // ── Fetch all businesses ──
  const fetchBusinesses = async () => {
    try {
      setLoading(true);
      const data = await getAllBusinesses();
      setBusinesses(data);
    } catch (err) {
      toast.error("Failed to load businesses");
    } finally {
      setLoading(false);
    }
  };

  // Fetch on mount
  useEffect(() => {
    fetchBusinesses();
  }, []);

  // ── Search filter ──
  // Filter businesses based on search input — client side
  const filtered = businesses.filter((b) =>
    b.name.toLowerCase().includes(search.toLowerCase()) ||
    (b.description ?? "").toLowerCase().includes(search.toLowerCase())
  );

  // Paginate filtered results
  const paginated = filtered.slice((page - 1) * pageSize, page * pageSize);

  // ── Table columns definition ──
  const columns: Column<Business>[] = [
    {
      header: "Name",
      accessor: "name",
    },
    {
      header: "Description",
      accessor: (row) => row.description || (
        <span style={{ color: "#94a3b8", fontStyle: "italic" }}>
          No description
        </span>
      ),
    },
    {
      header: "Status",
      accessor: (row) => (
        <Badge
          label={row.is_active ? "Active" : "Inactive"}
          type={row.is_active ? "success" : "danger"}
        />
      ),
      width: 100,
    },
    {
      header: "Created",
      accessor: (row) =>
        new Date(row.created_at).toLocaleDateString("en-IN", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        }),
      width: 130,
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
  const handleEdit = (business: Business) => {
    setEditItem(business);
    setForm({
      name: business.name,
      description: business.description ?? "",
    });
    setFormErrors({});
    setModalOpen(true);
  };

  // ── Open Delete confirm ──
  const handleDeleteClick = (business: Business) => {
    setDeleteItem(business);
  };

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

      if (editItem) {
        // Update existing
        const payload: BusinessUpdate = {
          name: form.name.trim(),
          description: form.description.trim() || undefined,
        };
        await updateBusiness(editItem.id, payload);
        toast.success("Business updated successfully!");
      } else {
        // Create new
        const payload: BusinessCreate = {
          name: form.name.trim(),
          description: form.description.trim() || undefined,
        };
        await createBusiness(payload);
        toast.success("Business created successfully!");
      }

      // Close modal + refresh list
      setModalOpen(false);
      fetchBusinesses();
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
      await deleteBusiness(deleteItem.id);
      toast.success("Business deleted successfully!");
      setDeleteItem(null);
      fetchBusinesses();
    } catch (err: any) {
      toast.error(
        err.response?.data?.detail || "Failed to delete business"
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
        title="Businesses"
        subtitle="Manage your business verticals"
        onAdd={handleAdd}
        addLabel="Add Business"
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
          placeholder="Search businesses..."
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
            {loading ? "..." : `${filtered.length} businesses`}
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
        emptyMessage="No businesses found. Add your first business!"
        page={page}
        pageSize={pageSize}
        total={filtered.length}
        onPageChange={setPage}
      />

      {/* Add / Edit Modal */}
      <Modal
        open={modalOpen}
        title={editItem ? "Edit Business" : "Add Business"}
        onClose={() => setModalOpen(false)}
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

export default Businesses;