import { NavLink } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { getIcon } from "@/utils/iconMap";
import type { MenuResponse } from "@/types/menu";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { toggleSidebar } from "@/store/slices/sidebarSlice";

interface SidebarProps {
  menus: MenuResponse[];
}

const Sidebar = ({ menus }: SidebarProps) => {
  const dispatch = useAppDispatch();
  const collapsed = useAppSelector((state) => state.sidebar.collapsed);

  return (
    <aside
      style={{
        width: collapsed ? "var(--sidebar-collapsed)" : "var(--sidebar-width)",
        background: "var(--color-primary-900)",
        position: "fixed",
        left: 0,
        top: 0,
        bottom: 0,
        zIndex: 50,
        display: "flex",
        flexDirection: "column",
        transition: "width 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        overflow: "hidden",
        willChange: "width",
      }}
    >
      {/* ── Logo ── */}
      <div
        style={{
          minHeight: "var(--navbar-height)",
          borderBottom: "1px solid rgba(255,255,255,0.08)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 10px",
          flexShrink: 0,
          gap: 6,
        }}
      >
        {/* Logo wrapper */}
        <div style={{
          display: "flex",
          alignItems: "center",
          overflow: "hidden",
          flex: 1,
          minWidth: 0,
        }}>

          {/* Collapsed — just RS text, no SVG complexity */}
          {collapsed ? (
            <div style={{
              width: 36,
              height: 36,
              borderRadius: 8,
              background: "rgba(255,255,255,0.08)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}>
              <span style={{
                color: "white",
                fontSize: 14,
                fontWeight: 700,
                fontFamily: "-apple-system, sans-serif",
                letterSpacing: 0.5,
              }}>
                RS
              </span>
            </div>
          ) : (
            /* Expanded — RS box + BizTrack name */
            <div style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              overflow: "hidden",
            }}>
              <div style={{
                width: 36,
                height: 36,
                borderRadius: 8,
                background: "rgba(255,255,255,0.08)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}>
                <span style={{
                  color: "white",
                  fontSize: 14,
                  fontWeight: 700,
                  fontFamily: "-apple-system, sans-serif",
                }}>
                  RS
                </span>
              </div>
              <div style={{
                borderLeft: "1px solid rgba(96,165,250,0.3)",
                paddingLeft: 10,
                whiteSpace: "nowrap",
              }}>
                <span style={{
                  color: "white",
                  fontSize: 16,
                  fontWeight: 300,
                  fontFamily: "-apple-system, sans-serif",
                }}>
                  Biz<strong style={{ fontWeight: 700 }}>Track</strong>
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Toggle button — always visible */}
        <button
          className="toggle-btn"
          onClick={() => dispatch(toggleSidebar())}
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed
            ? <ChevronRight size={13} />
            : <ChevronLeft size={13} />
          }
        </button>
      </div>

      {/* ── Nav ── */}
      <nav style={{
        flex: 1,
        padding: "10px 8px",
        display: "flex",
        flexDirection: "column",
        gap: 2,
        overflowY: "auto",
        overflowX: "hidden",
      }}>
        {menus.map((menu) => {
          const Icon = getIcon(menu.icon);
          return (
            <NavLink
              key={menu.id}
              to={menu.path}
              end={menu.path === "/"}
              title={collapsed ? menu.label : undefined}
              className={({ isActive }) =>
                `nav-item${isActive ? " active" : ""}`
              }
              style={{
                padding: collapsed ? "10px 0" : "9px 12px",
                justifyContent: collapsed ? "center" : "flex-start",
                gap: collapsed ? 0 : 10,
              }}
            >
              <Icon size={19} style={{ flexShrink: 0 }} />
              {!collapsed && (
                <span style={{ whiteSpace: "nowrap" }}>
                  {menu.label}
                </span>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* ── Footer ── */}
      <div style={{
        borderTop: "1px solid rgba(255,255,255,0.08)",
        padding: "12px 10px",
        color: "rgba(255,255,255,0.2)",
        fontSize: 10,
        textAlign: collapsed ? "center" : "left",
        whiteSpace: "nowrap",
        overflow: "hidden",
        flexShrink: 0,
      }}>
        {collapsed ? "v1" : "RSBizTrack v1.0"}
      </div>
    </aside>
  );
};

export default Sidebar;