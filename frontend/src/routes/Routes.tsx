import { useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { RefreshCw, ShieldAlert } from "lucide-react";

import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchCurrentUser, markAuthChecked } from "@/store/slices/authSlice";

import MainLayout from "@/components/layout/MainLayout";
import Login from "@/pages/auth/Login";
import Dashboard from "@/pages/dashboard/Dashboard";

import Businesses from "@/pages/businesses/Businesses";
import Products from "@/pages/products/Products";
import Categories from "@/pages/categories/Categories";
import Units from "@/pages/units/Units";
import Suppliers from "@/pages/suppliers/Suppliers";
import Stock from "@/pages/stock/Stock";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const dispatch = useAppDispatch();

  const { user, loading, authChecked, error } = useAppSelector(
    (state) => state.auth,
  );

  useEffect(() => {
    if (authChecked) return;

    const token = localStorage.getItem("token");

    if (!token) {
      dispatch(markAuthChecked());
      return;
    }

    if (!user) {
      dispatch(fetchCurrentUser());
    }
  }, [dispatch, authChecked, user]);

  // Initial authentication check
  if (!authChecked || loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <RefreshCw className="h-4 w-4 animate-spin text-blue-600" />
          Checking your session...
        </div>
      </div>
    );
  }

  // Temporary verification failure
  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
        <div className="w-full max-w-md rounded-2xl border border-gray-100 bg-white p-8 text-center shadow-sm">
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-amber-50">
            <ShieldAlert className="h-8 w-8 text-amber-600" />
          </div>

          <h2 className="text-xl font-semibold text-gray-900">
            Unable to verify your session
          </h2>

          <p className="mt-3 text-sm leading-6 text-gray-500">{error}</p>

          <button
            type="button"
            onClick={() => dispatch(fetchCurrentUser())}
            disabled={loading}
            className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-3 text-sm font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            {loading ? "Verifying..." : "Try again"}
          </button>

          <p className="mt-4 text-xs text-gray-400">
            Your session information has been preserved.
          </p>
        </div>
      </div>
    );
  }

  // Unauthenticated user
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      <Route
        path="/"
        element={
          <ProtectedRoute>
            <MainLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="businesses" element={<Businesses />} />
        <Route path="products" element={<Products />} />
        <Route path="categories" element={<Categories />} />
        <Route path="units" element={<Units />} />
        <Route path="suppliers" element={<Suppliers />} />
        <Route path="stock" element={<Stock />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;
