import { LogOut, Bell, User } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { logout } from "@/store/slices/authSlice";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { user } = useAppSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  return (
    <header
      className="flex items-center justify-between px-6 sticky top-0 z-40 bg-white"
      style={{
        height: "var(--navbar-height)",
        borderBottom: "1px solid var(--color-gray-200)",
        boxShadow: "var(--shadow-sm)",
      }}
    >
      <div />

      <div className="flex items-center gap-3">
        <button
          className="flex items-center justify-center rounded-lg p-2 cursor-pointer"
          style={{
            background: "none",
            border: "none",
            color: "var(--color-gray-600)",
          }}
        >
          <Bell size={18} />
        </button>

        <div
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg"
          style={{
            background: "var(--color-gray-100)",
            fontSize: 13,
          }}
        >
          <User size={16} style={{ color: "var(--color-primary-600)" }} />
          <span style={{ color: "var(--color-gray-800)", fontWeight: 500 }}>
            {user?.name}
          </span>
          <span
            className="px-2 py-0.5 rounded-full text-xs font-medium"
            style={{
              background: user?.role === "admin"
                ? "var(--color-primary-100)"
                : "var(--color-gray-200)",
              color: user?.role === "admin"
                ? "var(--color-primary-700)"
                : "var(--color-gray-600)",
            }}
          >
            {user?.role}
          </span>
        </div>

        <button
          onClick={handleLogout}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg cursor-pointer text-sm"
          style={{
            background: "none",
            border: "1px solid var(--color-gray-200)",
            color: "var(--color-gray-600)",
          }}
        >
          <LogOut size={15} />
          Logout
        </button>
      </div>
    </header>
  );
};

export default Navbar;