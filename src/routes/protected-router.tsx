// src/routes/protectedRoutes.tsx
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "@/context/auth";

export function AuthenticatedRoute() {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  // Show loading state while checking authentication
  if (isLoading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If authenticated, render the child routes
  return <Outlet />;
}

export function AdminRoute() {
  const { isAuthenticated, isAdmin, isLoading } = useAuth();
  const location = useLocation();

  // Show loading state while checking authentication
  if (isLoading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  // Redirect to login if not authenticated at all
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Redirect to unauthorized page if authenticated but not admin
  if (!isAdmin) {
    return <Navigate to="/unauthorized" replace />;
  }

  // If admin, render the child routes
  return <Outlet />;
}