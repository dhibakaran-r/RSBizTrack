import { useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchCurrentUser } from "@/store/slices/authSlice";

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
  const { user, loading } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token && !user) {
      dispatch(fetchCurrentUser());
    }
  }, []);

  if (loading) {
    return (
      <div style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "var(--color-primary-600)",
        fontSize: 14,
      }}>
        Loading...
      </div>
    );
  }

  const token = localStorage.getItem("token");
  if (!token) return <Navigate to="/login" replace />;
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
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

export default AppRoutes;