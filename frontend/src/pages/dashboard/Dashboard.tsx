import { useEffect, useState } from "react";
import {
  Building2, Package, Truck, Tag,
  AlertTriangle, TrendingUp, Clock, ArrowRight
} from "lucide-react";
import {
  getDashboardStats,
  getRecentProducts,
  getLowStockProducts,
} from "@/api/modules/dashboardApi";
import type {
  DashboardStats,
  RecentProduct,
  LowStockProduct,
} from "@/types/dashboard";
import { useAppSelector } from "@/store/hooks";

// ── Stat Card Component ──
interface StatCardProps {
  label: string;
  value: number;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
  suffix?: string;
}

const StatCard = ({
  label, value, icon, color, bgColor, suffix
}: StatCardProps) => (
  <div style={{
    background: "white",
    borderRadius: 12,
    border: "1px solid #e2e8f0",
    padding: "20px 24px",
    display: "flex",
    alignItems: "center",
    gap: 16,
    boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
    flex: 1,
    minWidth: 0,
  }}>
    {/* Icon */}
    <div style={{
      width: 48,
      height: 48,
      borderRadius: 12,
      background: bgColor,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      flexShrink: 0,
      color: color,
    }}>
      {icon}
    </div>

    {/* Text */}
    <div>
      <div style={{
        fontSize: 26,
        fontWeight: 700,
        color: "#1e293b",
        lineHeight: 1,
        marginBottom: 4,
      }}>
        {value}
        {suffix && (
          <span style={{ fontSize: 14, fontWeight: 400, color: "#94a3b8", marginLeft: 4 }}>
            {suffix}
          </span>
        )}
      </div>
      <div style={{ fontSize: 13, color: "#64748b" }}>
        {label}
      </div>
    </div>
  </div>
);

// ── Section Header Component ──
const SectionHeader = ({
  title, icon, count
}: { title: string; icon: React.ReactNode; count?: number }) => (
  <div style={{
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  }}>
    <div style={{
      display: "flex",
      alignItems: "center",
      gap: 8,
      fontSize: 15,
      fontWeight: 600,
      color: "#1e293b",
    }}>
      {icon}
      {title}
      {count !== undefined && (
        <span style={{
          background: "#f1f5f9",
          color: "#64748b",
          fontSize: 12,
          fontWeight: 500,
          padding: "2px 8px",
          borderRadius: 99,
        }}>
          {count}
        </span>
      )}
    </div>
  </div>
);

// ── Loading Skeleton ──
const Skeleton = ({ width = "100%", height = 16 }: { width?: string | number; height?: number }) => (
  <div style={{
    width,
    height,
    background: "linear-gradient(90deg, #f1f5f9 25%, #e2e8f0 50%, #f1f5f9 75%)",
    backgroundSize: "200% 100%",
    borderRadius: 6,
    animation: "shimmer 1.4s infinite",
  }} />
);

