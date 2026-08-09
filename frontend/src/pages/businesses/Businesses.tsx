import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Building2 } from "lucide-react";

// Components
import PageHeader from "@/components/common/PageHeader";
import SearchBar from "@/components/common/SearchBar";
import DataTable from "@/components/common/DataTable";
import type { Column } from "@/components/common/DataTable";
import Badge from "@/components/common/Badge";
import ConfirmDialog from "@/components/common/ConfirmDialog";

// API + Types
import {
  getAllBusinesses,
  deleteBusiness,
} from "@/api/modules/businessApi";
import type { Business } from "@/types/business";
import BusinessAddEdit from "./BusinessAddEdit";
import { useDateTime } from "@/hooks/formatDateTime";

const Businesses = () => {
  // ── State ──
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [editItem, setEditItem] = useState<Business | null>(null);


  // Delete state
  const [deleteItem, setDeleteItem] = useState<Business | null>(null);
  const [deleting, setDeleting] = useState(false);

  // Pagination state
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const { formatDate, formatDateTime } = useDateTime();

  // ── Fetch all businesses ──
  const fetchBusinesses = async () => {
    try {
      setLoading(true);
      const response = await getAllBusinesses();
      setBusinesses(response.data || []);
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
          label={row.isActive ? "Active" : "Inactive"}
          type={row.isActive ? "success" : "danger"}
        />
      ),
      width: 100,
    },
    {
      header: "Created",
      accessor: (row) =>(
        formatDate(row.createdAt)
      ),
        // new Date(row.created_at).toLocaleDateString("en-IN", {
        //   day: "2-digit",
        //   month: "short",
        //   year: "numeric",
        // }),
      width: 130,
    },
  ];

  // ── Open Add modal ──
  const handleAdd = () => {
    setEditItem(null);
    setModalOpen(true);
  };

  // ── Open Edit modal ──
  const handleEdit = (business: Business) => {
    setEditItem(business);
    setModalOpen(true);
  };

  // ── Open Delete confirm ──
  const handleDeleteClick = (business: Business) => {
    setDeleteItem(business);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setEditItem(null);
  }


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
      { modalOpen && (
        <BusinessAddEdit
          open={modalOpen}
          editItem={editItem}
          closeModal={handleCloseModal}
          onSuccess={fetchBusinesses}
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

export default Businesses;