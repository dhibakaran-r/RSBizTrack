import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { BarChart3 } from "lucide-react";
import PageHeader from "@/components/common/PageHeader";
import SearchBar from "@/components/common/SearchBar";
import DataTable from "@/components/common/DataTable";
import type { Column } from "@/components/common/DataTable";
import StockAddEdit from "./StockAddEdit";
import FormInput from "@/components/common/FormInput";
import Badge from "@/components/common/Badge";
import { getAllStocks, updateStock } from "@/api/modules/stockApi";
import type { StockWithProduct, StockUpdate } from "@/types/stock";

const Stock = () => {
  const [stocks, setStocks] = useState<StockWithProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 10;

  // Edit modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [editItem, setEditItem] = useState<StockWithProduct | null>(null);
  const [quantity, setQuantity] = useState("");
  const [saving, setSaving] = useState(false);

  // Fetch all stocks
  const fetchStocks = async () => {
    try {
      setLoading(true);
      const data = await getAllStocks();
      setStocks(data);
    } catch {
      toast.error("Failed to load stocks");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStocks();
  }, []);

  // Search filter
  const filtered = stocks.filter((s) =>
    s.product_name.toLowerCase().includes(search.toLowerCase())
  );

  const paginated = filtered.slice(
    (page - 1) * pageSize,
    page * pageSize
  );

  // Table columns
  const columns: Column<StockWithProduct>[] = [
    {
      header: "Product Name",
      accessor: "product_name",
    },
    {
      header: "Current Stock",
      accessor: (row) => (
        <span style={{ fontWeight: 600, color: "#1e293b" }}>
          {row.quantity}
        </span>
      ),
      width: 140,
    },
    {
      header: "Status",
      accessor: (row) => (
        <Badge
          label={row.quantity === 0 ? "Out of Stock" : row.quantity < 10 ? "Low Stock" : "In Stock"}
          type={row.quantity === 0 ? "danger" : row.quantity < 10 ? "warning" : "success"}
        />
      ),
      width: 120,
    },
    {
      header: "Last Updated",
      accessor: (row) =>
        new Date(row.last_updated).toLocaleDateString("en-IN", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        }),
      width: 140,
    },
  ];

  // Open edit modal
  const handleEdit = (stock: StockWithProduct) => {
    setEditItem(stock);
    setQuantity(String(stock.quantity));
    setModalOpen(true);
  };

  // Save updated quantity
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
      setModalOpen(false);
      fetchStocks();
    } catch {
      toast.error("Failed to update stock");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <PageHeader
        title="Stock Management"
        subtitle="Track and update inventory levels"
      />

      {/* Search + count */}
      <div style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 16,
        flexWrap: "wrap",
        gap: 12,
      }}>
        <SearchBar
          value={search}
          onChange={(val) => { setSearch(val); setPage(1); }}
          placeholder="Search by product name..."
        />
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: 6,
          fontSize: 13,
          color: "#64748b",
        }}>
          <BarChart3 size={15} />
          {loading ? "..." : `${filtered.length} products`}
        </div>
      </div>

      {/* Table — no delete, only edit */}
      <DataTable
        columns={columns}
        data={paginated}
        loading={loading}
        onEdit={handleEdit}
        emptyMessage="No stock records found"
        page={page}
        pageSize={pageSize}
        total={filtered.length}
        onPageChange={setPage}
      />

      {modalOpen && (
        <StockAddEdit
          open={modalOpen}
          editItem={editItem}
          closeModal={() => setModalOpen(false)}
          onSuccess={fetchStocks}
        />
      )}
    </div>
  );
};

export default Stock;