// ── Main Dashboard ──
const Dashboard = () => {
  const user = useAppSelector((state) => state.auth.user);

  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentProducts, setRecentProducts] = useState<RecentProduct[]>([]);
  const [lowStock, setLowStock] = useState<LowStockProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [statsData, recentData, lowStockData] = await Promise.all([
          getDashboardStats(),
          getRecentProducts(),
          getLowStockProducts(),
        ]);
        setStats(statsData);
        setRecentProducts(recentData);
        setLowStock(lowStockData);
      } catch (err) {
        console.error("Dashboard fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, []);

  const statCards = stats ? [
    {
      label: "Total Businesses",
      value: stats.total_businesses,
      icon: <Building2 size={22} />,
      color: "#2563eb",
      bgColor: "#eff6ff",
    },
    {
      label: "Total Products",
      value: stats.total_products,
      icon: <Package size={22} />,
      color: "#059669",
      bgColor: "#ecfdf5",
    },
    {
      label: "Total Suppliers",
      value: stats.total_suppliers,
      icon: <Truck size={22} />,
      color: "#7c3aed",
      bgColor: "#f5f3ff",
    },
    {
      label: "Categories",
      value: stats.total_categories,
      icon: <Tag size={22} />,
      color: "#d97706",
      bgColor: "#fffbeb",
    },
    {
      label: "Low Stock Alerts",
      value: stats.low_stock_count,
      icon: <AlertTriangle size={22} />,
      color: "#dc2626",
      bgColor: "#fef2f2",
      suffix: "items",
    },
  ] : [];

  return (
    <div>
      {/* Shimmer animation */}
      <style>{`
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
      `}</style>

      {/* ── Header ── */}
      <div style={{ marginBottom: 24 }}>
        <h1 style={{
          fontSize: 22,
          fontWeight: 700,
          color: "#1e293b",
          marginBottom: 4,
        }}>
          Welcome back, {user?.name?.split(" ")[0]} 👋
        </h1>
        <p style={{ fontSize: 13, color: "#94a3b8" }}>
          Here's what's happening with your business today.
        </p>
      </div>

      {/* ── Stat Cards ── */}
      <div style={{
        display: "flex",
        gap: 16,
        marginBottom: 24,
        flexWrap: "wrap",
      }}>
        {loading ? (
          Array.from({ length: 5 }).map((_, i) => (
            <div key={i} style={{
              flex: 1,
              minWidth: 160,
              background: "white",
              borderRadius: 12,
              border: "1px solid #e2e8f0",
              padding: "20px 24px",
              display: "flex",
              gap: 16,
              alignItems: "center",
            }}>
              <div style={{
                width: 48, height: 48,
                borderRadius: 12,
                background: "#f1f5f9",
              }} />
              <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 8 }}>
                <Skeleton height={24} width="60%" />
                <Skeleton height={12} width="80%" />
              </div>
            </div>
          ))
        ) : (
          statCards.map((card, i) => (
            <StatCard key={i} {...card} />
          ))
        )}
      </div>

      {/* ── Bottom Section ── */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: 20,
      }}>

        {/* Recent Products */}
        <div style={{
          background: "white",
          borderRadius: 12,
          border: "1px solid #e2e8f0",
          padding: 20,
          boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
        }}>
          <SectionHeader
            title="Recent Products"
            icon={<Clock size={16} color="#2563eb" />}
            count={recentProducts.length}
          />

          {loading ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} style={{ display: "flex", justifyContent: "space-between" }}>
                  <Skeleton width="60%" />
                  <Skeleton width="20%" />
                </div>
              ))}
            </div>
          ) : recentProducts.length === 0 ? (
            <div style={{
              textAlign: "center",
              padding: "32px 0",
              color: "#94a3b8",
              fontSize: 13,
            }}>
              No products found
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
              {recentProducts.map((product, i) => (
                <div key={product.id} style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "10px 12px",
                  borderRadius: 8,
                  background: i % 2 === 0 ? "#f8fafc" : "white",
                }}>
                  <div style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    minWidth: 0,
                  }}>
                    <div style={{
                      width: 8,
                      height: 8,
                      borderRadius: "50%",
                      background: "#2563eb",
                      flexShrink: 0,
                    }} />
                    <span style={{
                      fontSize: 13,
                      color: "#1e293b",
                      fontWeight: 500,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}>
                      {product.name}
                    </span>
                  </div>
                  <span style={{
                    fontSize: 13,
                    color: "#059669",
                    fontWeight: 600,
                    flexShrink: 0,
                    marginLeft: 8,
                  }}>
                    ₹{product.selling_price.toLocaleString("en-IN")}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Low Stock Alert */}
        <div style={{
          background: "white",
          borderRadius: 12,
          border: "1px solid #e2e8f0",
          padding: 20,
          boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
        }}>
          <SectionHeader
            title="Low Stock Alert"
            icon={<AlertTriangle size={16} color="#dc2626" />}
            count={lowStock.length}
          />

          {loading ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} style={{ display: "flex", justifyContent: "space-between" }}>
                  <Skeleton width="50%" />
                  <Skeleton width="25%" />
                </div>
              ))}
            </div>
          ) : lowStock.length === 0 ? (
            <div style={{
              textAlign: "center",
              padding: "32px 0",
              color: "#94a3b8",
              fontSize: 13,
            }}>
              <TrendingUp size={32} color="#10b981" style={{ margin: "0 auto 8px" }} />
              All stock levels are healthy!
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
              {lowStock.map((item, i) => (
                <div key={item.id} style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "10px 12px",
                  borderRadius: 8,
                  background: i % 2 === 0 ? "#fff8f8" : "white",
                }}>
                  <div style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    minWidth: 0,
                  }}>
                    <div style={{
                      width: 8,
                      height: 8,
                      borderRadius: "50%",
                      background: "#dc2626",
                      flexShrink: 0,
                    }} />
                    <span style={{
                      fontSize: 13,
                      color: "#1e293b",
                      fontWeight: 500,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}>
                      {item.name}
                    </span>
                  </div>
                  <div style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    flexShrink: 0,
                    marginLeft: 8,
                  }}>
                    <span style={{
                      fontSize: 12,
                      color: "#dc2626",
                      fontWeight: 600,
                    }}>
                      {item.current_stock} / {item.min_stock}
                    </span>
                    <span style={{
                      background: "#fee2e2",
                      color: "#dc2626",
                      fontSize: 11,
                      fontWeight: 500,
                      padding: "2px 7px",
                      borderRadius: 99,
                    }}>
                      -{item.shortage}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;