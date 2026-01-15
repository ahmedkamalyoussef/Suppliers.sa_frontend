"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import ProtectedRoute from "../../components/ProtectedRoute";
import AdminStats from "../../components/AdminStats";
import UserManagement from "../../components/UserManagement";
import EmployeeManagement from "../../components/EmployeeManagement";
import ContentManagement from "../../components/ContentManagement";
import SystemSettings from "../../components/SystemSettings";
import AdminAnalytics from "../../components/AdminAnalytics";
import PartnershipsManagement from "../../components/PartnershipsManagement";
import BusinessStatistics from "../../components/BusinessStatistics";
import SupplierCommunications from "../../components/SupplierCommunications";
import { ToastProvider } from "../../components/ToastContext";
import { useAuth } from "../../hooks/useAuth";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const router = useRouter();
  const { user, logout, userType } = useAuth();

  const handleLogout = () => {
    logout();
  };

  const allTabs = [
    { id: "overview", name: "Overview", icon: "ri-dashboard-3-line" },
    { id: "users", name: "User Management", icon: "ri-user-settings-line" },
    { id: "employees", name: "Employee Management", icon: "ri-team-line" },
    { id: "content", name: "Content Management", icon: "ri-file-list-3-line" },
    {
      id: "communications",
      name: "Supplier Communications",
      icon: "ri-message-3-line",
    },
    {
      id: "partnerships",
      name: "Partnerships Management",
      icon: "ri-handshake-line",
    },
    {
      id: "business-statistics",
      name: "Business Statistics",
      icon: "ri-bar-chart-2-line",
    },
    {
      id: "analytics",
      name: "System Analytics",
      icon: "ri-bar-chart-box-line",
    },
    { id: "settings", name: "System Settings", icon: "ri-settings-3-line" },
  ];

  // Filter tabs based on user role
  const tabs = allTabs.filter((tab) => {
    if (tab.id === "employees") {
      return userType === "super_admin";
    }
    // User Management tab is always visible for admins (not super_admin)
    if (tab.id === "users") {
      return userType === "admin" || userType === "super_admin";
    }
    return true;
  });

  // Redirect to overview if active tab is not accessible
  useEffect(() => {
    if (activeTab === "employees" && userType !== "super_admin") {
      setActiveTab("overview");
    }
    // User Management tab is always accessible for admins
    // No redirect needed for users tab
  }, [activeTab, userType]);

  return (
    <ProtectedRoute allowedRoles={["admin", "super_admin"]}>
      <ToastProvider>
        <div className="min-h-screen bg-gray-50">
          <Header />

          <main className="py-6 sm:py-8">
            <div className="w-full px-4 sm:px-6 md:px-8">
              <div className="max-w-7xl mx-auto">
                {/* Admin Header */}
                <div className="bg-gradient-to-r from-red-500 to-red-600 rounded-2xl shadow-lg p-4 sm:p-6 md:p-8 mb-6 sm:mb-8 text-white">
                  <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 sm:gap-6">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
                      {user?.profileImage && (
                        <img
                          src={user.profileImage}
                          alt={user?.name || "Admin"}
                          className="w-16 h-16 sm:w-20 sm:h-20 rounded-full object-cover border-4 border-white/20"
                        />
                      )}
                      <div>
                        <h1 className="text-2xl sm:text-3xl font-bold">
                          Admin Control Panel
                        </h1>
                        <p className="text-red-100 text-sm sm:text-base mb-1 sm:mb-2">
                          Welcome back, {user?.name || "Admin"}
                        </p>
                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4 text-xs sm:text-sm text-red-100">
                          <span className="flex items-center">
                            <i className="ri-shield-check-line mr-1"></i>
                            {user?.role === "super_admin"
                              ? "Super Administrator"
                              : user?.role === "admin"
                              ? "Administrator"
                              : "Admin"}
                          </span>
                          {user?.department && (
                            <span className="flex items-center">
                              <i className="ri-building-line mr-1"></i>
                              {user.department}
                            </span>
                          )}
                          {user?.jobRole && (
                            <span className="flex items-center">
                              <i className="ri-briefcase-line mr-1"></i>
                              {user.jobRole}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-wrap sm:flex-nowrap gap-2 sm:gap-3 w-full sm:w-auto">
                      <button
                        onClick={handleLogout}
                        className="bg-red-700 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg hover:bg-red-800 font-medium whitespace-nowrap cursor-pointer transition-all flex items-center justify-center"
                      >
                        <i className="ri-logout-box-line mr-2"></i>
                        Logout
                      </button>
                    </div>
                  </div>
                </div>

                {/* Navigation Tabs */}
                <div className="bg-white rounded-2xl shadow-sm mb-6 sm:mb-8 border border-gray-100">
                  <div className="border-b border-gray-200">
                    <nav className="flex space-x-4 sm:space-x-6 px-4 sm:px-6 overflow-x-auto no-scrollbar">
                      {tabs.map((tab) => (
                        <button
                          key={tab.id}
                          onClick={() => setActiveTab(tab.id)}
                          className={`py-3 sm:py-4 px-2 sm:px-3 border-b-2 font-medium text-sm sm:text-base whitespace-nowrap cursor-pointer transition-all flex items-center gap-1 sm:gap-2 ${
                            activeTab === tab.id
                              ? "border-red-500 text-red-600"
                              : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                          }`}
                        >
                          <i className={`${tab.icon} text-lg sm:text-xl`}></i>
                          {tab.name}
                        </button>
                      ))}
                    </nav>
                  </div>

                  {/* Tab Content */}
                  <div className="p-4 sm:p-6 md:p-8">
                    {activeTab === "overview" && <AdminStats />}
                    {activeTab === "users" && <UserManagement />}
                    {activeTab === "employees" && <EmployeeManagement />}
                    {activeTab === "content" && <ContentManagement />}
                    {activeTab === "communications" && (
                      <SupplierCommunications />
                    )}
                    {activeTab === "partnerships" && <PartnershipsManagement />}
                    {activeTab === "business-statistics" && (
                      <BusinessStatistics />
                    )}
                    {activeTab === "analytics" && <AdminAnalytics />}
                    {activeTab === "settings" && <SystemSettings />}
                  </div>
                </div>
              </div>
            </div>
          </main>

          <Footer />
        </div>
      </ToastProvider>
    </ProtectedRoute>
  );
}
