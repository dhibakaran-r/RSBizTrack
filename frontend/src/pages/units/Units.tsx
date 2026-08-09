import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Building2 } from "lucide-react";

// Components
import PageHeader from "@/components/common/PageHeader";
import SearchBar from "@/components/common/SearchBar";
import DataTable from "@/components/common/DataTable";
import type { Column } from "@/components/common/DataTable";
import UnitsAddEdit from "./UnitsAddEdit";
import Badge from "@/components/common/Badge";
import ConfirmDialog from "@/components/common/ConfirmDialog";

// API + Types
import {
  getAllUnits,
  createUnit,
  updateUnit,
  deleteUnit,
} from "@/api/modules/unitApi";
import type { Unit, UnitCreate, UnitUpdate } from "@/types/unit";

  
const emptyForm = { name: "", shortName: "" };

const Units = () => {
  // ── State ──
  const [units, setUnits] = useState<Unit[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [editItem, setEditItem] = useState<Unit | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

  // Delete state
  const [deleteItem, setDeleteItem] = useState<Unit | null>(null);
  const [deleting, setDeleting] = useState(false);

  // Pagination state
  const [page, setPage] = useState(1);
  const pageSize = 10;

  // ── Fetch all units ──
  const fetchUnits = async () => {
    try {
      setLoading(true);
      const data = await getAllUnits();
      setUnits(data);
    } catch (err) {
      toast.error("Failed to load units");
    } finally {
      setLoading(false);
    }
  };

  // Fetch on mount
  useEffect(() => {
    fetchUnits();
  }, []);

  // ── Search filter ──
  // Filter units based on search input — client side
  const filtered = units.filter((b) =>
    b.name.toLowerCase().includes(search.toLowerCase()) ||
    (b.shortName ?? "").toLowerCase().includes(search.toLowerCase())
  );

  // Paginate filtered results
  const paginated = filtered.slice((page - 1) * pageSize, page * pageSize);

  // ── Table columns definition ──
  const columns: Column<Unit>[] = [
    {
      header: "Name",
      accessor: "name",
    },
    {
      header: "Short name",
      accessor: (row) => row.shortName || (
        <span style={{ color: "#94a3b8", fontStyle: "italic" }}>
          No shortName
        </span>
      ),
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
  const handleEdit = (unit: Unit) => {
    setEditItem(unit);
    setForm({
      name: unit.name,
      shortName: unit.shortName ?? "",
    });
    setFormErrors({});
    setModalOpen(true);
  };

  // ── Open Delete confirm ──
  const handleDeleteClick = (unit: Unit) => {
    setDeleteItem(unit);
  };

  // ── Form validation ──
  const validate = (): boolean => {
    const errors: Record<string, string> = {};
    if (!form.name.trim()) {
      errors.name = "Unit name is required";
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
        const payload: UnitUpdate = {
          name: form.name.trim(),
          shortName: form.shortName.trim() || undefined,
        };
        await updateUnit(editItem.id, payload);
        toast.success("Unit updated successfully!");
      } else {
        // Create new
        const payload: UnitCreate = {
          name: form.name.trim(),
          shortName: form.shortName.trim() || undefined,
        };
        await createUnit(payload);
        toast.success("Unit created successfully!");
      }

      // Close modal + refresh list
      setModalOpen(false);
      fetchUnits();
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
      await deleteUnit(deleteItem.id);
      toast.success("Unit deleted successfully!");
      setDeleteItem(null);
      fetchUnits();
    } catch (err: any) {
      toast.error(
        err.response?.data?.detail || "Failed to delete unit"
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
        title="Units"
        subtitle="Manage your unit verticals"
        onAdd={handleAdd}
        addLabel="Add Unit"
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
          placeholder="Search units..."
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
            {loading ? "..." : `${filtered.length} units`}
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
        emptyMessage="No units found. Add your first unit!"
        page={page}
        pageSize={pageSize}
        total={filtered.length}
        onPageChange={setPage}
      />

      {modalOpen && (
        <UnitsAddEdit
          open={modalOpen}
          editItem={editItem}
          closeModal={() => setModalOpen(false)}
          onSuccess={fetchUnits}
        />
      )}

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

export default Units;