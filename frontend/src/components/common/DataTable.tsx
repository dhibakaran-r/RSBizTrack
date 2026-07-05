import { Pencil, Trash2, ChevronLeft, ChevronRight } from "lucide-react";

// Column definition
export interface Column<T> {
  header: string;
  accessor: keyof T | ((row: T) => React.ReactNode);
  width?: number;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  onEdit?: (row: T) => void;
  onDelete?: (row: T) => void;
  loading?: boolean;
  emptyMessage?: string;
  // Pagination
  page?: number;
  pageSize?: number;
  total?: number;
  onPageChange?: (page: number) => void;
}

function DataTable<T extends { id: number }>({
  columns,
  data,
  onEdit,
  onDelete,
  loading,
  emptyMessage = "No data found",
  page = 1,
  pageSize = 10,
  total = 0,
  onPageChange,
}: DataTableProps<T>) {
  const totalPages = Math.ceil(total / pageSize);
  const showActions = onEdit || onDelete;

  
    
  return (
    <div style={{
      background: "white",
      borderRadius: 12,
      border: "1px solid #e2e8f0",
      overflow: "hidden",
      boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
    }}>
      {/* Table */}
      <div style={{ overflowX: "auto" }}>
        <table style={{
          width: "100%",
          borderCollapse: "collapse",
          fontSize: 13,
        }}>
          {/* Header */}
          <thead>
            <tr style={{ background: "#f8fafc" }}>
              {columns.map((col, i) => (
                <th key={i} style={{
                  padding: "11px 16px",
                  textAlign: "left",
                  fontWeight: 600,
                  color: "#475569",
                  fontSize: 12,
                  letterSpacing: 0.3,
                  borderBottom: "1px solid #e2e8f0",
                  whiteSpace: "nowrap",
                  width: col.width,
                }}>
                  {col.header.toUpperCase()}
                </th>
              ))}
              {showActions && (
                <th style={{
                  padding: "11px 16px",
                  textAlign: "right",
                  fontWeight: 600,
                  color: "#475569",
                  fontSize: 12,
                  letterSpacing: 0.3,
                  borderBottom: "1px solid #e2e8f0",
                  width: 100,
                }}>
                  ACTIONS
                </th>
              )}
            </tr>
          </thead>

          {/* Body */}
          <tbody>
            {loading ? (
              // Loading skeleton rows
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={i}>
                  {columns.map((_, j) => (
                    <td key={j} style={{ padding: "12px 16px" }}>
                      <div style={{
                        height: 14,
                        borderRadius: 4,
                        background: "linear-gradient(90deg, #f1f5f9 25%, #e2e8f0 50%, #f1f5f9 75%)",
                        backgroundSize: "200% 100%",
                        animation: "shimmer 1.4s infinite",
                        width: `${60 + Math.random() * 30}%`,
                      }} />
                    </td>
                  ))}
                  {showActions && <td style={{ padding: "12px 16px" }} />}
                </tr>
              ))
            ) : data.length === 0 ? (
              // Empty state
              <tr>
                <td
                  colSpan={columns.length + (showActions ? 1 : 0)}
                  style={{
                    padding: "48px 16px",
                    textAlign: "center",
                    color: "#94a3b8",
                    fontSize: 13,
                  }}
                >
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              // Data rows
              data.map((row, i) => (
                <tr
                  key={row.id}
                  style={{
                    background: i % 2 === 0 ? "white" : "#f8fafc",
                    transition: "background 0.1s ease",
                  }}
                  onMouseEnter={e =>
                    (e.currentTarget.style.background = "#eff6ff")
                  }
                  onMouseLeave={e =>
                    (e.currentTarget.style.background =
                      i % 2 === 0 ? "white" : "#f8fafc")
                  }
                >
                  {columns.map((col, j) => (
                    <td key={j} style={{
                      padding: "11px 16px",
                      color: "#1e293b",
                      borderBottom: "1px solid #f1f5f9",
                    }}>
                      {typeof col.accessor === "function"
                        ? col.accessor(row)
                        : String(row[col.accessor] ?? "-")}
                    </td>
                  ))}

                  {/* Actions */}
                  {showActions && (
                    <td style={{
                      padding: "11px 16px",
                      textAlign: "right",
                      borderBottom: "1px solid #f1f5f9",
                    }}>
                      <div style={{
                        display: "flex",
                        gap: 6,
                        justifyContent: "flex-end",
                      }}>
                        {onEdit && (
                          <button
                            onClick={() => onEdit(row)}
                            title="Edit"
                            style={{
                              background: "#eff6ff",
                              border: "none",
                              borderRadius: 6,
                              padding: "5px 8px",
                              cursor: "pointer",
                              color: "#2563eb",
                              display: "flex",
                              alignItems: "center",
                            }}
                            onMouseEnter={e =>
                              (e.currentTarget.style.background = "#dbeafe")
                            }
                            onMouseLeave={e =>
                              (e.currentTarget.style.background = "#eff6ff")
                            }
                          >
                            <Pencil size={14} />
                          </button>
                        )}
                        {onDelete && (
                          <button
                            onClick={() => onDelete(row)}
                            title="Delete"
                            style={{
                              background: "#fef2f2",
                              border: "none",
                              borderRadius: 6,
                              padding: "5px 8px",
                              cursor: "pointer",
                              color: "#dc2626",
                              display: "flex",
                              alignItems: "center",
                            }}
                            onMouseEnter={e =>
                              (e.currentTarget.style.background = "#fee2e2")
                            }
                            onMouseLeave={e =>
                              (e.currentTarget.style.background = "#fef2f2")
                            }
                          >
                            <Trash2 size={14} />
                          </button>
                        )}
                      </div>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {onPageChange && total > pageSize && (
        <div style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "12px 16px",
          borderTop: "1px solid #e2e8f0",
          background: "#f8fafc",
        }}>
          <span style={{ fontSize: 12, color: "#64748b" }}>
            Showing {(page - 1) * pageSize + 1} to{" "}
            {Math.min(page * pageSize, total)} of {total} results
          </span>

          <div style={{ display: "flex", gap: 6 }}>
            <button
              onClick={() => onPageChange(page - 1)}
              disabled={page === 1}
              style={{
                background: page === 1 ? "#f1f5f9" : "white",
                border: "1px solid #e2e8f0",
                borderRadius: 6,
                padding: "5px 8px",
                cursor: page === 1 ? "not-allowed" : "pointer",
                color: page === 1 ? "#94a3b8" : "#475569",
                display: "flex",
              }}
            >
              <ChevronLeft size={15} />
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter(p =>
                p === 1 ||
                p === totalPages ||
                Math.abs(p - page) <= 1
              )
              .map((p, i, arr) => (
                <>
                  {i > 0 && arr[i - 1] !== p - 1 && (
                    <span key={`dots-${p}`} style={{
                      padding: "5px 8px",
                      color: "#94a3b8",
                      fontSize: 13,
                    }}>
                      ...
                    </span>
                  )}
                  <button
                    key={p}
                    onClick={() => onPageChange(p)}
                    style={{
                      background: p === page ? "#2563eb" : "white",
                      border: "1px solid #e2e8f0",
                      borderRadius: 6,
                      padding: "5px 10px",
                      cursor: "pointer",
                      color: p === page ? "white" : "#475569",
                      fontSize: 13,
                      fontWeight: p === page ? 600 : 400,
                      minWidth: 32,
                    }}
                  >
                    {p}
                  </button>
                </>
              ))}

            <button
              onClick={() => onPageChange(page + 1)}
              disabled={page === totalPages}
              style={{
                background: page === totalPages ? "#f1f5f9" : "white",
                border: "1px solid #e2e8f0",
                borderRadius: 6,
                padding: "5px 8px",
                cursor: page === totalPages ? "not-allowed" : "pointer",
                color: page === totalPages ? "#94a3b8" : "#475569",
                display: "flex",
              }}
            >
              <ChevronRight size={15} />
            </button>
          </div>
        </div>
      )}

      {/* Shimmer animation */}
      <style>{`
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
      `}</style>
    </div>
  );
}

export default DataTable;