"use client";

import { useState, useEffect } from "react";
import { useLanguage } from "../lib/LanguageContext";
import { useAuth } from "../hooks/useAuth";
import { apiService } from "../lib/api";
import { toast } from "react-toastify";
import {
  Supplier,
  SuppliersListResponse,
  UpdateSupplierRequest,
  CreateSupplierRequest,
} from "../lib/types";
import { getAvatarUrl } from "../lib/avatarHelper";

export default function UserManagement() {
  const { t, language } = useLanguage();
  const { user, loading } = useAuth();
  const [permissions, setPermissions] = useState<any>(null);
  const [permissionsLoading, setPermissionsLoading] = useState(true);

  // Fetch permissions when component mounts
  useEffect(() => {
    const fetchPermissions = async () => {
      if (user && (user.role === "admin" || user.role === "super_admin")) {
        try {
          try {
            const data = await apiService.getPermissions();
            setPermissions(data.permissions);
          } catch (apiError) {
            console.error("API Error:", apiError);

            if (user.role === "admin") {
              // For admin users, use basic permissions as fallback
              setPermissions({
                user_management_view: true,
                user_management_edit: false,
                user_management_delete: false,
                user_management_full: false,
                content_management_view: false,
                content_management_supervise: false,
                content_management_delete: false,
                analytics_view: true,
                analytics_export: false,
                reports_view: false,
                reports_create: false,
                system_manage: false,
                system_settings: true,
                system_backups: false,
                support_manage: false,
              });
            } else if (user.role === "super_admin") {
              // For super admin, give all permissions as fallback
              setPermissions({
                user_management_view: true,
                user_management_edit: true,
                user_management_delete: true,
                user_management_full: true,
                content_management_view: true,
                content_management_supervise: true,
                content_management_delete: true,
                analytics_view: true,
                analytics_export: true,
                reports_view: true,
                reports_create: true,
                system_manage: true,
                system_settings: true,
                system_backups: true,
                support_manage: true,
              });
            }
          }
        } catch (error) {
          console.error("Failed to fetch permissions:", error);
        } finally {
          setPermissionsLoading(false);
        }
      } else {
        setPermissionsLoading(false);
      }
    };

    fetchPermissions();
  }, [user]);

  // Permission checking functions
  const hasPermission = (permission: string) => {
    // Super admin has all permissions
    if (user?.role === "super_admin") return true;

    if (!user || !permissions) {
      return false;
    }

    return permissions[permission] === true;
  };

  const canViewUsers =
    hasPermission("user_management_view") ||
    hasPermission("user_management_full");
  const canEditUsers =
    hasPermission("user_management_edit") ||
    hasPermission("user_management_full");
  const canDeleteUsers =
    hasPermission("user_management_delete") ||
    hasPermission("user_management_full");
  const hasFullUserManagement = hasPermission("user_management_full");

  // Check if user has any user management permissions (but not for super admin)
  const hasAnyUserPermissions =
    canViewUsers ||
    canEditUsers ||
    canDeleteUsers ||
    hasFullUserManagement ||
    user?.role === "super_admin";

  const [searchTerm, setSearchTerm] = useState<string>("");
  const [filterStatus, setFilterStatus] = useState<
    "all" | "active" | "suspended" | "pending" | "inactive" | "approved"
  >("all");
  const [filterPlan, setFilterPlan] = useState<"all" | "Basic" | "Premium">(
    "all",
  );
  const [selectedUsers, setSelectedUsers] = useState<number[]>([]);
  const [showUserDetails, setShowUserDetails] = useState<Supplier | null>(null);
  const [showUserModal, setShowUserModal] = useState<boolean>(false);
  const [showEmailModal, setShowEmailModal] = useState<boolean>(false);
  const [emailRecipient, setEmailRecipient] = useState<Supplier | null>(null);
  const [emailForm, setEmailForm] = useState({
    subject: "",
    message: "",
  });
  const [showInquiryModal, setShowInquiryModal] = useState<boolean>(false);
  const [inquiryRecipient, setInquiryRecipient] = useState<Supplier | null>(
    null,
  );
  const [inquiryForm, setInquiryForm] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [editingUser, setEditingUser] = useState<Supplier | null>(null);
  const [userForm, setUserForm] = useState<
    Omit<
      Supplier,
      | "id"
      | "joinDate"
      | "lastActive"
      | "revenue"
      | "profileCompletion"
      | "rating"
      | "reviewsCount"
    > & { password?: string }
  >({
    name: "",
    email: "",
    businessName: "",
    plan: "Basic",
    status: "active",
    avatar: "",
  });

  const [users, setUsers] = useState<Supplier[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    perPage: 15,
    total: 0,
    lastPage: 1,
  });

  // Fetch suppliers from API
  const fetchSuppliers = async () => {
    try {
      setLoadingUsers(true);
      const response: SuppliersListResponse = await apiService.getSuppliers({
        page: pagination.currentPage,
        per_page: pagination.perPage,
      });

      setUsers(response.users);
      setPagination({
        currentPage: response.pagination.currentPage,
        perPage: response.pagination.perPage,
        total: response.pagination.total,
        lastPage: response.pagination.lastPage,
      });
    } catch (error) {
      console.error("Failed to fetch suppliers:", error);
    } finally {
      setLoadingUsers(false);
    }
  };

  // Fetch suppliers when component mounts or filters change
  useEffect(() => {
    if (canViewUsers || user?.role === "super_admin") {
      fetchSuppliers();
    }
  }, [pagination.currentPage, canViewUsers, user?.role]);

  const openAddUser = () => {
    setEditingUser(null);
    setUserForm({
      name: "",
      email: "",
      businessName: "",
      plan: "Basic",
      status: "active",
      avatar: "",
      password: "",
    });
    setShowUserModal(true);
  };

  const openEditUser = (user: Supplier) => {
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

  const saveUser = async () => {
    if (
      !userForm.name.trim() ||
      !userForm.email.trim() ||
      !userForm.businessName.trim() ||
      (!editingUser && !userForm.password?.trim())
    )
      return;

    try {
      if (editingUser) {
        // Update existing supplier
        const updateData: UpdateSupplierRequest = {
          name: userForm.name,
          email: userForm.email,
          businessName: userForm.businessName,
          plan: userForm.plan,
          status: userForm.status,
        };

        await apiService.updateSupplier(editingUser.id, updateData);
        toast.success(t("userManagement.notifications.userUpdated"));
      } else {
        // Create new supplier
        const createData: CreateSupplierRequest = {
          name: userForm.name,
          email: userForm.email,
          businessName: userForm.businessName,
          plan: userForm.plan,
          status: userForm.status,
          password: userForm.password!,
        };

        await apiService.createSupplier(createData);
        toast.success(t("userManagement.notifications.userCreated"));
      }

      // Refresh the suppliers list
      await fetchSuppliers();
      setShowUserModal(false);
      setEditingUser(null);
    } catch (error) {
      console.error("Failed to save supplier:", error);
      toast.error(t("userManagement.notifications.saveError"));
    }
  };

  const exportData = async () => {
    try {
      await apiService.exportSuppliers({
        status: filterStatus === "all" ? undefined : filterStatus,
        plan: filterPlan === "all" ? undefined : filterPlan,
        search: searchTerm || undefined,
      });
      toast.success(t("userManagement.notifications.exportSuccess"));
    } catch (error) {
      console.error("Failed to export suppliers:", error);
      toast.error(t("userManagement.notifications.exportError"));
    }
  };

  const filteredUsers = users.filter((user: Supplier) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.businessName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      filterStatus === "all" || user.status === filterStatus;
    const matchesPlan = filterPlan === "all" || user.plan === filterPlan;
    return matchesSearch && matchesStatus && matchesPlan;
  });

  const getStatusColor = (status: Supplier["status"]) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-600";
      case "suspended":
        return "bg-red-100 text-red-600";
      case "pending":
        return "bg-yellow-100 text-yellow-600";
      case "inactive":
        return "bg-gray-100 text-gray-600";
      case "approved":
        return "bg-green-100 text-green-600";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  const getPlanColor = (plan: Supplier["plan"]) => {
    switch (plan) {
      case "Premium":
        return "bg-blue-100 text-blue-600";
      case "Basic":
        return "bg-green-100 text-green-600";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  const handleUserAction = async (
    action: "edit" | "suspend" | "delete" | "sendEmail" | "sendMessage",
    userId: number,
  ) => {
    const target = users.find((u: Supplier) => u.id === userId);
    if (!target) return;

    try {
      if (action === "edit") {
        openEditUser(target);
      } else if (action === "suspend") {
        const newStatus =
          target.status === "suspended" ? "active" : "suspended";
        await apiService.updateSupplier(userId, { status: newStatus });
        await fetchSuppliers();

        const message =
          newStatus === "suspended"
            ? t("userManagement.notifications.userSuspended")
            : t("userManagement.notifications.userActivated");
        toast.success(message);
      } else if (action === "delete") {
        // Add confirmation for single delete
        if (
          !window.confirm(
            `Are you sure you want to delete ${target.name}? This action cannot be undone.`,
          )
        ) {
          return;
        }
        await apiService.deleteSupplier(userId);
        await fetchSuppliers();
        toast.success(t("userManagement.notifications.userDeleted"));
      } else if (action === "sendEmail") {
        // Open email modal
        setEmailRecipient(target);
        setEmailForm({ subject: "", message: "" });
        setShowEmailModal(true);
      } else if (action === "sendMessage") {
        // Open inquiry modal
        setInquiryRecipient(target);
        setInquiryForm({
          name: "Admin",
          email: user?.email || "admin@supplier.sa",
          phone: "",
          subject: "",
          message: "",
        });
        setShowInquiryModal(true);
      }
    } catch (error) {
      console.error(`Failed to ${action} supplier:`, error);
      toast.error(t("userManagement.notifications.actionError"));
    }
  };

  const sendEmail = async () => {
    if (
      !emailRecipient ||
      !emailForm.subject.trim() ||
      !emailForm.message.trim()
    ) {
      toast.error(
        language === "ar"
          ? "يرجى ملء جميع حقول البريد الإلكتروني"
          : "Please fill in all email fields",
      );
      return;
    }

    try {
      const response = await apiService.sendEmail({
        to: emailRecipient.email,
        subject: emailForm.subject,
        message: emailForm.message,
      });

      toast.success(
        language === "ar"
          ? `تم إرسال البريد الإلكتروني بنجاح إلى ${emailRecipient.name}`
          : `Email sent successfully to ${emailRecipient.name}`,
      );
      setShowEmailModal(false);
      setEmailRecipient(null);
      setEmailForm({ subject: "", message: "" });
    } catch (error: any) {
      console.error("Failed to send email:", error);

      // Handle validation errors
      if (error.message && typeof error.message === "object") {
        const errorMessages = Object.values(error.message).flat();
        toast.error(errorMessages.join(", "));
      } else {
        toast.error(
          language === "ar"
            ? "فشل في إرسال البريد الإلكتروني"
            : "Failed to send email",
        );
      }
    }
  };

  const handleBulkAction = async (
    action: "suspend" | "delete" | "sendEmail",
  ) => {
    if (selectedUsers.length === 0) return;

    if (action === "sendEmail") {
      // Open bulk email modal
      setEmailRecipient(null); // Clear single recipient
      setEmailForm({ subject: "", message: "" });
      setShowEmailModal(true);
      return;
    }

    // Show confirmation
    const confirmMessage =
      action === "delete"
        ? language === "ar"
          ? `هل أنت متأكد من حذف ${selectedUsers.length} مستخدم؟`
          : `Are you sure you want to delete ${selectedUsers.length} user(s)? This action cannot be undone.`
        : language === "ar"
          ? `هل أنت متأكد من تعليق ${selectedUsers.length} مستخدم؟`
          : `Are you sure you want to suspend ${selectedUsers.length} user(s)?`;

    if (!window.confirm(confirmMessage)) {
      return;
    }

    try {
      if (action === "delete") {
        // Delete suppliers one by one
        await Promise.all(
          selectedUsers.map((userId) => apiService.deleteSupplier(userId)),
        );
        toast.success(
          language === "ar"
            ? `تم حذف ${selectedUsers.length} مستخدم بنجاح`
            : `Deleted ${selectedUsers.length} user(s) successfully`,
        );
      } else if (action === "suspend") {
        // Suspend suppliers one by one
        await Promise.all(
          selectedUsers.map((userId) =>
            apiService.updateSupplier(userId, { status: "suspended" }),
          ),
        );
        toast.success(
          language === "ar"
            ? `تم تعليق ${selectedUsers.length} مستخدم بنجاح`
            : `Suspended ${selectedUsers.length} user(s) successfully`,
        );
      }

      setSelectedUsers([]);
      await fetchSuppliers();
    } catch (error) {
      console.error(`Failed to ${action} suppliers:`, error);
      toast.error(
        language === "ar" ? "فشل في تنفيذ الإجراء" : "Failed to perform action",
      );
    }
  };

  const sendInquiry = async () => {
    if (
      !inquiryRecipient ||
      !inquiryForm.email.trim() ||
      !inquiryForm.subject.trim() ||
      !inquiryForm.message.trim()
    ) {
      toast.error(
        language === "ar"
          ? "يرجى ملء جميع حقول الاستفسار"
          : "Please fill in all inquiry fields",
      );
      return;
    }

    try {
      await apiService.createInquiry({
        receiver_id: inquiryRecipient.id,
        name: "Admin",
        email: inquiryForm.email,
        phone: "",
        subject: inquiryForm.subject,
        message: inquiryForm.message,
      });

      toast.success(
        language === "ar"
          ? `تم إرسال الاستفسار بنجاح إلى ${inquiryRecipient.name}`
          : `Inquiry sent successfully to ${inquiryRecipient.name}`,
      );
      setShowInquiryModal(false);
      setInquiryRecipient(null);
      setInquiryForm({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
      });
    } catch (error: any) {
      console.error("Failed to send inquiry:", error);

      // Handle validation errors
      if (error.message && typeof error.message === "object") {
        const errorMessages = Object.values(error.message).flat();
        toast.error(errorMessages.join(", "));
      } else {
        toast.error(
          language === "ar"
            ? "فشل في إرسال الاستفسار"
            : "Failed to send inquiry",
        );
      }
    }
  };

  const sendBulkEmail = async () => {
    if (!emailForm.subject.trim() || !emailForm.message.trim()) {
      toast.error(
        language === "ar"
          ? "يرجى ملء جميع حقول البريد الإلكتروني"
          : "Please fill in all email fields",
      );
      return;
    }

    if (selectedUsers.length === 0) {
      toast.error(
        language === "ar"
          ? "يرجى تحديد مستخدمين على الأقل"
          : "Please select at least one user",
      );
      return;
    }

    try {
      const selectedUsersData = users.filter((user) =>
        selectedUsers.includes(user.id),
      );
      const recipients = selectedUsersData.map((user) => user.email);

      const response = await apiService.sendBulkEmail({
        recipients,
        subject: emailForm.subject,
        message: emailForm.message,
      });

      const successMessage =
        language === "ar"
          ? `تم إرسال البريد الإلكتروني بنجاح إلى ${response.sent_count} من ${response.total_recipients} مستخدم`
          : `Email sent successfully to ${response.sent_count} of ${response.total_recipients} users`;

      toast.success(successMessage);

      if (response.failed_count > 0) {
        const failedEmails =
          response.failed_recipients?.map((r: any) => r.email).join(", ") || "";
        const failedMessage =
          language === "ar"
            ? `فشل الإرسال إلى: ${failedEmails}`
            : `Failed to send to: ${failedEmails}`;
        toast.warning(failedMessage);
      }

      setShowEmailModal(false);
      setEmailRecipient(null);
      setEmailForm({ subject: "", message: "" });
      setSelectedUsers([]);
    } catch (error: any) {
      console.error("Failed to send bulk email:", error);

      // Handle validation errors
      if (error.message && typeof error.message === "object") {
        const errorMessages = Object.values(error.message).flat();
        toast.error(errorMessages.join(", "));
      } else {
        toast.error(
          language === "ar"
            ? "فشل في إرسال البريد الإلكتروني الجماعي"
            : "Failed to send bulk email",
        );
      }
    }
  };

  // Show loading state while user or permissions are being fetched
  if (loading || permissionsLoading || loadingUsers) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto mb-4"></div>
          <h3 className="text-xl font-semibold text-gray-600 mb-2">
            {language === "ar" ? "جاري التحميل..." : "Loading..."}
          </h3>
        </div>
      </div>
    );
  }

  // If user cannot view users, show access denied
  if (!canViewUsers && user?.role !== "super_admin") {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <div className="text-center">
          <i className="ri-lock-line text-6xl text-gray-300 mb-4"></i>
          <h3 className="text-xl font-semibold text-gray-600 mb-2">
            {language === "ar" ? "ممنوع الدخول" : "Access Denied"}
          </h3>
          <p className="text-gray-500">
            {language === "ar"
              ? "ليس لديك صلاحية الوصول إلى إدارة المستخدمين"
              : "You don't have permission to access User Management"}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-800">
          {language === "ar" ? "إدارة المستخدمين" : "User Management"}
        </h2>
        <div className="flex flex-col sm:flex-row gap-3">
          {selectedUsers.length > 0 && (
            <div className="flex gap-2">
              <button
                onClick={() => handleBulkAction("sendEmail")}
                disabled={selectedUsers.length === 0}
                className={`px-4 py-2 rounded-lg font-medium text-sm whitespace-nowrap cursor-pointer ${
                  selectedUsers.length > 0
                    ? "bg-purple-500 text-white hover:bg-purple-600"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
                title={
                  selectedUsers.length > 0
                    ? language === "ar"
                      ? `إرسال بريد إلكتروني إلى ${selectedUsers.length} مستخدم`
                      : `Send email to ${selectedUsers.length} user(s)`
                    : language === "ar"
                      ? "يرجى تحديد مستخدمين أولاً"
                      : "Please select users first"
                }
              >
                <i className="ri-mail-send-line mr-2"></i>
                {language === "ar"
                  ? `إرسال بريد (${selectedUsers.length})`
                  : `Send Email (${selectedUsers.length})`}
              </button>
              <button
                onClick={() => handleBulkAction("suspend")}
                disabled={!(canEditUsers || hasFullUserManagement)}
                className={`px-4 py-2 rounded-lg font-medium text-sm whitespace-nowrap cursor-pointer ${
                  canEditUsers || hasFullUserManagement
                    ? "bg-yellow-500 text-white hover:bg-yellow-600"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
                title={
                  canEditUsers || hasFullUserManagement
                    ? language === "ar"
                      ? `تعليق ${selectedUsers.length} مستخدم`
                      : `Suspend ${selectedUsers.length} user(s)`
                    : language === "ar"
                      ? "ليس لديك صلاحية تعليق المستخدمين"
                      : "You need Edit Users or Full User Management permission to suspend users"
                }
              >
                <i className="ri-pause-circle-line mr-2"></i>
                {language === "ar"
                  ? `تعليق (${selectedUsers.length})`
                  : `Suspend (${selectedUsers.length})`}
              </button>
              <button
                onClick={() => handleBulkAction("delete")}
                disabled={!(canDeleteUsers || hasFullUserManagement)}
                className={`px-4 py-2 rounded-lg font-medium text-sm whitespace-nowrap cursor-pointer ${
                  canDeleteUsers || hasFullUserManagement
                    ? "bg-red-500 text-white hover:bg-red-600"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
                title={
                  canDeleteUsers || hasFullUserManagement
                    ? language === "ar"
                      ? `حذف ${selectedUsers.length} مستخدم`
                      : `Delete ${selectedUsers.length} user(s)`
                    : language === "ar"
                      ? "ليس لديك صلاحية حذف المستخدمين"
                      : "You need Delete Users or Full User Management permission to delete users"
                }
              >
                <i className="ri-delete-bin-line mr-2"></i>
                {language === "ar"
                  ? `حذف (${selectedUsers.length})`
                  : `Delete (${selectedUsers.length})`}
              </button>
            </div>
          )}
          <button
            onClick={hasFullUserManagement ? openAddUser : undefined}
            disabled={!hasFullUserManagement}
            className={`px-4 sm:px-6 py-2 rounded-lg font-medium text-sm whitespace-nowrap cursor-pointer ${
              hasFullUserManagement
                ? "bg-green-500 text-white hover:bg-green-600"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
            title={
              hasFullUserManagement
                ? language === "ar"
                  ? "إضافة مستخدم"
                  : "Add User"
                : language === "ar"
                  ? "ليس لديك صلاحية إضافة المستخدمين"
                  : "You need Full User Management permission to add users"
            }
          >
            <i className="ri-add-line mr-2"></i>
            {language === "ar" ? "إضافة مستخدم" : "Add User"}
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-100">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {language === "ar" ? "بحث المستخدمين" : "Search Users"}
            </label>
            <div className="relative">
              <i className="ri-search-line absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder={
                  language === "ar" ? "بحث المستخدمين..." : "Search users..."
                }
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-400 focus:border-transparent text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {language === "ar" ? "الحالة" : "Status"}
            </label>
            <select
              value={filterStatus}
              onChange={(e) =>
                setFilterStatus(
                  e.target.value as
                    | "all"
                    | "active"
                    | "suspended"
                    | "pending"
                    | "inactive"
                    | "approved",
                )
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-400 focus:border-transparent text-sm"
            >
              <option value="all">
                {language === "ar" ? "جميع الحالات" : "All Status"}
              </option>
              <option value="active">
                {language === "ar" ? "نشط" : "Active"}
              </option>
              <option value="suspended">
                {language === "ar" ? "معلق" : "Suspended"}
              </option>
              <option value="pending">
                {language === "ar" ? "قيد الانتظار" : "Pending"}
              </option>
              <option value="inactive">
                {language === "ar" ? "غير نشط" : "Inactive"}
              </option>
              <option value="approved">
                {language === "ar" ? "معتمد" : "Approved"}
              </option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {language === "ar" ? "الخطة" : "Plan"}
            </label>
            <select
              value={filterPlan}
              onChange={(e) =>
                setFilterPlan(e.target.value as "all" | "Basic" | "Premium")
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-400 focus:border-transparent text-sm"
            >
              <option value="all">
                {language === "ar" ? "جميع الخطط" : "All Plans"}
              </option>
              <option value="Basic">
                {language === "ar" ? "أساسي" : "Basic"}
              </option>
              <option value="Premium">
                {language === "ar" ? "متميز" : "Premium"}
              </option>
            </select>
          </div>

          <div className="flex items-end">
            <button
              onClick={hasFullUserManagement ? exportData : undefined}
              disabled={!hasFullUserManagement}
              className={`w-full px-4 py-2 rounded-lg font-medium text-sm whitespace-nowrap cursor-pointer ${
                hasFullUserManagement
                  ? "bg-gray-500 text-white hover:bg-gray-600"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
              title={
                hasFullUserManagement
                  ? language === "ar"
                    ? "تصدير البيانات"
                    : "Export Data"
                  : language === "ar"
                    ? "ليس لديك صلاحية تصدير البيانات"
                    : "You need Full User Management permission to export data"
              }
            >
              <i className="ri-download-line mr-2"></i>
              {language === "ar" ? "تصدير البيانات" : "Export Data"}
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
                    className="w-4 h-4 text-red-500 border-gray-300 rounded focus:ring-2 focus:ring-red-400"
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
                  {language === "ar" ? "المستخدم" : "User"}
                </th>
                <th className="text-left py-3 px-4 sm:px-6 text-sm font-medium text-gray-700">
                  {language === "ar" ? "العمل التجاري" : "Business"}
                </th>
                <th className="text-left py-3 px-4 sm:px-6 text-sm font-medium text-gray-700">
                  {language === "ar" ? "الخطة" : "Plan"}
                </th>
                <th className="text-left py-3 px-4 sm:px-6 text-sm font-medium text-gray-700">
                  {language === "ar" ? "الحالة" : "Status"}
                </th>
                <th className="text-left py-3 px-4 sm:px-6 text-sm font-medium text-gray-700">
                  {language === "ar" ? "الإيرادات" : "Revenue"}
                </th>
                <th className="text-left py-3 px-4 sm:px-6 text-sm font-medium text-gray-700">
                  {language === "ar" ? "آخر نشاط" : "Last Active"}
                </th>
                <th className="text-left py-3 px-4 sm:px-6 text-sm font-medium text-gray-700">
                  {language === "ar" ? "الإجراءات" : "Actions"}
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
                            selectedUsers.filter((id) => id !== user.id),
                          );
                        }
                      }}
                      className="w-4 h-4 text-red-500 border-gray-300 rounded focus:ring-2 focus:ring-red-400"
                    />
                  </td>
                  <td className="py-4 px-4 sm:px-6">
                    <div className="flex items-center space-x-3">
                      <div className="relative flex-shrink-0">
                        <img
                          src={getAvatarUrl(user.avatar, user.name)}
                          alt={user.name}
                          className="w-8 h-8 sm:w-10 sm:h-10 rounded-full object-cover border border-gray-200"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = "/placeholder-avatar.jpg";
                          }}
                        />
                        <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-green-500 border border-white rounded-full"></div>
                      </div>
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
                        user.plan,
                      )}`}
                    >
                      {user.plan}
                    </span>
                  </td>
                  <td className="py-4 px-4 sm:px-6">
                    <span
                      className={`px-2 sm:px-3 py-1 rounded-full text-xs font-medium capitalize ${getStatusColor(
                        user.status,
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
                        title={
                          language === "ar" ? "عرض التفاصيل" : "View Details"
                        }
                      >
                        <i className="ri-eye-line text-sm sm:text-base"></i>
                      </button>
                      <button
                        onClick={() => handleUserAction("sendEmail", user.id)}
                        className="text-purple-600 hover:text-purple-700 cursor-pointer"
                        title="Send Email"
                      >
                        <i className="ri-mail-send-line text-sm sm:text-base"></i>
                      </button>
                      <button
                        onClick={() => handleUserAction("sendMessage", user.id)}
                        className="text-indigo-600 hover:text-indigo-700 cursor-pointer"
                        title="Send Message"
                      >
                        <i className="ri-message-3-line text-sm sm:text-base"></i>
                      </button>
                      <button
                        onClick={() => handleUserAction("edit", user.id)}
                        disabled={!(canEditUsers || hasFullUserManagement)}
                        className={`text-sm sm:text-base cursor-pointer ${
                          canEditUsers || hasFullUserManagement
                            ? "text-green-600 hover:text-green-700"
                            : "text-gray-400 cursor-not-allowed"
                        }`}
                        title={
                          canEditUsers || hasFullUserManagement
                            ? language === "ar"
                              ? "تعديل المستخدم"
                              : "Edit User"
                            : language === "ar"
                              ? "ليس لديك صلاحية تعديل المستخدمين"
                              : "You need Edit Users or Full User Management permission to edit users"
                        }
                      >
                        <i className="ri-edit-line text-sm sm:text-base"></i>
                      </button>
                      <button
                        onClick={() => handleUserAction("suspend", user.id)}
                        disabled={!(canEditUsers || hasFullUserManagement)}
                        className={`text-sm sm:text-base cursor-pointer ${
                          canEditUsers || hasFullUserManagement
                            ? "text-yellow-600 hover:text-yellow-700"
                            : "text-gray-400 cursor-not-allowed"
                        }`}
                        title={
                          canEditUsers || hasFullUserManagement
                            ? language === "ar"
                              ? "تعليق المستخدم"
                              : "Suspend User"
                            : language === "ar"
                              ? "ليس لديك صلاحية تعليق المستخدمين"
                              : "You need Edit Users or Full User Management permission to suspend users"
                        }
                      >
                        <i className="ri-pause-circle-line text-sm sm:text-base"></i>
                      </button>
                      <button
                        onClick={() => handleUserAction("delete", user.id)}
                        disabled={!(canDeleteUsers || hasFullUserManagement)}
                        className={`text-sm sm:text-base cursor-pointer ${
                          canDeleteUsers || hasFullUserManagement
                            ? "text-red-600 hover:text-red-700"
                            : "text-gray-400 cursor-not-allowed"
                        }`}
                        title={
                          canDeleteUsers || hasFullUserManagement
                            ? language === "ar"
                              ? "حذف المستخدم"
                              : "Delete User"
                            : language === "ar"
                              ? "ليس لديك صلاحية حذف المستخدمين"
                              : "You need Delete Users or Full User Management permission to delete users"
                        }
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
              {language === "ar"
                ? `عرض ${filteredUsers.length} من ${pagination.total} مستخدم`
                : `Showing ${filteredUsers.length} of ${pagination.total} users`}
            </div>
            <div className="flex items-center space-x-2">
              <button className="px-3 py-1 border border-gray-300 rounded text-xs sm:text-sm hover:bg-gray-100 cursor-pointer">
                {language === "ar" ? "السابق" : "Previous"}
              </button>
              <button className="px-3 py-1 bg-red-500 text-white rounded text-xs sm:text-sm">
                1
              </button>
              <button className="px-3 py-1 border border-gray-300 rounded text-xs sm:text-sm hover:bg-gray-100 cursor-pointer">
                2
              </button>
              <button className="px-3 py-1 border border-gray-300 rounded text-xs sm:text-sm hover:bg-gray-100 cursor-pointer">
                {language === "ar" ? "التالي" : "Next"}
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
                  {language === "ar" ? "تفاصيل المستخدم" : "User Details"}
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
                <div className="relative flex-shrink-0">
                  <img
                    src={getAvatarUrl(
                      showUserDetails.avatar,
                      showUserDetails.name,
                    )}
                    alt={showUserDetails.name}
                    className="w-16 h-16 sm:w-20 sm:h-20 rounded-full object-cover border-2 border-gray-200 shadow-sm"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = "/placeholder-avatar.jpg";
                    }}
                  />
                  <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 border-4 border-white rounded-full shadow-sm"></div>
                </div>
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
                    {language === "ar" ? "الخطة" : "Plan"}
                  </label>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${getPlanColor(
                      showUserDetails.plan,
                    )}`}
                  >
                    {showUserDetails.plan}
                  </span>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {language === "ar" ? "الحالة" : "Status"}
                  </label>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium capitalize ${getStatusColor(
                      showUserDetails.status,
                    )}`}
                  >
                    {showUserDetails.status}
                  </span>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {language === "ar" ? "تاريخ الانضمام" : "Join Date"}
                  </label>
                  <p className="text-gray-800 text-sm sm:text-base">
                    {new Date(showUserDetails.joinDate).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {language === "ar" ? "الإيرادات" : "Revenue"}
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
                  {language === "ar" ? "تعديل المستخدم" : "Edit User"}
                </button>
                <button
                  onClick={() => {
                    handleUserAction("suspend", showUserDetails.id);
                    setShowUserDetails(null);
                  }}
                  className="bg-yellow-500 text-white px-4 sm:px-6 py-2 rounded-lg hover:bg-yellow-600 font-medium text-sm whitespace-nowrap cursor-pointer"
                >
                  <i className="ri-pause-circle-line mr-2"></i>
                  {language === "ar" ? "تعليق المستخدم" : "Suspend User"}
                </button>
                <button
                  onClick={() => {
                    handleUserAction("delete", showUserDetails.id);
                    setShowUserDetails(null);
                  }}
                  className="bg-red-500 text-white px-4 sm:px-6 py-2 rounded-lg hover:bg-red-600 font-medium text-sm whitespace-nowrap cursor-pointer"
                >
                  <i className="ri-delete-bin-line mr-2"></i>
                  {language === "ar" ? "حذف المستخدم" : "Delete User"}
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
                  ? language === "ar"
                    ? "تعديل المستخدم"
                    : "Edit User"
                  : language === "ar"
                    ? "إضافة مستخدم"
                    : "Add User"}
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
                  {language === "ar" ? "الاسم" : "Name"}
                </label>
                <input
                  type="text"
                  value={userForm.name}
                  onChange={(e) =>
                    setUserForm({ ...userForm, name: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-400 focus:border-transparent text-sm"
                  placeholder={language === "ar" ? "الاسم" : "Name"}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {language === "ar" ? "البريد الإلكتروني" : "Email"}
                </label>
                <input
                  type="email"
                  value={userForm.email}
                  onChange={(e) =>
                    setUserForm({ ...userForm, email: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-400 focus:border-transparent text-sm"
                  placeholder={
                    language === "ar" ? "البريد الإلكتروني" : "Email"
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {language === "ar" ? "اسم العمل التجاري" : "Business Name"}
                </label>
                <input
                  type="text"
                  value={userForm.businessName}
                  onChange={(e) =>
                    setUserForm({ ...userForm, businessName: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-400 focus:border-transparent text-sm"
                  placeholder={
                    language === "ar" ? "اسم العمل التجاري" : "Business Name"
                  }
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {language === "ar" ? "الخطة" : "Plan"}
                  </label>
                  <select
                    value={userForm.plan}
                    onChange={(e) =>
                      setUserForm({
                        ...userForm,
                        plan: e.target.value as Supplier["plan"],
                      })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-400 focus:border-transparent text-sm"
                  >
                    <option value="Basic">
                      {language === "ar" ? "أساسي" : "Basic"}
                    </option>
                    <option value="Premium">
                      {language === "ar" ? "متميز" : "Premium"}
                    </option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {language === "ar" ? "الحالة" : "Status"}
                  </label>
                  <select
                    value={userForm.status}
                    onChange={(e) =>
                      setUserForm({
                        ...userForm,
                        status: e.target.value as Supplier["status"],
                      })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-400 focus:border-transparent text-sm"
                  >
                    <option value="active">
                      {language === "ar" ? "نشط" : "Active"}
                    </option>
                    <option value="pending">
                      {language === "ar" ? "قيد الانتظار" : "Pending"}
                    </option>
                    <option value="suspended">
                      {language === "ar" ? "معلق" : "Suspended"}
                    </option>
                    <option value="inactive">
                      {language === "ar" ? "غير نشط" : "Inactive"}
                    </option>
                  </select>
                </div>
              </div>
              {!editingUser && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {language === "ar" ? "كلمة المرور" : "Password"}
                  </label>
                  <input
                    type="password"
                    value={userForm.password || ""}
                    onChange={(e) =>
                      setUserForm({ ...userForm, password: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-400 focus:border-transparent text-sm"
                    placeholder={language === "ar" ? "كلمة المرور" : "Password"}
                  />
                </div>
              )}
            </div>
            <div className="p-4 sm:p-6 border-t border-gray-200 flex flex-col sm:flex-row justify-end gap-3">
              <button
                onClick={() => {
                  setShowUserModal(false);
                  setEditingUser(null);
                }}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium text-sm whitespace-nowrap cursor-pointer order-2 sm:order-1"
              >
                {language === "ar" ? "إلغاء" : "Cancel"}
              </button>
              <button
                onClick={saveUser}
                disabled={
                  !userForm.name.trim() ||
                  !userForm.email.trim() ||
                  !userForm.businessName.trim() ||
                  (!editingUser && !userForm.password?.trim())
                }
                className={`px-6 py-2 rounded-lg font-medium text-sm whitespace-nowrap cursor-pointer transition-all order-1 sm:order-2 ${
                  userForm.name.trim() &&
                  userForm.email.trim() &&
                  userForm.businessName.trim() &&
                  (editingUser || userForm.password?.trim())
                    ? "bg-red-500 text-white hover:bg-red-600"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
              >
                {language === "ar" ? "حفظ" : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Email Modal */}
      {showEmailModal && (emailRecipient || selectedUsers.length > 0) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full max-h-screen overflow-y-auto">
            <div className="p-4 sm:p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-800">
                  {emailRecipient
                    ? language === "ar"
                      ? `إرسال بريد إلكتروني إلى ${emailRecipient.name}`
                      : `Send Email to ${emailRecipient.name}`
                    : language === "ar"
                      ? `إرسال بريد إلكتروني إلى ${selectedUsers.length} مستخدم`
                      : `Send Email to ${selectedUsers.length} user(s)`}
                </h3>
                <button
                  onClick={() => {
                    setShowEmailModal(false);
                    setEmailRecipient(null);
                    setEmailForm({ subject: "", message: "" });
                  }}
                  className="text-gray-400 hover:text-gray-600 cursor-pointer"
                >
                  <i className="ri-close-line text-xl"></i>
                </button>
              </div>
            </div>

            <div className="p-4 sm:p-6">
              {emailRecipient ? (
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {language === "ar" ? "إلى" : "To"}
                  </label>
                  <input
                    type="email"
                    value={emailRecipient.email}
                    disabled
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-600 text-sm"
                  />
                </div>
              ) : (
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {language === "ar" ? "المستلمون" : "Recipients"}
                  </label>
                  <div className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-600 text-sm">
                    {selectedUsers.length}{" "}
                    {language === "ar" ? "مستخدم محدد" : "selected users"}
                  </div>
                </div>
              )}

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {language === "ar" ? "الموضوع" : "Subject"}
                </label>
                <input
                  type="text"
                  value={emailForm.subject}
                  onChange={(e) =>
                    setEmailForm({ ...emailForm, subject: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-400 focus:border-transparent text-sm"
                  placeholder={
                    language === "ar"
                      ? "أدخل موضوع البريد الإلكتروني"
                      : "Enter email subject"
                  }
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {language === "ar" ? "الرسالة" : "Message"}
                </label>
                <textarea
                  value={emailForm.message}
                  onChange={(e) =>
                    setEmailForm({ ...emailForm, message: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-400 focus:border-transparent text-sm resize-none"
                  rows={6}
                  placeholder={
                    language === "ar"
                      ? "اكتب رسالتك هنا..."
                      : "Type your message here..."
                  }
                />
              </div>
            </div>

            <div className="p-4 sm:p-6 border-t border-gray-200 flex flex-col sm:flex-row justify-end gap-3">
              <button
                onClick={() => {
                  setShowEmailModal(false);
                  setEmailRecipient(null);
                  setEmailForm({ subject: "", message: "" });
                }}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium text-sm whitespace-nowrap cursor-pointer order-2 sm:order-1"
              >
                {language === "ar" ? "إلغاء" : "Cancel"}
              </button>
              <button
                onClick={emailRecipient ? sendEmail : sendBulkEmail}
                disabled={
                  !emailForm.subject.trim() || !emailForm.message.trim()
                }
                className={`px-6 py-2 rounded-lg font-medium text-sm whitespace-nowrap cursor-pointer transition-all order-1 sm:order-2 ${
                  emailForm.subject.trim() && emailForm.message.trim()
                    ? "bg-red-500 text-white hover:bg-red-600"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
              >
                {language === "ar" ? "إرسال البريد الإلكتروني" : "Send Email"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Inquiry Modal */}
      {showInquiryModal && inquiryRecipient && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full max-h-screen overflow-y-auto">
            <div className="p-4 sm:p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-800">
                  {language === "ar"
                    ? `إرسال استفسار إلى ${inquiryRecipient.name}`
                    : `Send Inquiry to ${inquiryRecipient.name}`}
                </h3>
                <button
                  onClick={() => {
                    setShowInquiryModal(false);
                    setInquiryRecipient(null);
                    setInquiryForm({
                      name: "",
                      email: "",
                      phone: "",
                      subject: "",
                      message: "",
                    });
                  }}
                  className="text-gray-400 hover:text-gray-600 cursor-pointer"
                >
                  <i className="ri-close-line text-xl"></i>
                </button>
              </div>
            </div>

            <div className="p-4 sm:p-6">
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {language === "ar" ? "إلى" : "To"}
                </label>
                <input
                  type="text"
                  value={`${inquiryRecipient.name} (${inquiryRecipient.email})`}
                  disabled
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-600 text-sm"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {language === "ar" ? "بريدك الإلكتروني" : "Your Email"}
                </label>
                <input
                  type="email"
                  value={inquiryForm.email}
                  onChange={(e) =>
                    setInquiryForm({ ...inquiryForm, email: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-400 focus:border-transparent text-sm"
                  placeholder={
                    language === "ar"
                      ? "أدخل بريدك الإلكتروني"
                      : "Enter your email"
                  }
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {language === "ar" ? "الموضوع" : "Subject"}
                </label>
                <input
                  type="text"
                  value={inquiryForm.subject}
                  onChange={(e) =>
                    setInquiryForm({ ...inquiryForm, subject: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-400 focus:border-transparent text-sm"
                  placeholder={
                    language === "ar"
                      ? "أدخل موضوع الاستفسار"
                      : "Enter inquiry subject"
                  }
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {language === "ar" ? "الرسالة" : "Message"}
                </label>
                <textarea
                  value={inquiryForm.message}
                  onChange={(e) =>
                    setInquiryForm({ ...inquiryForm, message: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-400 focus:border-transparent text-sm resize-none"
                  rows={6}
                  placeholder={
                    language === "ar"
                      ? "اكتب رسالتك هنا..."
                      : "Type your message here..."
                  }
                />
              </div>
            </div>

            <div className="p-4 sm:p-6 border-t border-gray-200 flex flex-col sm:flex-row justify-end gap-3">
              <button
                onClick={() => {
                  setShowInquiryModal(false);
                  setInquiryRecipient(null);
                  setInquiryForm({
                    name: "",
                    email: "",
                    phone: "",
                    subject: "",
                    message: "",
                  });
                }}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium text-sm whitespace-nowrap cursor-pointer order-2 sm:order-1"
              >
                {language === "ar" ? "إلغاء" : "Cancel"}
              </button>
              <button
                onClick={sendInquiry}
                disabled={
                  !inquiryForm.email.trim() ||
                  !inquiryForm.subject.trim() ||
                  !inquiryForm.message.trim()
                }
                className={`px-6 py-2 rounded-lg font-medium text-sm whitespace-nowrap cursor-pointer transition-all order-1 sm:order-2 ${
                  inquiryForm.email.trim() &&
                  inquiryForm.subject.trim() &&
                  inquiryForm.message.trim()
                    ? "bg-red-500 text-white hover:bg-red-600"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
              >
                {language === "ar" ? "إرسال الاستفسار" : "Send Inquiry"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
