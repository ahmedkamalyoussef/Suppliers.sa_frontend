"use client";

import { useState, useEffect } from "react";
import { useLanguage } from "../lib/LanguageContext";
import { apiService } from "../lib/api";
import { useToast } from "./ToastContext";
import {
  AdminListItem as Employee,
  CreateAdminRequest,
  UpdateAdminRequest,
} from "../types/auth";

// Helper function to get full image URL
const getImageUrl = (imagePath: string | null) => {
  if (!imagePath) return "/icon.png";
  if (imagePath.startsWith("http")) return imagePath;
  return `${API_BASE_URL}/${imagePath}`;
};

const API_BASE_URL = "http://localhost:8000";
type RoleDef = { name: string; permissions: string[]; description: string };
type PermissionDef = { id: string; name: string; category: string };

export default function EmployeeManagement() {
  const { t, isRTL } = useLanguage();
  const { showToast } = useToast();

  const [showAddEmployee, setShowAddEmployee] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [newEmployee, setNewEmployee] = useState<{
    name: string;
    email: string;
    role: string;
    department: string;
    permissions: string[];
    password: string;
  }>({
    name: "",
    email: "",
    role: "",
    department: "",
    permissions: [],
    password: "",
  });
  const [showEditEmployee, setShowEditEmployee] = useState(false);
  const [editEmployee, setEditEmployee] = useState<{
    id: number;
    name: string;
    email: string;
    role: "admin" | "super_admin";
    department: string;
    permissions: string[];
    status: string | null;
    joinDate: string;
    lastActive: string;
    avatar: string | null;
  }>({
    id: 0,
    name: "",
    email: "",
    role: "admin",
    department: "",
    permissions: [],
    status: "active",
    joinDate: "",
    lastActive: "",
    avatar: "",
  });

  // Create a proper permissions object for API calls
  const createPermissionsObject = (permissionIds: string[]) => {
    const permissions: any = {};
    allPermissions.forEach((perm) => {
      permissions[perm.id] = permissionIds.includes(perm.id);
    });
    return permissions;
  };

  // Convert AdminPermissions object to permission IDs array
  const permissionsToArray = (permissions: any): string[] => {
    const permissionIds: string[] = [];

    // Map API permission keys to frontend permission IDs
    const permissionMap: { [key: string]: string } = {
      user_management_view: "users.read",
      user_management_edit: "users.edit",
      user_management_delete: "users.delete",
      user_management_full: "users.manage",
      content_management_view: "content.read",
      content_management_supervise: "content.moderate",
      content_management_delete: "content.delete",
      analytics_view: "analytics.read",
      analytics_export: "analytics.export",
      reports_view: "reports.view",
      reports_create: "reports.create",
      system_manage: "system.admin",
      system_settings: "settings.modify",
      system_backups: "backup.manage",
      support_manage: "support.manage",
    };

    Object.keys(permissionMap).forEach((apiKey) => {
      if (permissions[apiKey]) {
        permissionIds.push(permissionMap[apiKey]);
      }
    });

    return permissionIds;
  };

  // Display admin permissions directly from API
  const displayAdminPermissions = (permissions: any) => {
    const permissionDisplay: { [key: string]: string[] } = {
      "User Management": [],
      "Content Management": [],
      Analytics: [],
      Reporting: [],
      System: [],
      Support: [],
    };

    // Map API permission keys to display categories
    if (permissions.user_management_view)
      permissionDisplay["User Management"].push("View Users");
    if (permissions.user_management_edit)
      permissionDisplay["User Management"].push("Edit Users");
    if (permissions.user_management_delete)
      permissionDisplay["User Management"].push("Delete Users");
    if (permissions.user_management_full)
      permissionDisplay["User Management"].push("Full Access");

    if (permissions.content_management_view)
      permissionDisplay["Content Management"].push("View Content");
    if (permissions.content_management_supervise)
      permissionDisplay["Content Management"].push("Supervise Content");
    if (permissions.content_management_delete)
      permissionDisplay["Content Management"].push("Delete Content");

    if (permissions.analytics_view)
      permissionDisplay["Analytics"].push("View Analytics");
    if (permissions.analytics_export)
      permissionDisplay["Analytics"].push("Export Data");

    if (permissions.reports_view)
      permissionDisplay["Reporting"].push("View Reports");
    if (permissions.reports_create)
      permissionDisplay["Reporting"].push("Create Reports");

    if (permissions.system_manage)
      permissionDisplay["System"].push("System Management");
    if (permissions.system_settings)
      permissionDisplay["System"].push("System Settings");
    if (permissions.system_backups)
      permissionDisplay["System"].push("Manage Backups");

    if (permissions.support_manage)
      permissionDisplay["Support"].push("Manage Support");

    return permissionDisplay;
  };

  // Fetch admins from API
  const fetchAdmins = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await apiService.getAdmins();
      setEmployees(response.admins);
    } catch (err) {
      console.error("Error fetching admins:", err);
      setError("Failed to load employees");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

  const getRoleDisplayName = (role: string) => {
    switch (role) {
      case "admin":
        return "Administrator";
      case "super_admin":
        return "Super Administrator";
      default:
        return role;
    }
  };

  const roles: RoleDef[] = [
    {
      name: "admin",
      permissions: [
        "users.read",
        "users.edit",
        "support.manage",
        "reports.view",
      ],
      description: "Basic admin access",
    },
    {
      name: "super_admin",
      permissions: [
        "system.admin",
        "users.manage",
        "settings.modify",
        "backup.manage",
        "content.read",
        "content.moderate",
        "content.delete",
        "analytics.read",
        "analytics.export",
        "reports.create",
      ],
      description: "Full system administration access",
    },
  ];

  const allPermissions: PermissionDef[] = [
    {
      id: "users.read",
      name: t("employeeManagement.permissionsList.viewUsers"),
      category: t("employeeManagement.permissionCategories.userManagement"),
    },
    {
      id: "users.edit",
      name: t("employeeManagement.permissionsList.editUsers"),
      category: t("employeeManagement.permissionCategories.userManagement"),
    },
    {
      id: "users.delete",
      name: t("employeeManagement.permissionsList.deleteUsers"),
      category: t("employeeManagement.permissionCategories.userManagement"),
    },
    {
      id: "users.manage",
      name: t("employeeManagement.permissionsList.fullUserManagement"),
      category: t("employeeManagement.permissionCategories.userManagement"),
    },
    {
      id: "content.read",
      name: t("employeeManagement.permissionsList.viewContent"),
      category: t("employeeManagement.permissionCategories.contentManagement"),
    },
    {
      id: "content.moderate",
      name: t("employeeManagement.permissionsList.moderateContent"),
      category: t("employeeManagement.permissionCategories.contentManagement"),
    },
    {
      id: "content.delete",
      name: t("employeeManagement.permissionsList.deleteContent"),
      category: t("employeeManagement.permissionCategories.contentManagement"),
    },
    {
      id: "analytics.read",
      name: t("employeeManagement.permissionsList.viewAnalytics"),
      category: t("employeeManagement.permissionCategories.analytics"),
    },
    {
      id: "analytics.export",
      name: t("employeeManagement.permissionsList.exportAnalytics"),
      category: t("employeeManagement.permissionCategories.analytics"),
    },
    {
      id: "reports.view",
      name: t("employeeManagement.permissionsList.viewReports"),
      category: t("employeeManagement.permissionCategories.reporting"),
    },
    {
      id: "reports.create",
      name: t("employeeManagement.permissionsList.createReports"),
      category: t("employeeManagement.permissionCategories.reporting"),
    },
    {
      id: "system.admin",
      name: t("employeeManagement.permissionsList.systemAdministration"),
      category: t("employeeManagement.permissionCategories.system"),
    },
    {
      id: "settings.modify",
      name: t("employeeManagement.permissionsList.modifySettings"),
      category: t("employeeManagement.permissionCategories.system"),
    },
    {
      id: "backup.manage",
      name: t("employeeManagement.permissionsList.manageBackups"),
      category: t("employeeManagement.permissionCategories.system"),
    },
    {
      id: "support.manage",
      name: t("employeeManagement.permissionsList.manageSupport"),
      category: t("employeeManagement.permissionCategories.support"),
    },
  ];

  const getStatusColor = (status: Employee["status"]) => {
    if (!status) return "bg-gray-100 text-gray-600";
    switch (status) {
      case "active":
        return "bg-green-100 text-green-600";
      case "away":
        return "bg-yellow-100 text-yellow-600";
      case "inactive":
        return "bg-gray-100 text-gray-600";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  const getStatusText = (status: Employee["status"]) => {
    if (!status) return "Inactive";
    switch (status) {
      case "active":
        return t("employeeManagement.active");
      case "away":
        return t("employeeManagement.away");
      case "inactive":
        return t("employeeManagement.inactive");
      default:
        return status || "Inactive";
    }
  };

  const handleAddEmployee = async () => {
    if (
      !newEmployee.name ||
      !newEmployee.email ||
      !newEmployee.role ||
      !newEmployee.department ||
      !newEmployee.password
    ) {
      setError("Please fill all required fields");
      return;
    }

    if (newEmployee.password.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }

    try {
      setSaving(true);
      setError("");

      // Convert permissions array to permission object
      const permissions: any = {};
      allPermissions.forEach((perm) => {
        permissions[perm.id] = newEmployee.permissions.includes(perm.id);
      });

      const adminData: CreateAdminRequest = {
        name: newEmployee.name,
        email: newEmployee.email,
        password: newEmployee.password,
        role: "admin",
        department: newEmployee.department,
        job_role: newEmployee.role,
        permissions: {
          user_management_view: permissions["users.read"] || false,
          user_management_edit: permissions["users.edit"] || false,
          user_management_delete: permissions["users.delete"] || false,
          user_management_full: permissions["users.manage"] || false,
          content_management_view: permissions["content.read"] || false,
          content_management_supervise:
            permissions["content.moderate"] || false,
          content_management_delete: permissions["content.delete"] || false,
          analytics_view: permissions["analytics.read"] || false,
          analytics_export: permissions["analytics.export"] || false,
          reports_view: permissions["reports.view"] || false,
          reports_create: permissions["reports.create"] || false,
          system_manage: permissions["system.admin"] || false,
          system_settings: permissions["settings.modify"] || false,
          system_backups: permissions["backup.manage"] || false,
          support_manage: permissions["support.manage"] || false,
        },
      };

      await apiService.createAdmin(adminData);

      // Reset form and refresh list
      setNewEmployee({
        name: "",
        email: "",
        role: "",
        department: "",
        permissions: [],
        password: "",
      });
      setShowAddEmployee(false);
      await fetchAdmins();
      showToast(
        isRTL ? "تم إضافة الموظف بنجاح!" : "Employee added successfully!",
        "success"
      );
    } catch (err) {
      console.error("Error creating admin:", err);
      setError("Failed to create employee");
      showToast(
        isRTL ? "فشل في إنشاء الموظف" : "Failed to create employee",
        "error"
      );
    } finally {
      setSaving(false);
    }
  };

  const handleRoleChange = (roleName: string) => {
    const role = roles.find((r: RoleDef) => r.name === roleName);
    if (role) {
      setNewEmployee({
        ...newEmployee,
        role: roleName,
        permissions: role.permissions,
      });
    }
  };

  const openEditEmployee = (emp: Employee) => {
    const permissionsArray = permissionsToArray(emp.permissions);

    setEditEmployee({
      id: emp.id,
      name: emp.name,
      email: emp.email,
      role: emp.role,
      department: emp.department,
      permissions: permissionsArray,
      status: emp.status,
      joinDate: emp.created_at,
      lastActive: emp.last_login_at || "",
      avatar: emp.profile_image || "",
    });
    setShowEditEmployee(true);
  };

  const handleEditRoleChange = (roleName: string) => {
    const role = roles.find((r: RoleDef) => r.name === roleName);
    if (role) {
      setEditEmployee({
        ...editEmployee,
        role: roleName as "admin" | "super_admin",
        permissions: role.permissions,
      });
    }
  };

  const saveEditedEmployee = async () => {
    if (!editEmployee.name || !editEmployee.email || !editEmployee.role) return;

    try {
      setSaving(true);
      setError("");

      // Convert permissions array to permission object
      const permissions: any = {};
      allPermissions.forEach((perm) => {
        permissions[perm.id] = editEmployee.permissions.includes(perm.id);
      });

      const updateData: UpdateAdminRequest = {
        name: editEmployee.name,
        email: editEmployee.email,
        role: "admin",
        department: editEmployee.department,
        job_role: editEmployee.role,
        permissions: {
          user_management_view: permissions["users.read"] || false,
          user_management_edit: permissions["users.edit"] || false,
          user_management_delete: permissions["users.delete"] || false,
          user_management_full: permissions["users.manage"] || false,
          content_management_view: permissions["content.read"] || false,
          content_management_supervise:
            permissions["content.moderate"] || false,
          content_management_delete: permissions["content.delete"] || false,
          analytics_view: permissions["analytics.read"] || false,
          analytics_export: permissions["analytics.export"] || false,
          reports_view: permissions["reports.view"] || false,
          reports_create: permissions["reports.create"] || false,
          system_manage: permissions["system.admin"] || false,
          system_settings: permissions["settings.modify"] || false,
          system_backups: permissions["backup.manage"] || false,
          support_manage: permissions["support.manage"] || false,
        },
      };

      await apiService.updateAdmin(editEmployee.id, updateData);
      setShowEditEmployee(false);
      await fetchAdmins();
      showToast(
        isRTL ? "تم تحديث الموظف بنجاح!" : "Employee updated successfully!",
        "success"
      );
    } catch (err) {
      console.error("Error updating admin:", err);
      setError("Failed to update employee");
      showToast(
        isRTL ? "فشل في تحديث الموظف" : "Failed to update employee",
        "error"
      );
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteEmployee = async (id: number) => {
    if (!confirm(t("employeeManagement.confirmDelete"))) return;

    try {
      setSaving(true);
      setError("");
      await apiService.deleteAdmin(id);
      await fetchAdmins();
      showToast(
        isRTL ? "تم حذف الموظف بنجاح!" : "Employee deleted successfully!",
        "success"
      );
    } catch (err) {
      console.error("Error deleting admin:", err);
      setError("Failed to delete employee");
      showToast(
        isRTL ? "فشل في حذف الموظف" : "Failed to delete employee",
        "error"
      );
    } finally {
      setSaving(false);
    }
  };

  const permissionsByCategory = allPermissions.reduce<
    Record<string, PermissionDef[]>
  >((acc, permission) => {
    if (!acc[permission.category]) {
      acc[permission.category] = [] as PermissionDef[];
    }
    acc[permission.category].push(permission);
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">
          {t("employeeManagement.title")}
        </h2>
        <button
          onClick={() => setShowAddEmployee(true)}
          disabled={loading || saving}
          className="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 font-medium whitespace-nowrap cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <i className="ri-add-line mr-2"></i>
          {t("employeeManagement.addEmployee")}
        </button>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          <div className="flex items-center">
            <i className="ri-error-warning-line mr-2"></i>
            {error}
          </div>
        </div>
      )}

      {/* Loading Display */}
      {loading && (
        <div className="flex justify-center py-8">
          <i className="ri-loader-4-line animate-spin text-2xl text-blue-500"></i>
        </div>
      )}

      {!loading && (
        <>
          {/* Employee Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <i className="ri-team-line text-blue-600 text-xl"></i>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-800">
                    {employees.length}
                  </h3>
                  <p className="text-gray-600 text-sm">
                    {t("employeeManagement.totalEmployees")}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <i className="ri-user-line text-green-600 text-xl"></i>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-800">
                    {employees.filter((e) => e.status === "active").length}
                  </h3>
                  <p className="text-gray-600 text-sm">
                    {t("employeeManagement.active")}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <i className="ri-time-line text-yellow-600 text-xl"></i>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-800">
                    {employees.filter((e) => e.status === "away").length}
                  </h3>
                  <p className="text-gray-600 text-sm">
                    {t("employeeManagement.away")}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                  <i className="ri-user-unfollow-line text-gray-600 text-xl"></i>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-800">
                    {
                      employees.filter(
                        (e) => e.status === null || e.status === undefined
                      ).length
                    }
                  </h3>
                  <p className="text-gray-600 text-sm">Inactive</p>
                </div>
              </div>
            </div>
          </div>

          {/* Employees List */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800">
                {t("employeeManagement.teamMembers")}
              </h3>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="text-left py-3 px-6 text-sm font-medium text-gray-700">
                      {t("employeeManagement.employee")}
                    </th>
                    <th className="text-left py-3 px-6 text-sm font-medium text-gray-700">
                      {t("employeeManagement.roleDepartment")}
                    </th>
                    <th className="text-left py-3 px-6 text-sm font-medium text-gray-700">
                      {t("employeeManagement.status")}
                    </th>
                    <th className="text-left py-3 px-6 text-sm font-medium text-gray-700">
                      {t("employeeManagement.permissions")}
                    </th>
                    <th className="text-left py-3 px-6 text-sm font-medium text-gray-700">
                      {t("employeeManagement.lastActive")}
                    </th>
                    <th className="text-left py-3 px-6 text-sm font-medium text-gray-700">
                      {t("employeeManagement.actions")}
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {employees.map((employee) => (
                    <tr key={employee.id} className="hover:bg-gray-50">
                      <td className="py-4 px-6">
                        <div className="flex items-center space-x-3">
                          <img
                            src={getImageUrl(employee.profile_image)}
                            alt={employee.name}
                            className="w-10 h-10 rounded-full object-cover"
                          />
                          <div>
                            <p className="font-medium text-gray-800">
                              {employee.name}
                            </p>
                            <p className="text-sm text-gray-600">
                              {employee.email}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <p className="font-medium text-gray-800">
                          {employee.role}
                        </p>
                        <p className="text-sm text-gray-600">
                          {employee.department}
                        </p>
                      </td>
                      <td className="py-4 px-6">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${getStatusColor(
                            employee.status
                          )}`}
                        >
                          {getStatusText(employee.status)}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex flex-wrap gap-1">
                          {permissionsToArray(employee.permissions)
                            .slice(0, 2)
                            .map((permission, index) => (
                              <span
                                key={index}
                                className="bg-blue-100 text-blue-600 px-2 py-1 rounded text-xs"
                              >
                                {permission.split(".")[1]}
                              </span>
                            ))}
                          {permissionsToArray(employee.permissions).length >
                            2 && (
                            <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs">
                              +
                              {permissionsToArray(employee.permissions).length -
                                2}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <span className="text-sm text-gray-600">
                          {employee.last_login_at
                            ? new Date(
                                employee.last_login_at
                              ).toLocaleDateString()
                            : "Never"}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => setSelectedEmployee(employee)}
                            className="text-blue-600 hover:text-blue-700 cursor-pointer"
                            title={t("employeeManagement.viewDetails")}
                            disabled={saving}
                          >
                            <i className="ri-eye-line"></i>
                          </button>
                          <button
                            onClick={() => openEditEmployee(employee)}
                            className="text-yellow-600 hover:text-yellow-700 cursor-pointer"
                            title={t("employeeManagement.editEmployee")}
                            disabled={saving}
                          >
                            <i className="ri-edit-line"></i>
                          </button>
                          <button
                            onClick={() => handleDeleteEmployee(employee.id)}
                            className="text-red-600 hover:text-red-700 cursor-pointer"
                            title={t("employeeManagement.remove")}
                            disabled={saving}
                          >
                            <i className="ri-delete-bin-line"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Add Employee Modal */}
          {showAddEmployee && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-2xl max-w-2xl w-full max-h-screen overflow-y-auto">
                <div className="p-6 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-800">
                      {t("employeeManagement.addNewEmployee")}
                    </h3>
                    <button
                      onClick={() => setShowAddEmployee(false)}
                      className="text-gray-400 hover:text-gray-600 cursor-pointer"
                    >
                      <i className="ri-close-line text-xl"></i>
                    </button>
                  </div>
                </div>

                <div className="p-6 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {t("employeeManagement.fullName")}
                      </label>
                      <input
                        type="text"
                        value={newEmployee.name}
                        onChange={(e) =>
                          setNewEmployee({
                            ...newEmployee,
                            name: e.target.value,
                          })
                        }
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-400 focus:border-transparent text-sm"
                        placeholder={t("employeeManagement.enterFullName")}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {t("employeeManagement.emailAddress")}
                      </label>
                      <input
                        type="email"
                        value={newEmployee.email}
                        onChange={(e) =>
                          setNewEmployee({
                            ...newEmployee,
                            email: e.target.value,
                          })
                        }
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-400 focus:border-transparent text-sm"
                        placeholder={t("employeeManagement.enterEmailAddress")}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Password
                      </label>
                      <input
                        type="password"
                        value={newEmployee.password}
                        onChange={(e) =>
                          setNewEmployee({
                            ...newEmployee,
                            password: e.target.value,
                          })
                        }
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-400 focus:border-transparent text-sm"
                        placeholder="Enter password"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {t("employeeManagement.role")}
                      </label>
                      <select
                        value={newEmployee.role}
                        onChange={(e) => handleRoleChange(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-400 focus:border-transparent text-sm pr-8"
                      >
                        <option value="">
                          {t("employeeManagement.selectRole")}
                        </option>
                        {roles.map((role, index) => (
                          <option key={index} value={role.name}>
                            {getRoleDisplayName(role.name)}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {t("employeeManagement.department")}
                      </label>
                      <select
                        value={newEmployee.department}
                        onChange={(e) =>
                          setNewEmployee({
                            ...newEmployee,
                            department: e.target.value,
                          })
                        }
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-400 focus:border-transparent text-sm pr-8"
                      >
                        <option value="">
                          {t("employeeManagement.selectDepartment")}
                        </option>
                        <option value="Content Management">
                          {t("employeeManagement.contentManagement")}
                        </option>
                        <option value="Customer Support">
                          {t("employeeManagement.customerSupport")}
                        </option>
                        <option value="Data Analytics">
                          {t("employeeManagement.dataAnalytics")}
                        </option>
                        <option value="IT Operations">
                          {t("employeeManagement.itOperations")}
                        </option>
                        <option value="Marketing">
                          {t("employeeManagement.marketing")}
                        </option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      {t("employeeManagement.permissions")}
                    </label>
                    <div className="space-y-4 max-h-64 overflow-y-auto border border-gray-200 rounded-lg p-4">
                      {Object.entries(permissionsByCategory).map(
                        ([category, permissions]) => (
                          <div key={category}>
                            <h4 className="font-medium text-gray-800 mb-2">
                              {category}
                            </h4>
                            <div className="space-y-2 ml-4">
                              {permissions.map((permission) => (
                                <label
                                  key={permission.id}
                                  className="flex items-center space-x-2"
                                >
                                  <input
                                    type="checkbox"
                                    checked={newEmployee.permissions.includes(
                                      permission.id
                                    )}
                                    onChange={(e) => {
                                      if (e.target.checked) {
                                        setNewEmployee({
                                          ...newEmployee,
                                          permissions: [
                                            ...newEmployee.permissions,
                                            permission.id,
                                          ],
                                        });
                                      } else {
                                        setNewEmployee({
                                          ...newEmployee,
                                          permissions:
                                            newEmployee.permissions.filter(
                                              (p) => p !== permission.id
                                            ),
                                        });
                                      }
                                    }}
                                    className="w-4 h-4 text-red-500 border-gray-300 rounded focus:ring-red-400"
                                  />
                                  <span className="text-sm text-gray-700">
                                    {permission.name}
                                  </span>
                                </label>
                              ))}
                            </div>
                          </div>
                        )
                      )}
                    </div>
                  </div>

                  <div className="flex space-x-3">
                    <button
                      onClick={() => setShowAddEmployee(false)}
                      className="flex-1 px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium text-sm whitespace-nowrap cursor-pointer"
                    >
                      {t("employeeManagement.cancel")}
                    </button>
                    <button
                      onClick={handleAddEmployee}
                      disabled={
                        !newEmployee.name ||
                        !newEmployee.email ||
                        !newEmployee.role
                      }
                      className={`flex-1 px-4 py-2 rounded-lg font-medium text-sm whitespace-nowrap cursor-pointer ${
                        newEmployee.name &&
                        newEmployee.email &&
                        newEmployee.role
                          ? "bg-green-500 text-white hover:bg-green-600"
                          : "bg-gray-300 text-gray-500 cursor-not-allowed"
                      }`}
                    >
                      <i className="ri-add-line mr-2"></i>
                      {t("employeeManagement.addEmployee")}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Edit Employee Modal */}
          {showEditEmployee && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-2xl max-w-2xl w-full max-h-screen overflow-y-auto">
                <div className="p-6 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-800">
                      {t("employeeManagement.editEmployee")}
                    </h3>
                    <button
                      onClick={() => setShowEditEmployee(false)}
                      className="text-gray-400 hover:text-gray-600 cursor-pointer"
                    >
                      <i className="ri-close-line text-xl"></i>
                    </button>
                  </div>
                </div>

                <div className="p-6 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {t("employeeManagement.fullName")}
                      </label>
                      <input
                        type="text"
                        value={editEmployee.name}
                        onChange={(e) =>
                          setEditEmployee({
                            ...editEmployee,
                            name: e.target.value,
                          })
                        }
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-400 focus:border-transparent text-sm"
                        placeholder={t("employeeManagement.enterFullName")}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {t("employeeManagement.emailAddress")}
                      </label>
                      <input
                        type="email"
                        value={editEmployee.email}
                        onChange={(e) =>
                          setEditEmployee({
                            ...editEmployee,
                            email: e.target.value,
                          })
                        }
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-400 focus:border-transparent text-sm"
                        placeholder={t("employeeManagement.enterEmailAddress")}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {t("employeeManagement.role")}
                      </label>
                      <select
                        value={editEmployee.role}
                        onChange={(e) => handleEditRoleChange(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-400 focus:border-transparent text-sm pr-8"
                      >
                        <option value="">
                          {t("employeeManagement.selectRole")}
                        </option>
                        {roles.map((role, index) => (
                          <option key={index} value={role.name}>
                            {getRoleDisplayName(role.name)}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {t("employeeManagement.department")}
                      </label>
                      <select
                        value={editEmployee.department}
                        onChange={(e) =>
                          setEditEmployee({
                            ...editEmployee,
                            department: e.target.value,
                          })
                        }
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-400 focus:border-transparent text-sm pr-8"
                      >
                        <option value="">
                          {t("employeeManagement.selectDepartment")}
                        </option>
                        <option value="Content Management">
                          {t("employeeManagement.contentManagement")}
                        </option>
                        <option value="Customer Support">
                          {t("employeeManagement.customerSupport")}
                        </option>
                        <option value="Data Analytics">
                          {t("employeeManagement.dataAnalytics")}
                        </option>
                        <option value="IT Operations">
                          {t("employeeManagement.itOperations")}
                        </option>
                        <option value="Marketing">
                          {t("employeeManagement.marketing")}
                        </option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      {t("employeeManagement.permissions")}
                    </label>
                    <div className="space-y-4 max-h-64 overflow-y-auto border border-gray-200 rounded-lg p-4">
                      {Object.entries(permissionsByCategory).map(
                        ([category, permissions]) => (
                          <div key={category}>
                            <h4 className="font-medium text-gray-800 mb-2">
                              {category}
                            </h4>
                            <div className="space-y-2 ml-4">
                              {permissions.map((permission) => (
                                <label
                                  key={permission.id}
                                  className="flex items-center space-x-2"
                                >
                                  <input
                                    type="checkbox"
                                    checked={editEmployee.permissions.includes(
                                      permission.id
                                    )}
                                    onChange={(e) => {
                                      if (e.target.checked) {
                                        setEditEmployee({
                                          ...editEmployee,
                                          permissions: [
                                            ...editEmployee.permissions,
                                            permission.id,
                                          ],
                                        });
                                      } else {
                                        setEditEmployee({
                                          ...editEmployee,
                                          permissions:
                                            editEmployee.permissions.filter(
                                              (p) => p !== permission.id
                                            ),
                                        });
                                      }
                                    }}
                                    className="w-4 h-4 text-red-500 border-gray-300 rounded focus:ring-red-400"
                                  />
                                  <span className="text-sm text-gray-700">
                                    {permission.name}
                                  </span>
                                </label>
                              ))}
                            </div>
                          </div>
                        )
                      )}
                    </div>
                  </div>

                  <div className="flex space-x-3">
                    <button
                      onClick={() => setShowEditEmployee(false)}
                      className="flex-1 px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium text-sm whitespace-nowrap cursor-pointer"
                    >
                      {t("employeeManagement.cancel")}
                    </button>
                    <button
                      onClick={saveEditedEmployee}
                      disabled={
                        !editEmployee.name ||
                        !editEmployee.email ||
                        !editEmployee.role
                      }
                      className={`flex-1 px-4 py-2 rounded-lg font-medium text-sm whitespace-nowrap cursor-pointer ${
                        editEmployee.name &&
                        editEmployee.email &&
                        editEmployee.role
                          ? "bg-green-500 text-white hover:bg-green-600"
                          : "bg-gray-300 text-gray-500 cursor-not-allowed"
                      }`}
                    >
                      {t("employeeManagement.saveChanges")}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Employee Details Modal */}
          {selectedEmployee && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-2xl max-w-2xl w-full max-h-screen overflow-y-auto">
                <div className="p-6 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-800">
                      {t("employeeManagement.employeeDetails")}
                    </h3>
                    <button
                      onClick={() => setSelectedEmployee(null)}
                      className="text-gray-400 hover:text-gray-600 cursor-pointer"
                    >
                      <i className="ri-close-line text-xl"></i>
                    </button>
                  </div>
                </div>

                <div className="p-6 space-y-6">
                  <div className="flex items-center space-x-4">
                    <img
                      src={getImageUrl(selectedEmployee.profile_image)}
                      alt={selectedEmployee.name}
                      className="w-16 h-16 rounded-full object-cover"
                    />
                    <div>
                      <h4 className="text-xl font-semibold text-gray-800">
                        {selectedEmployee.name}
                      </h4>
                      <p className="text-gray-600">{selectedEmployee.email}</p>
                      <div className="flex items-center space-x-3 mt-1">
                        <span className="text-sm text-gray-500">
                          {selectedEmployee.role} •{" "}
                          {selectedEmployee.department}
                        </span>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${getStatusColor(
                            selectedEmployee.status
                          )}`}
                        >
                          {getStatusText(selectedEmployee.status)}
                        </span>
                      </div>
                      <div className="mt-2 flex items-center space-x-4 text-sm text-gray-500">
                        <span className="flex items-center">
                          <i className="ri-calendar-line mr-1"></i>
                          Joined:{" "}
                          {new Date(
                            selectedEmployee.created_at
                          ).toLocaleDateString()}
                        </span>
                        {selectedEmployee.last_login_at && (
                          <span className="flex items-center">
                            <i className="ri-time-line mr-1"></i>
                            Last login:{" "}
                            {new Date(
                              selectedEmployee.last_login_at
                            ).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium text-gray-800 mb-3">
                      {t("employeeManagement.permissions")}
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {Object.entries(
                        displayAdminPermissions(selectedEmployee.permissions)
                      ).map(([category, permissions]) => {
                        if (permissions.length === 0) return null;

                        return (
                          <div
                            key={category}
                            className="bg-gray-50 p-4 rounded-lg"
                          >
                            <h5 className="font-medium text-gray-700 mb-2">
                              {category}
                            </h5>
                            <div className="space-y-1">
                              {permissions.map((permission, index) => (
                                <div
                                  key={index}
                                  className="flex items-center space-x-2"
                                >
                                  <i className="ri-check-line text-green-500 text-sm"></i>
                                  <span className="text-sm text-gray-600">
                                    {permission}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
