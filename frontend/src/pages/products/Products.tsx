import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Building2 } from "lucide-react";

// Components
import PageHeader from "@/components/common/PageHeader";
import SearchBar from "@/components/common/SearchBar";
import DataTable from "@/components/common/DataTable";
import type { Column } from "@/components/common/DataTable";
import ProductsAddEdit from "./ProductsAddEdit";
import Badge from "@/components/common/Badge";
import ConfirmDialog from "@/components/common/ConfirmDialog";

// API + Types
import {
  getAllProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} from "@/api/modules/productApi";
import type { Product, ProductCreate, ProductUpdate } from "@/types/product";

  
const emptyForm = { name: "", description: "" };

const Products = () => {
  // ── State ──
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [editItem, setEditItem] = useState<Product | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

  // Delete state
  const [deleteItem, setDeleteItem] = useState<Product | null>(null);
  const [deleting, setDeleting] = useState(false);

  // Pagination state
  const [page, setPage] = useState(1);
  const pageSize = 10;

  // ── Fetch all products ──
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const data = await getAllProducts();
      setProducts(data);
    } catch (err) {
      toast.error("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  // Fetch on mount
  useEffect(() => {
    fetchProducts();
  }, []);

  // ── Search filter ──
  // Filter products based on search input — client side
  const filtered = products.filter((b) =>
    b.name.toLowerCase().includes(search.toLowerCase()) ||
    (b.description ?? "").toLowerCase().includes(search.toLowerCase())
  );

  // Paginate filtered results
  const paginated = filtered.slice((page - 1) * pageSize, page * pageSize);

  // ── Table columns definition ──
  const columns: Column<Product>[] = [
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
  const handleEdit = (product: Product) => {
    setEditItem(product);
    setForm({
      name: product.name,
      description: product.description ?? "",
    });
    setFormErrors({});
    setModalOpen(true);
  };

  // ── Open Delete confirm ──
  const handleDeleteClick = (product: Product) => {
    setDeleteItem(product);
  };

  // ── Form validation ──
  const validate = (): boolean => {
    const errors: Record<string, string> = {};
    if (!form.name.trim()) {
      errors.name = "Product name is required";
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
        const payload: ProductUpdate = {
          name: form.name.trim(),
          description: form.description.trim() || undefined,
        };
        await updateProduct(editItem.id, payload);
        toast.success("Product updated successfully!");
      } else {
        // Create new
        const payload: ProductCreate = {
          name: form.name.trim(),
          description: form.description.trim() || undefined,
        };
        await createProduct(payload);
        toast.success("Product created successfully!");
      }

      // Close modal + refresh list
      setModalOpen(false);
      fetchProducts();
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
      await deleteProduct(deleteItem.id);
      toast.success("Product deleted successfully!");
      setDeleteItem(null);
      fetchProducts();
    } catch (err: any) {
      toast.error(
        err.response?.data?.detail || "Failed to delete product"
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
        title="Products"
        subtitle="Manage your product verticals"
        onAdd={handleAdd}
        addLabel="Add Product"
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
          placeholder="Search products..."
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
            {loading ? "..." : `${filtered.length} products`}
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
        emptyMessage="No products found. Add your first product!"
        page={page}
        pageSize={pageSize}
        total={filtered.length}
        onPageChange={setPage}
      />

      {modalOpen && (
        <ProductsAddEdit
          open={modalOpen}
          editItem={editItem}
          closeModal={() => setModalOpen(false)}
          onSuccess={fetchProducts}
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

export default Products;