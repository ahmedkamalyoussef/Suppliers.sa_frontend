"use client";

import { useState } from "react";
import { useLanguage } from "../lib/LanguageContext";

type User = {
  id: number;
  name: string;
  email: string;
  businessName: string;
  plan: "Basic" | "Premium" | "Enterprise";
  status: "active" | "suspended" | "pending" | "inactive";
  joinDate: string;
  lastActive: string;
  revenue: string;
  profileCompletion: number;
  avatar: string;
};

export default function UserManagement() {
  const { t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [filterStatus, setFilterStatus] = useState<"all" | User["status"]>(
    "all"
  );
  const [filterPlan, setFilterPlan] = useState<"all" | User["plan"]>("all");
  const [selectedUsers, setSelectedUsers] = useState<number[]>([]);
  const [showUserDetails, setShowUserDetails] = useState<User | null>(null);
  const [showUserModal, setShowUserModal] = useState<boolean>(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [userForm, setUserForm] = useState<
    Omit<
      User,
      "id" | "joinDate" | "lastActive" | "revenue" | "profileCompletion"
    >
  >({
    name: "",
    email: "",
    businessName: "",
    plan: "Basic",
    status: "active",
    avatar: "",
  });

  const [users, setUsers] = useState<User[]>([
    {
      id: 1,
      name: "Ahmed Al-Rashid",
      email: "ahmed@metroelectronics.com",
      businessName: "Metro Electronics Supply",
      plan: "Premium",
      status: "active",
      joinDate: "2024-01-15",
      lastActive: "2024-01-20",
      revenue: "$290",
      profileCompletion: 95,
      avatar:
        "https://readdy.ai/api/search-image?query=Professional%20middle%20eastern%20businessman%20portrait%2C%20clean%20background%2C%20modern%20business%20attire%2C%20confident%20smile&width=60&height=60&seq=user1&orientation=squarish",
    },
    {
      id: 2,
      name: "Sarah Johnson",
      email: "sarah@techsolutions.com",
      businessName: "Tech Solutions Co.",
      plan: "Basic",
      status: "active",
      joinDate: "2024-01-12",
      lastActive: "2024-01-19",
      revenue: "$0",
      profileCompletion: 78,
      avatar:
        "https://readdy.ai/api/search-image?query=Professional%20businesswoman%20portrait%2C%20confident%20smile%2C%20modern%20office%20background%2C%20professional%20headshot%20style&width=60&height=60&seq=user2&orientation=squarish",
    },
    {
      id: 3,
      name: "Michael Chen",
      email: "michael@digitalinnovations.com",
      businessName: "Digital Innovations",
      plan: "Enterprise",
      status: "suspended",
      joinDate: "2024-01-10",
      lastActive: "2024-01-18",
      revenue: "$990",
      profileCompletion: 88,
      avatar:
        "https://readdy.ai/api/search-image?query=Professional%20asian%20businessman%20portrait%2C%20modern%20business%20attire%2C%20clean%20background%2C%20confident%20expression&width=60&height=60&seq=user3&orientation=squarish",
    },
    {
      id: 4,
      name: "Lisa Rodriguez",
      email: "lisa@startuphub.com",
      businessName: "StartUp Hub",
      plan: "Premium",
      status: "pending",
      joinDate: "2024-01-18",
      lastActive: "2024-01-20",
      revenue: "$290",
      profileCompletion: 45,
      avatar:
        "https://readdy.ai/api/search-image?query=Professional%20latina%20businesswoman%20portrait%2C%20friendly%20smile%2C%20modern%20office%20setting%2C%20professional%20headshot%20style&width=60&height=60&seq=user4&orientation=squarish",
    },
    {
      id: 5,
      name: "David Park",
      email: "david@innovationlabs.com",
      businessName: "Innovation Labs",
      plan: "Basic",
      status: "inactive",
      joinDate: "2024-01-05",
      lastActive: "2024-01-15",
      revenue: "$0",
      profileCompletion: 62,
      avatar:
        "https://readdy.ai/api/search-image?query=Professional%20korean%20businessman%20portrait%2C%20modern%20business%20attire%2C%20clean%20white%20background%2C%20confident%20pose&width=60&height=60&seq=user5&orientation=squarish",
    },
  ]);

  const openAddUser = () => {
    setEditingUser(null);
    setUserForm({
      name: "",
      email: "",
      businessName: "",
      plan: "Basic",
      status: "active",
      avatar:
        "https://readdy.ai/api/search-image?query=generic%20avatar%20placeholder%2C%20rounded%20profile%20icon&width=60&height=60&orientation=squarish",
    });
    setShowUserModal(true);
  };

  const openEditUser = (user: User) => {
    setEditingUser(user);
    setUserForm({
      name: user.name,
      email: user.email,
      businessName: user.businessName,
      plan: user.plan,
      status: user.status,
      avatar: user.avatar,
    });
    setShowUserModal(true);
  };

  const saveUser = () => {
    if (
      !userForm.name.trim() ||
      !userForm.email.trim() ||
      !userForm.businessName.trim()
    )
      return;
    if (editingUser) {
      setUsers(
        users.map((u: User) =>
          u.id === editingUser.id ? ({ ...u, ...userForm } as User) : u
        )
      );
    } else {
      const nextId = users.length
        ? Math.max(...users.map((u: User) => u.id)) + 1
        : 1;
      setUsers([
        ...users,
        {
          id: nextId,
          revenue: "$0",
          profileCompletion: 0,
          joinDate: new Date().toISOString().slice(0, 10),
          lastActive: new Date().toISOString().slice(0, 10),
          ...userForm,
        },
      ]);
    }
    setShowUserModal(false);
    setEditingUser(null);
  };

  const exportData = () => {
    const headers = [
      "ID",
      "Name",
      "Email",
      "Business",
      "Plan",
      "Status",
      "Revenue",
      "Join Date",
      "Last Active",
      "Profile Completion",
    ];
    const rows = users.map((u) => [
      u.id,
      `"${u.name}"`,
      u.email,
      `"${u.businessName}"`,
      u.plan,
      u.status,
      u.revenue,
      u.joinDate,
      u.lastActive,
      u.profileCompletion,
    ]);
    const csv = [
      "\ufeff" + headers.join(","),
      ...rows.map((r) => r.join(",")),
    ].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "users.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const filteredUsers = users.filter((user: User) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.businessName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      filterStatus === "all" || user.status === filterStatus;
    const matchesPlan = filterPlan === "all" || user.plan === filterPlan;
    return matchesSearch && matchesStatus && matchesPlan;
  });

  const getStatusColor = (status: User["status"]) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-600";
      case "suspended":
        return "bg-red-100 text-red-600";
      case "pending":
        return "bg-yellow-100 text-yellow-600";
      case "inactive":
        return "bg-gray-100 text-gray-600";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  const getPlanColor = (plan: User["plan"]) => {
    switch (plan) {
      case "Enterprise":
        return "bg-purple-100 text-purple-600";
      case "Premium":
        return "bg-blue-100 text-blue-600";
      case "Basic":
        return "bg-green-100 text-green-600";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  const handleUserAction = (
    action: "edit" | "suspend" | "delete",
    userId: number
  ) => {
    const target = users.find((u: User) => u.id === userId);
    if (!target) return;
    if (action === "edit") {
      openEditUser(target);
    } else if (action === "suspend") {
      setUsers(
        users.map((u: User) =>
          u.id === userId
            ? {
                ...u,
                status: u.status === "suspended" ? "active" : "suspended",
              }
            : u
        )
      );
    } else if (action === "delete") {
      setUsers(users.filter((u: User) => u.id !== userId));
    }
  };

  const handleBulkAction = (action: "suspend" | "delete") => {
    setSelectedUsers([]);
  };

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-800">
          {t("userManagement.title")}
        </h2>
        <div className="flex flex-col sm:flex-row gap-3">
          {selectedUsers.length > 0 && (
            <div className="flex gap-2">
              <button
                onClick={() => handleBulkAction("suspend")}
                className="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600 font-medium text-sm whitespace-nowrap cursor-pointer"
              >
                <i className="ri-pause-circle-line mr-2"></i>
                {t("userManagement.bulkSuspend").replace(
                  "{count}",
                  selectedUsers.length.toString()
                )}
              </button>
              <button
                onClick={() => handleBulkAction("delete")}
                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 font-medium text-sm whitespace-nowrap cursor-pointer"
              >
                <i className="ri-delete-bin-line mr-2"></i>
                {t("userManagement.bulkDelete").replace(
                  "{count}",
                  selectedUsers.length.toString()
                )}
              </button>
            </div>
          )}
          <button
            onClick={openAddUser}
            className="bg-green-500 text-white px-4 sm:px-6 py-2 rounded-lg hover:bg-green-600 font-medium text-sm whitespace-nowrap cursor-pointer"
          >
            <i className="ri-add-line mr-2"></i>
            {t("userManagement.addUser")}
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-100">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t("userManagement.searchUsers")}
            </label>
            <div className="relative">
              <i className="ri-search-line absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder={t("userManagement.searchPlaceholder")}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-400 focus:border-transparent text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t("userManagement.status")}
            </label>
            <select
              value={filterStatus}
              onChange={(e) =>
                setFilterStatus(e.target.value as "all" | User["status"])
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-400 focus:border-transparent text-sm"
            >
              <option value="all">{t("userManagement.allStatus")}</option>
              <option value="active">{t("userManagement.active")}</option>
              <option value="suspended">{t("userManagement.suspended")}</option>
              <option value="pending">{t("userManagement.pending")}</option>
              <option value="inactive">{t("userManagement.inactive")}</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t("userManagement.plan")}
            </label>
            <select
              value={filterPlan}
              onChange={(e) =>
                setFilterPlan(e.target.value as "all" | User["plan"])
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-400 focus:border-transparent text-sm"
            >
              <option value="all">{t("userManagement.allPlans")}</option>
              <option value="Basic">{t("userManagement.basic")}</option>
              <option value="Premium">{t("userManagement.premium")}</option>
              <option value="Enterprise">
                {t("userManagement.enterprise")}
              </option>
            </select>
          </div>

          <div className="flex items-end">
            <button
              onClick={exportData}
              className="w-full bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 font-medium text-sm whitespace-nowrap cursor-pointer"
            >
              <i className="ri-download-line mr-2"></i>
              {t("userManagement.exportData")}
            </button>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left py-3 px-4 sm:px-6">
                  <input
                    type="checkbox"
                    className="w-4 h-4 text-red-500 border-gray-300 rounded focus:ring-red-400"
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedUsers(filteredUsers.map((u) => u.id));
                      } else {
                        setSelectedUsers([]);
                      }
                    }}
                  />
                </th>
                <th className="text-left py-3 px-4 sm:px-6 text-sm font-medium text-gray-700">
                  {t("userManagement.user")}
                </th>
                <th className="text-left py-3 px-4 sm:px-6 text-sm font-medium text-gray-700">
                  {t("userManagement.business")}
                </th>
                <th className="text-left py-3 px-4 sm:px-6 text-sm font-medium text-gray-700">
                  {t("userManagement.plan")}
                </th>
                <th className="text-left py-3 px-4 sm:px-6 text-sm font-medium text-gray-700">
                  {t("userManagement.status")}
                </th>
                <th className="text-left py-3 px-4 sm:px-6 text-sm font-medium text-gray-700">
                  {t("userManagement.revenue")}
                </th>
                <th className="text-left py-3 px-4 sm:px-6 text-sm font-medium text-gray-700">
                  {t("userManagement.lastActive")}
                </th>
                <th className="text-left py-3 px-4 sm:px-6 text-sm font-medium text-gray-700">
                  {t("userManagement.actions")}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="py-4 px-4 sm:px-6">
                    <input
                      type="checkbox"
                      checked={selectedUsers.includes(user.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedUsers([...selectedUsers, user.id]);
                        } else {
                          setSelectedUsers(
                            selectedUsers.filter((id) => id !== user.id)
                          );
                        }
                      }}
                      className="w-4 h-4 text-red-500 border-gray-300 rounded focus:ring-red-400"
                    />
                  </td>
                  <td className="py-4 px-4 sm:px-6">
                    <div className="flex items-center space-x-3">
                      <img
                        src={user.avatar}
                        alt={user.name}
                        className="w-8 h-8 sm:w-10 sm:h-10 rounded-full object-cover"
                      />
                      <div className="min-w-0">
                        <p className="font-medium text-gray-800 text-sm sm:text-base truncate">
                          {user.name}
                        </p>
                        <p className="text-xs sm:text-sm text-gray-600 truncate">
                          {user.email}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4 sm:px-6">
                    <p className="text-gray-800 text-sm sm:text-base">
                      {user.businessName}
                    </p>
                    <div className="flex items-center mt-1">
                      <div className="w-16 sm:w-20 bg-gray-200 rounded-full h-1.5 mr-2">
                        <div
                          className="bg-blue-500 h-1.5 rounded-full"
                          style={{ width: `${user.profileCompletion}%` }}
                        ></div>
                      </div>
                      <span className="text-xs text-gray-500">
                        {user.profileCompletion}%
                      </span>
                    </div>
                  </td>
                  <td className="py-4 px-4 sm:px-6">
                    <span
                      className={`px-2 sm:px-3 py-1 rounded-full text-xs font-medium ${getPlanColor(
                        user.plan
                      )}`}
                    >
                      {user.plan}
                    </span>
                  </td>
                  <td className="py-4 px-4 sm:px-6">
                    <span
                      className={`px-2 sm:px-3 py-1 rounded-full text-xs font-medium capitalize ${getStatusColor(
                        user.status
                      )}`}
                    >
                      {user.status}
                    </span>
                  </td>
                  <td className="py-4 px-4 sm:px-6">
                    <span className="font-medium text-gray-800 text-sm sm:text-base">
                      {user.revenue}
                    </span>
                  </td>
                  <td className="py-4 px-4 sm:px-6">
                    <span className="text-xs sm:text-sm text-gray-600">
                      {new Date(user.lastActive).toLocaleDateString()}
                    </span>
                  </td>
                  <td className="py-4 px-4 sm:px-6">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => setShowUserDetails(user)}
                        className="text-blue-600 hover:text-blue-700 cursor-pointer"
                        title={t("userManagement.viewDetails")}
                      >
                        <i className="ri-eye-line text-sm sm:text-base"></i>
                      </button>
                      <button
                        onClick={() => handleUserAction("edit", user.id)}
                        className="text-green-600 hover:text-green-700 cursor-pointer"
                        title={t("userManagement.edit")}
                      >
                        <i className="ri-edit-line text-sm sm:text-base"></i>
                      </button>
                      <button
                        onClick={() => handleUserAction("suspend", user.id)}
                        className="text-yellow-600 hover:text-yellow-700 cursor-pointer"
                        title={t("userManagement.suspendUser")}
                      >
                        <i className="ri-pause-circle-line text-sm sm:text-base"></i>
                      </button>
                      <button
                        onClick={() => handleUserAction("delete", user.id)}
                        className="text-red-600 hover:text-red-700 cursor-pointer"
                        title={t("userManagement.deleteUser")}
                      >
                        <i className="ri-delete-bin-line text-sm sm:text-base"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="bg-gray-50 px-4 sm:px-6 py-3 border-t border-gray-200">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="text-xs sm:text-sm text-gray-600">
              {t("userManagement.showingUsers")
                .replace("{count}", filteredUsers.length.toString())
                .replace("{total}", users.length.toString())}
            </div>
            <div className="flex items-center space-x-2">
              <button className="px-3 py-1 border border-gray-300 rounded text-xs sm:text-sm hover:bg-gray-100 cursor-pointer">
                {t("userManagement.previous")}
              </button>
              <button className="px-3 py-1 bg-red-500 text-white rounded text-xs sm:text-sm">
                1
              </button>
              <button className="px-3 py-1 border border-gray-300 rounded text-xs sm:text-sm hover:bg-gray-100 cursor-pointer">
                2
              </button>
              <button className="px-3 py-1 border border-gray-300 rounded text-xs sm:text-sm hover:bg-gray-100 cursor-pointer">
                {t("userManagement.next")}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* User Details Modal */}
      {showUserDetails && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-screen overflow-y-auto">
            <div className="p-4 sm:p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-base sm:text-lg font-semibold text-gray-800">
                  {t("userManagement.userDetails")}
                </h3>
                <button
                  onClick={() => setShowUserDetails(null)}
                  className="text-gray-400 hover:text-gray-600 cursor-pointer"
                >
                  <i className="ri-close-line text-xl"></i>
                </button>
              </div>
            </div>

            <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
              <div className="flex items-center space-x-3 sm:space-x-4">
                <img
                  src={showUserDetails.avatar}
                  alt={showUserDetails.name}
                  className="w-12 h-12 sm:w-16 sm:h-16 rounded-full object-cover"
                />
                <div className="min-w-0">
                  <h4 className="text-lg sm:text-xl font-semibold text-gray-800 truncate">
                    {showUserDetails.name}
                  </h4>
                  <p className="text-sm sm:text-base text-gray-600 truncate">
                    {showUserDetails.email}
                  </p>
                  <p className="text-xs sm:text-sm text-gray-500 truncate">
                    {showUserDetails.businessName}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t("userManagement.plan")}
                  </label>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${getPlanColor(
                      showUserDetails.plan
                    )}`}
                  >
                    {showUserDetails.plan}
                  </span>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t("userManagement.status")}
                  </label>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium capitalize ${getStatusColor(
                      showUserDetails.status
                    )}`}
                  >
                    {showUserDetails.status}
                  </span>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t("userManagement.joinDate")}
                  </label>
                  <p className="text-gray-800 text-sm sm:text-base">
                    {new Date(showUserDetails.joinDate).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t("userManagement.revenue")}
                  </label>
                  <p className="text-gray-800 font-medium text-sm sm:text-base">
                    {showUserDetails.revenue}
                  </p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                <button
                  onClick={() => {
                    openEditUser(showUserDetails);
                    setShowUserDetails(null);
                  }}
                  className="bg-blue-500 text-white px-4 sm:px-6 py-2 rounded-lg hover:bg-blue-600 font-medium text-sm whitespace-nowrap cursor-pointer"
                >
                  <i className="ri-edit-line mr-2"></i>
                  {t("userManagement.editUser")}
                </button>
                <button
                  onClick={() => {
                    handleUserAction("suspend", showUserDetails.id);
                    setShowUserDetails(null);
                  }}
                  className="bg-yellow-500 text-white px-4 sm:px-6 py-2 rounded-lg hover:bg-yellow-600 font-medium text-sm whitespace-nowrap cursor-pointer"
                >
                  <i className="ri-pause-circle-line mr-2"></i>
                  {t("userManagement.suspend")}
                </button>
                <button
                  onClick={() => {
                    handleUserAction("delete", showUserDetails.id);
                    setShowUserDetails(null);
                  }}
                  className="bg-red-500 text-white px-4 sm:px-6 py-2 rounded-lg hover:bg-red-600 font-medium text-sm whitespace-nowrap cursor-pointer"
                >
                  <i className="ri-delete-bin-line mr-2"></i>
                  {t("userManagement.delete")}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add/Edit User Modal */}
      {showUserModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full max-h-screen overflow-y-auto">
            <div className="p-4 sm:p-6 border-b border-gray-200 flex items-center justify-between">
              <h3 className="text-base sm:text-lg font-semibold text-gray-800">
                {editingUser
                  ? t("userManagement.editUser")
                  : t("userManagement.addUser")}
              </h3>
              <button
                onClick={() => {
                  setShowUserModal(false);
                  setEditingUser(null);
                }}
                className="text-gray-400 hover:text-gray-600 cursor-pointer"
              >
                <i className="ri-close-line text-xl"></i>
              </button>
            </div>
            <div className="p-4 sm:p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t("userManagement.name")}
                </label>
                <input
                  type="text"
                  value={userForm.name}
                  onChange={(e) =>
                    setUserForm({ ...userForm, name: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-400 focus:border-transparent text-sm"
                  placeholder={t("userManagement.name")}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t("userManagement.email")}
                </label>
                <input
                  type="email"
                  value={userForm.email}
                  onChange={(e) =>
                    setUserForm({ ...userForm, email: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-400 focus:border-transparent text-sm"
                  placeholder={t("userManagement.email")}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t("userManagement.businessName")}
                </label>
                <input
                  type="text"
                  value={userForm.businessName}
                  onChange={(e) =>
                    setUserForm({ ...userForm, businessName: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-400 focus:border-transparent text-sm"
                  placeholder={t("userManagement.businessName")}
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t("userManagement.plan")}
                  </label>
                  <select
                    value={userForm.plan}
                    onChange={(e) =>
                      setUserForm({
                        ...userForm,
                        plan: e.target.value as User["plan"],
                      })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-400 focus:border-transparent text-sm"
                  >
                    <option value="Basic">{t("userManagement.basic")}</option>
                    <option value="Premium">
                      {t("userManagement.premium")}
                    </option>
                    <option value="Enterprise">
                      {t("userManagement.enterprise")}
                    </option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t("userManagement.status")}
                  </label>
                  <select
                    value={userForm.status}
                    onChange={(e) =>
                      setUserForm({
                        ...userForm,
                        status: e.target.value as User["status"],
                      })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-400 focus:border-transparent text-sm"
                  >
                    <option value="active">{t("userManagement.active")}</option>
                    <option value="pending">
                      {t("userManagement.pending")}
                    </option>
                    <option value="suspended">
                      {t("userManagement.suspended")}
                    </option>
                    <option value="inactive">
                      {t("userManagement.inactive")}
                    </option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t("userManagement.avatarUrl")}
                </label>
                <input
                  type="text"
                  value={userForm.avatar}
                  onChange={(e) =>
                    setUserForm({ ...userForm, avatar: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-400 focus:border-transparent text-sm"
                  placeholder={t("userManagement.avatarUrl")}
                />
              </div>
            </div>
            <div className="p-4 sm:p-6 border-t border-gray-200 flex flex-col sm:flex-row justify-end gap-3">
              <button
                onClick={() => {
                  setShowUserModal(false);
                  setEditingUser(null);
                }}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium text-sm whitespace-nowrap cursor-pointer order-2 sm:order-1"
              >
                {t("userManagement.cancel")}
              </button>
              <button
                onClick={saveUser}
                disabled={
                  !userForm.name.trim() ||
                  !userForm.email.trim() ||
                  !userForm.businessName.trim()
                }
                className={`px-6 py-2 rounded-lg font-medium text-sm whitespace-nowrap cursor-pointer transition-all order-1 sm:order-2 ${
                  userForm.name.trim() &&
                  userForm.email.trim() &&
                  userForm.businessName.trim()
                    ? "bg-red-500 text-white hover:bg-red-600"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
              >
                {t("userManagement.save")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
