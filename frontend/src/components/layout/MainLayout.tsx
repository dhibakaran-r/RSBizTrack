import { useEffect } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import { getMyMenus } from "@/api/modules/menuApi";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setMenus } from "@/store/slices/menuSlice";

const MainLayout = () => {
  const dispatch = useAppDispatch();
  const collapsed = useAppSelector((state) => state.sidebar.collapsed);
  const menus = useAppSelector((state) => state.menu.menus);

  useEffect(() => {
    getMyMenus().then((data) => dispatch(setMenus(data))).catch(console.error);
  }, []);

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <Sidebar menus={menus} />
      <div
        className="main-content"
        style={{
          marginLeft: collapsed
            ? "var(--sidebar-collapsed)"
            : "var(--sidebar-width)",
          flex: 1,
          display: "flex",
          flexDirection: "column",
          minHeight: "100vh",
          willChange: "margin-left",
        }}
      >
        <Navbar />
        <main
          style={{
            flex: 1,
            padding: "24px",
            background: "var(--color-gray-50)",
          }}
        >
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default MainLayout;