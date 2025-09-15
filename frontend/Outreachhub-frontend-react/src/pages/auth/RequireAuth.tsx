import { selectIsLoggedIn } from "@/redux/slices/authSlice";
import type { RootState } from "@/redux/store";
import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

export default function RequireAuth() {
  const isLoggedIn = useSelector<RootState, boolean>(selectIsLoggedIn);
  return isLoggedIn ? <Outlet /> : <Navigate to="/login" replace />;
}

