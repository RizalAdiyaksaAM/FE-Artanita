// src/routes/index.tsx
import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";
import { Toaster } from "sonner";
import { AuthProvider } from "@/context/auth";

// Public Pages
import LandingPage from "@/pages/landing-page";
import CampaignPage from "@/pages/campaign-page";
import DetailsProgram from "@/pages/details-program";
import ActivityPage from "@/pages/activity-page";
import DetailsActivityPage from "@/pages/details-activity";
import AboutPage from "@/pages/about-page";
import SejarahPage from "@/pages/about/sejarah-page";
import VisiMisiPage from "@/pages/about/visi-misi-page";
import LegalitasPage from "@/pages/about/legalitas-page";
import PengurusPage from "@/pages/about/pengurus-page";
import AnakAsuh from "@/pages/about/anak-anak-page";
import LoginPage from "@/pages/login-admin";
import UnauthorizedPage from "@/pages/unauthorized";

// Admin Layout and Pages
import AdminLayout from "@/components/layout/admin-dashboard";
import AdminDashboard from "@/pages/admin/admin-dashboard";
import { AdminRoute } from "./protected-router";
import AdminActivity from "@/pages/admin/admin-activity";
import AdminUser from "@/pages/admin/admin-user";

// Placeholder Admin Pages (to be replaced with real ones)


const router = createBrowserRouter([
  // Public Routes
  { path: "/", element: <LandingPage /> },
  { path: "/campaign", element: <CampaignPage /> },
  { path: "/campaign/details/:id", element: <DetailsProgram /> },
  { path: "/activity", element: <ActivityPage /> },
  { path: "/activity/details/:id", element: <DetailsActivityPage /> },
  { path: "/about", element: <AboutPage /> },
  { path: "/about/sejarah", element: <SejarahPage /> },
  { path: "/about/visi-misi", element: <VisiMisiPage /> },
  { path: "/about/legalitas", element: <LegalitasPage /> },
  { path: "/about/pengurus", element: <PengurusPage /> },
  { path: "/about/anak-panti", element: <AnakAsuh /> },
  { path: "/login", element: <LoginPage /> },
  { path: "/unauthorized", element: <UnauthorizedPage /> },

  // Admin Routes (Protected)
  {
    element: <AdminRoute />, // Check authentication and admin status
    children: [
      {
        path: "/admin",
        element: <AdminLayout />,
        children: [
          { index: true, element: <Navigate to="donation" replace /> },
          { path: "donation", element: <AdminDashboard /> },
          { path: "activities", element: <AdminActivity /> },
          { path: "user", element: <AdminUser /> },
        ],
      },
    ],
  },
]);

export default function Routes() {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
      <Toaster richColors position="top-right" />
    </AuthProvider>
  );
}
