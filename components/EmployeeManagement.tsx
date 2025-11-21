"use client";

import { useState } from "react";
import { useLanguage } from "../lib/LanguageContext";

type Employee = {
  id: number;
  name: string;
  email: string;
  role: string;
  department: string;
  status: "active" | "away" | "inactive";
  joinDate: string;
  lastActive: string;
  permissions: string[];
  avatar: string;
};
type RoleDef = { name: string; permissions: string[]; description: string };
type PermissionDef = { id: string; name: string; category: string };

export default function EmployeeManagement() {
  const { t } = useLanguage();

  const [showAddEmployee, setShowAddEmployee] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(
    null
  );
  const [newEmployee, setNewEmployee] = useState<{
    name: string;
    email: string;
    role: string;
    department: string;
    permissions: string[];
  }>({
    name: "",
    email: "",
    role: "",
    department: "",
    permissions: [],
  });
  const [showEditEmployee, setShowEditEmployee] = useState(false);
  const [editEmployee, setEditEmployee] = useState<Employee>({
    id: 0,
    name: "",
    email: "",
    role: "",
    department: "",
    permissions: [],
    status: "active",
    joinDate: "",
    lastActive: "",
    avatar: "",
  });

  const [employees, setEmployees] = useState<Employee[]>([
    {
      id: 1,
      name: "Sarah Johnson",
      email: "sarah.johnson@company.com",
      role: "Content Moderator",
      department: "Content Management",
      status: "active",
      joinDate: "2024-01-10",
      lastActive: "2024-01-20",
      permissions: ["content.read", "content.moderate", "content.delete"],
      avatar:
        "https://readdy.ai/api/search-image?query=Professional%20female%20employee%20portrait%2C%20friendly%20smile%2C%20modern%20office%20background%2C%20business%20casual%20attire&width=60&height=60&seq=emp1&orientation=squarish",
    },
    {
      id: 2,
      name: "Michael Chen",
      email: "michael.chen@company.com",
      role: "User Support Manager",
      department: "Customer Support",
      status: "active",
      joinDate: "2024-01-08",
      lastActive: "2024-01-20",
      permissions: [
        "users.read",
        "users.edit",
        "support.manage",
        "reports.view",
      ],
      avatar:
        "https://readdy.ai/api/search-image?query=Professional%20asian%20male%20employee%20portrait%2C%20confident%20expression%2C%20modern%20workplace%2C%20business%20attire&width=60&height=60&seq=emp2&orientation=squarish",
    },
    {
      id: 3,
      name: "Emma Rodriguez",
      email: "emma.rodriguez@company.com",
      role: "Analytics Specialist",
      department: "Data Analytics",
      status: "active",
      joinDate: "2024-01-05",
      lastActive: "2024-01-19",
      permissions: ["analytics.read", "analytics.export", "reports.create"],
      avatar:
        "https://readdy.ai/api/search-image?query=Professional%20latina%20female%20employee%20portrait%2C%20smart%20appearance%2C%20modern%20office%20setting%2C%20professional%20attire&width=60&height=60&seq=emp3&orientation=squarish",
    },
    {
      id: 4,
      name: "James Wilson",
      email: "james.wilson@company.com",
      role: "System Administrator",
      department: "IT Operations",
      status: "away",
      joinDate: "2024-01-03",
      lastActive: "2024-01-18",
      permissions: [
        "system.admin",
        "users.manage",
        "settings.modify",
        "backup.manage",
      ],
      avatar:
        "https://readdy.ai/api/search-image?query=Professional%20male%20IT%20administrator%20portrait%2C%20technical%20background%2C%20confident%20pose%2C%20business%20casual%20attire&width=60&height=60&seq=emp4&orientation=squarish",
    },
  ]);

  const roles: RoleDef[] = [
    {
      name: t("employeeManagement.roles.contentModerator"),
      permissions: ["content.read", "content.moderate", "content.delete"],
      description: "Review and moderate user-generated content",
    },
    {
      name: t("employeeManagement.roles.userSupportManager"),
      permissions: [
        "users.read",
        "users.edit",
        "support.manage",
        "reports.view",
      ],
      description: "Manage customer support and user issues",
    },
    {
      name: t("employeeManagement.roles.analyticsSpecialist"),
      permissions: ["analytics.read", "analytics.export", "reports.create"],
      description: "Analyze data and create reports",
    },
    {
      name: t("employeeManagement.roles.systemAdministrator"),
      permissions: [
        "system.admin",
        "users.manage",
        "settings.modify",
        "backup.manage",
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
    switch (status) {
      case "active":
        return t("employeeManagement.active");
      case "away":
        return t("employeeManagement.away");
      case "inactive":
        return t("employeeManagement.inactive");
      default:
        return status;
    }
  };

  const handleAddEmployee = () => {
    console.log("Adding employee:", newEmployee);
    setShowAddEmployee(false);
    setNewEmployee({
      name: "",
      email: "",
      role: "",
      department: "",
      permissions: [],
    });
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
    setEditEmployee({
      id: emp.id,
      name: emp.name,
      email: emp.email,
      role: emp.role,
      department: emp.department,
      permissions: emp.permissions,
      status: emp.status,
      joinDate: emp.joinDate,
      lastActive: emp.lastActive,
      avatar: emp.avatar,
    });
    setShowEditEmployee(true);
  };

  const handleEditRoleChange = (roleName: string) => {
    const role = roles.find((r: RoleDef) => r.name === roleName);
    if (role) {
      setEditEmployee({
        ...editEmployee,
        role: roleName,
        permissions: role.permissions,
      });
    }
  };

  const saveEditedEmployee = () => {
    if (!editEmployee.name || !editEmployee.email || !editEmployee.role) return;
    setEmployees(
      employees.map((e: Employee) =>
        e.id === editEmployee.id ? { ...e, ...editEmployee } : e
      )
    );
    setShowEditEmployee(false);
  };

  const handleDeleteEmployee = (id: number) => {
    if (!confirm(t("employeeManagement.confirmDelete"))) return;
    setEmployees(employees.filter((e: Employee) => e.id !== id));
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
          className="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 font-medium whitespace-nowrap cursor-pointer"
        >
          <i className="ri-add-line mr-2"></i>
          {t("employeeManagement.addEmployee")}
        </button>
      </div>

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
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <i className="ri-briefcase-line text-purple-600 text-xl"></i>
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-800">
                {roles.length}
              </h3>
              <p className="text-gray-600 text-sm">
                {t("employeeManagement.rolesDefined")}
              </p>
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
                        src={employee.avatar}
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
                    <p className="font-medium text-gray-800">{employee.role}</p>
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
                      {employee.permissions
                        .slice(0, 2)
                        .map((permission, index) => (
                          <span
                            key={index}
                            className="bg-blue-100 text-blue-600 px-2 py-1 rounded text-xs"
                          >
                            {permission.split(".")[1]}
                          </span>
                        ))}
                      {employee.permissions.length > 2 && (
                        <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs">
                          +{employee.permissions.length - 2}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span className="text-sm text-gray-600">
                      {new Date(employee.lastActive).toLocaleDateString()}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => setSelectedEmployee(employee)}
                        className="text-blue-600 hover:text-blue-700 cursor-pointer"
                        title={t("employeeManagement.viewDetails")}
                      >
                        <i className="ri-eye-line"></i>
                      </button>
                      <button
                        onClick={() => openEditEmployee(employee)}
                        className="text-green-600 hover:text-green-700 cursor-pointer"
                        title={t("employeeManagement.editEmployee")}
                      >
                        <i className="ri-edit-line"></i>
                      </button>
                      <button
                        onClick={() => handleDeleteEmployee(employee.id)}
                        className="text-red-600 hover:text-red-700 cursor-pointer"
                        title={t("employeeManagement.removeEmployee")}
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
                      setNewEmployee({ ...newEmployee, name: e.target.value })
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
                      setNewEmployee({ ...newEmployee, email: e.target.value })
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
                    value={newEmployee.role}
                    onChange={(e) => handleRoleChange(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-400 focus:border-transparent text-sm pr-8"
                  >
                    <option value="">
                      {t("employeeManagement.selectRole")}
                    </option>
                    {roles.map((role, index) => (
                      <option key={index} value={role.name}>
                        {role.name}
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
                    !newEmployee.name || !newEmployee.email || !newEmployee.role
                  }
                  className={`flex-1 px-4 py-2 rounded-lg font-medium text-sm whitespace-nowrap cursor-pointer ${
                    newEmployee.name && newEmployee.email && newEmployee.role
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
                      setEditEmployee({ ...editEmployee, name: e.target.value })
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
                        {role.name}
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
                    editEmployee.name && editEmployee.email && editEmployee.role
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
                  src={selectedEmployee.avatar}
                  alt={selectedEmployee.name}
                  className="w-16 h-16 rounded-full object-cover"
                />
                <div>
                  <h4 className="text-xl font-semibold text-gray-800">
                    {selectedEmployee.name}
                  </h4>
                  <p className="text-gray-600">{selectedEmployee.email}</p>
                  <p className="text-sm text-gray-500">
                    {selectedEmployee.role} • {selectedEmployee.department}
                  </p>
                </div>
              </div>

              <div>
                <h4 className="font-medium text-gray-800 mb-3">
                  {t("employeeManagement.permissions")}
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(permissionsByCategory).map(
                    ([category, permissions]) => {
                      const categoryPermissions = permissions.filter((p) =>
                        selectedEmployee.permissions.includes(p.id)
                      );
                      if (categoryPermissions.length === 0) return null;

                      return (
                        <div
                          key={category}
                          className="bg-gray-50 p-4 rounded-lg"
                        >
                          <h5 className="font-medium text-gray-700 mb-2">
                            {category}
                          </h5>
                          <div className="space-y-1">
                            {categoryPermissions.map((permission) => (
                              <div
                                key={permission.id}
                                className="flex items-center space-x-2"
                              >
                                <i className="ri-check-line text-green-500 text-sm"></i>
                                <span className="text-sm text-gray-600">
                                  {permission.name}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    }
                  )}
                </div>
              </div>

              <div className="flex space-x-3">
                <button className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 font-medium text-sm whitespace-nowrap cursor-pointer">
                  <i className="ri-edit-line mr-2"></i>
                  {t("employeeManagement.editEmployee")}
                </button>
                <button className="bg-yellow-500 text-white px-6 py-2 rounded-lg hover:bg-yellow-600 font-medium text-sm whitespace-nowrap cursor-pointer">
                  <i className="ri-lock-line mr-2"></i>
                  {t("employeeManagement.changePermissions")}
                </button>
                <button className="bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600 font-medium text-sm whitespace-nowrap cursor-pointer">
                  <i className="ri-delete-bin-line mr-2"></i>
                  {t("employeeManagement.remove")}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
