// src/components/layout/admin-dashboard.tsx
import { useState, useEffect, type JSX } from "react";
import { Outlet, NavLink, useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/auth";

// UI Components
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

// Icons
import {
  Users,
  Calendar,
  LogOut,
  ArrowLeftFromLine,
  ArrowRightFromLine,
  Menu,
  HandCoins,
} from "lucide-react";

// Import logo
import logo from "../../assets/image/logo_artanita.png";

// TypeScript interfaces
interface MenuItem {
  icon: JSX.Element;
  label: string;
  path: string;
}

export default function AdminLayout() {
  const { user, isLoading, logout } = useAuth();
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const toggleSidebar = () => setCollapsed(!collapsed);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // Set page title based on current path
  useEffect(() => {
    const pathSegments = location.pathname.split('/');
    const currentPage = pathSegments[pathSegments.length - 1];
    
    // Get page title from path
    let pageTitle = "Dashboard";
    if (currentPage) {
      pageTitle = currentPage.charAt(0).toUpperCase() + currentPage.slice(1);
    }
    
    document.title = `Admin | ${pageTitle}`;
  }, [location.pathname]);

  const menuItems: MenuItem[] = [
    { icon: <HandCoins  size={20} />, label: "Donasi", path: "/admin/donation" },
    { icon: <Calendar size={20} />, label: "Aktivitas", path: "/admin/activities" },
    { icon: <Users size={20} />, label: "User", path: "/admin/user" },
  ];

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  if (!user) {
    // Redirect to login if user is not authenticated
    navigate("/login");
    return null;
  }

  // Get current page title for header
  const getCurrentPageTitle = () => {
    const currentPath = location.pathname;
    const currentMenuItem = menuItems.find(item => currentPath.includes(item.path));
    return currentMenuItem ? currentMenuItem.label : "Admin Dashboard";
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <motion.aside
        className={cn(
          "bg-white shadow-md h-full flex flex-col transition-all duration-300",
          collapsed ? "w-20" : "w-64"
        )}
        initial={false}
        animate={{ width: collapsed ? 80 : 256 }}
      >
        {/* Logo & Toggle */}
        <div className="p-4 flex items-center justify-end ">
          <div className="flex justify-center items-center pr-12">
            {!collapsed && <img src={logo} alt="Artanita Logo" className="w-16  " />}

          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleSidebar}
            className="rounded-full"
          >
            {collapsed ? <ArrowRightFromLine size={18} /> : <ArrowLeftFromLine size={18} />}
          </Button>
        </div>

        {/* Menu */}
        <nav className="flex-1 pt-5">
          <ul className="space-y-1 px-2">
            {menuItems.map((item, index) => (
              <li key={index}>
                <NavLink
                  to={item.path}
                  className={({ isActive }) =>
                    cn(
                      "flex items-center p-3 rounded-lg transition-all",
                      isActive ? "bg-[#379777] !text-white" : "!text-gray-600 hover:bg-gray-100",
                      collapsed && "justify-center"
                    )
                  }
                >
                  <span>{item.icon}</span>
                  {!collapsed && <span className="ml-3">{item.label}</span>}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        {/* Footer / User Info */}
        <div
          className={cn(
            "p-4 border-t flex items-center mt-auto",
            collapsed ? "justify-center" : "justify-between"
          )}
        >
          <div className="flex items-center">
            <Avatar className="h-9 w-9">
              <AvatarFallback className="bg-[#5fd068] text-white">
                {user?.name?.charAt(0).toUpperCase() || "A"}
              </AvatarFallback>
            </Avatar>
            {!collapsed && (
              <div className="ml-3">
                <p className="text-sm font-medium">{user?.name || "Admin"}</p>
                <p className="text-xs text-gray-500">{user?.role || "Admin"}</p>
              </div>
            )}
          </div>
          {!collapsed && (
            <Button variant="ghost" size="icon" onClick={handleLogout} title="Logout">
              <LogOut size={18} />
            </Button>
          )}
        </div>
      </motion.aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white shadow-sm  h-24 flex items-center px-6">
          <Button variant="ghost" size="icon" className="md:hidden mr-2" onClick={toggleSidebar}>
            <Menu />
          </Button>
          <div className="flex-1">
            <h1 className="!text-4xl font-semibold">{getCurrentPageTitle()}</h1>
          </div>
          <div className="md:hidden flex items-center gap-2">
            <Avatar className="h-8 w-8">
              <AvatarFallback className="bg-[#5fd068] text-white">
                {user?.name?.charAt(0).toUpperCase() || "A"}
              </AvatarFallback>
            </Avatar>
            <Button variant="ghost" size="icon" onClick={handleLogout}>
              <LogOut size={18} />
            </Button>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-6 bg-gray-100">
          <Outlet />
        </main>
      </div>
    </div>
  );
};