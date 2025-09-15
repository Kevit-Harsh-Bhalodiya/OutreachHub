import { selectIsAdmin } from "@/redux/slices/authSlice";
import type { RootState } from "@/redux/store";
import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

export default function RequireAdmin() {
  const isAdmin = useSelector<RootState, boolean>(selectIsAdmin);
  return isAdmin ? <Outlet /> : <Navigate to="/" replace />;
}

