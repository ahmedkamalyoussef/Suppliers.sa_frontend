"use client";

import { useState, useEffect } from "react";
import { useLanguage } from "@/lib/LanguageContext";
import { useAuth } from "@/hooks/useAuth";

interface Business {
  id: number;
  name: string;
  owner: string;
  category: string;
  status: string;
  crStatus: string;
  views: number;
  createdDate: string;
}

interface Review {
  id: number;
  businessName: string;
  customerName: string;
  rating: number;
  reviewText: string;
  submissionDate: string;
  status: string;
  flagged: boolean;
}

interface DocumentVerification {
  id: number;
  businessName: string;
  ownerName: string;
  documentType: string;
  crNumber: string;
  uploadDate: string;
  issueDate: string;
  expiryDate: string;
  status: string;
  reviewer: string | null;
  notes: string | null;
}

interface ReportedContent {
  id: number;
  business: string;
  type: string;
  reportedBy: string;
  reportDate: string;
  reason: string;
  content: string;
  status: string;
}

interface Tab {
  id: string;
  name: string;
  icon: string;
}

export default function ContentManagement() {
  const { t } = useLanguage();
  const { user } = useAuth();
  
  const [accessDenied, setAccessDenied] = useState<boolean>(false);
  const [permissions, setPermissions] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<string>("businesses");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [pendingReviews, setPendingReviews] = useState<Review[]>([]);
  const [documentVerifications, setDocumentVerifications] = useState<
    DocumentVerification[]
  >([]);
  const [reportedContent, setReportedContent] = useState<ReportedContent[]>([]);
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);
  const [showEditBusiness, setShowEditBusiness] = useState<boolean>(false);
  const [editingBusiness, setEditingBusiness] = useState<Business | null>(null);

  useEffect(() => {
    const fetchPermissions = async () => {
      try {
        const { apiService } = await import("@/lib/api");
        const data = await apiService.getPermissions();
        setPermissions(data.permissions);
        
        // Check if all content management permissions are false
        const allContentPermissionsFalse = 
          !data.permissions.content_management_view &&
          !data.permissions.content_management_supervise &&
          !data.permissions.content_management_delete;
          
        if (allContentPermissionsFalse && user?.role !== "super_admin") {
          setAccessDenied(true);
        }
      } catch (error) {
        console.error("Content Management - API Error:", error);
      }
    };

    fetchPermissions();
  }, []);

  // Permission checking functions
  const hasPermission = (permission: string) => {
    // Super admin has all permissions
    if (user?.role === "super_admin") return true;
    
    if (!user || !permissions) return false;
    
    return permissions[permission] === true;
  };

  const canViewContent = hasPermission("content_management_view") || hasPermission("content_management_supervise");
  const canDeleteContent = hasPermission("content_management_delete") || hasPermission("content_management_supervise");
  const canSuperviseContent = hasPermission("content_management_supervise");

  // Show access denied if permissions are false
  if (accessDenied) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <div className="text-center">
          <i className="ri-lock-line text-6xl text-gray-300 mb-4"></i>
          <h3 className="text-xl font-semibold text-gray-600 mb-2">Access Denied</h3>
          <p className="text-gray-500">You don't have permission to access Content Management</p>
        </div>
      </div>
    );
  }

  const tabs: Tab[] = [
    {
      id: "businesses",
      name: t("contentManagement.tabs.businesses"),
      icon: "ri-store-line",
    },
    {
      id: "reviews",
      name: t("contentManagement.tabs.reviews"),
      icon: "ri-star-line",
    },
    {
      id: "verification",
      name: t("contentManagement.tabs.verification"),
      icon: "ri-shield-check-line",
    },
    {
      id: "reports",
      name: t("contentManagement.tabs.reports"),
      icon: "ri-flag-line",
    },
  ];

  const businessListings = businesses;
  const filteredBusinesses =
    filterStatus === "all"
      ? businesses
      : businesses.filter((b) => b.status === filterStatus);

  const handleBulkAction = (action: string): void => {
    // Check permissions for delete actions
    if (action === "reject" || action === "delete") {
      if (!canDeleteContent && !canSuperviseContent) {
        return;
      }
    }
    setSelectedItems([]);
  };

  const getStatusColor = (status: string): string => {
    switch (status) {
      case "approved":
      case "verified":
        return "bg-green-100 text-green-600";
      case "pending_verification":
      case "pending_review":
      case "under_review":
        return "bg-yellow-100 text-yellow-600";
      case "flagged":
      case "rejected":
        return "bg-red-100 text-red-600";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  const getCRStatusIcon = (status: string): string => {
    switch (status) {
      case "verified":
        return "ri-checkbox-circle-line text-green-500";
      case "under_review":
        return "ri-time-line text-yellow-500";
      case "pending_review":
        return "ri-hourglass-line text-orange-500";
      case "rejected":
        return "ri-close-circle-line text-red-500";
      default:
        return "ri-question-line text-gray-500";
    }
  };

  const handleReviewAction = (action: string, reviewId: number): void => {
    // Check permissions for delete actions
    if (action === "reject" || action === "delete") {
      if (!canDeleteContent && !canSuperviseContent) {
        return;
      }
    }
    setPendingReviews((prev) =>
      prev.filter((review) => review.id !== reviewId)
    );
  };

  const handleDocumentAction = (action: string, docId: number): void => {
    // Check permissions for delete actions
    if (action === "reject" || action === "delete") {
      if (!canDeleteContent && !canSuperviseContent) {
        return;
      }
    }
    if (action === "view") {
    } else {
      setDocumentVerifications((prev) =>
        prev.filter((doc) => doc.id !== docId)
      );
    }
  };

  const handleContentAction = (
    action: string,
    reportId: number,
    type: string
  ): void => {
    // Check permissions for delete actions
    if (action === "reject" || action === "delete") {
      if (!canDeleteContent && !canSuperviseContent) {
        return;
      }
    }
    setReportedContent((prev) =>
      prev.filter((report) => report.id !== reportId)
    );
  };

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-800">
          {t("contentManagement.title")}
        </h2>
        <div className="flex flex-col sm:flex-row gap-3">
          {selectedItems.length > 0 && (
            <div className="flex gap-2">
              <button
                onClick={() => handleBulkAction("approve")}
                className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 font-medium text-sm whitespace-nowrap cursor-pointer"
              >
                <i className="ri-check-line mr-2"></i>
                {t("contentManagement.buttons.approve")} ({selectedItems.length}
                )
              </button>
              <button
                onClick={() => handleBulkAction("reject")}
                disabled={!canDeleteContent && !canSuperviseContent}
                className={`px-4 py-2 rounded-lg font-medium text-sm whitespace-nowrap ${
                  !canDeleteContent && !canSuperviseContent
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-red-500 text-white hover:bg-red-600 cursor-pointer"
                }`}
              >
                <i className="ri-close-line mr-2"></i>
                {t("contentManagement.buttons.reject")} ({selectedItems.length})
              </button>
            </div>
          )}
          <button
            onClick={() => {
              /* export logic */
            }}
            disabled={!canSuperviseContent}
            className={`px-4 sm:px-6 py-2 rounded-lg font-medium text-sm whitespace-nowrap ${
              !canSuperviseContent
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-blue-500 text-white hover:bg-blue-600 cursor-pointer"
            }`}
          >
            <i className="ri-download-line mr-2"></i>
            {t("contentManagement.buttons.exportReport")}
          </button>
        </div>
      </div>

      {/* Content Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4 lg:gap-6">
        <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center space-x-2 sm:space-x-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <i className="ri-store-line text-blue-600 text-lg sm:text-xl"></i>
            </div>
            <div className="min-w-0">
              <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-800">
                {businessListings.length}
              </h3>
              <p className="text-gray-600 text-xs sm:text-sm">
                {t("contentManagement.stats.totalBusinesses")}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center space-x-2 sm:space-x-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <i className="ri-star-line text-orange-600 text-lg sm:text-xl"></i>
            </div>
            <div className="min-w-0">
              <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-800">
                {pendingReviews.length}
              </h3>
              <p className="text-gray-600 text-xs sm:text-sm">
                {t("contentManagement.stats.pendingReviews")}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center space-x-2 sm:space-x-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-yellow-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <i className="ri-shield-check-line text-yellow-600 text-lg sm:text-xl"></i>
            </div>
            <div className="min-w-0">
              <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-800">
                {documentVerifications.length}
              </h3>
              <p className="text-gray-600 text-xs sm:text-sm">
                {t("contentManagement.stats.docVerification")}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center space-x-2 sm:space-x-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <i className="ri-flag-line text-red-600 text-lg sm:text-xl"></i>
            </div>
            <div className="min-w-0">
              <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-800">
                {reportedContent.length}
              </h3>
              <p className="text-gray-600 text-xs sm:text-sm">
                {t("contentManagement.stats.reportedContent")}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-100 col-span-2 lg:col-span-1">
          <div className="flex items-center space-x-2 sm:space-x-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <i className="ri-check-line text-green-600 text-lg sm:text-xl"></i>
            </div>
            <div className="min-w-0">
              <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-800">
                {businessListings.filter((b) => b.status === "approved").length}
              </h3>
              <p className="text-gray-600 text-xs sm:text-sm">
                {t("contentManagement.stats.approvedToday")}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Content Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="border-b border-gray-200 overflow-x-auto">
          <nav className="flex space-x-4 sm:space-x-6 px-4 sm:px-6 min-w-max">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-3 sm:py-4 px-2 border-b-2 font-medium text-xs sm:text-sm whitespace-nowrap cursor-pointer transition-all ${
                  activeTab === tab.id
                    ? "border-red-500 text-red-600"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                <i className={`${tab.icon} mr-2`}></i>
                {tab.name}
                {tab.id === "reviews" && pendingReviews.length > 0 && (
                  <span className="ml-2 bg-orange-100 text-orange-600 px-2 py-1 rounded-full text-xs">
                    {pendingReviews.length}
                  </span>
                )}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-4 sm:p-6">
          {/* Business Listings Tab */}
          {activeTab === "businesses" && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-400 focus:border-transparent text-sm w-full sm:w-auto"
                >
                  <option value="all">
                    {t("contentManagement.filters.allStatus")}
                  </option>
                  <option value="approved">
                    {t("contentManagement.filters.approved")}
                  </option>
                  <option value="pending_verification">
                    {t("contentManagement.filters.pendingVerification")}
                  </option>
                  <option value="flagged">
                    {t("contentManagement.filters.flagged")}
                  </option>
                </select>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full min-w-[800px]">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="text-left py-3 px-4 sm:px-6">
                        <input
                          type="checkbox"
                          className="w-4 h-4 text-red-500 border-gray-300 rounded focus:ring-red-400"
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedItems(
                                filteredBusinesses.map((b) => b.id)
                              );
                            } else {
                              setSelectedItems([]);
                            }
                          }}
                          checked={
                            selectedItems.length ===
                              filteredBusinesses.length &&
                            filteredBusinesses.length > 0
                          }
                        />
                      </th>
                      <th className="text-left py-3 px-4 sm:px-6 text-sm font-medium text-gray-700">
                        {t("contentManagement.table.business")}
                      </th>
                      <th className="text-left py-3 px-4 sm:px-6 text-sm font-medium text-gray-700">
                        {t("contentManagement.table.owner")}
                      </th>
                      <th className="text-left py-3 px-4 sm:px-6 text-sm font-medium text-gray-700">
                        {t("contentManagement.table.category")}
                      </th>
                      <th className="text-left py-3 px-4 sm:px-6 text-sm font-medium text-gray-700">
                        {t("contentManagement.table.status")}
                      </th>
                      <th className="text-left py-3 px-4 sm:px-6 text-sm font-medium text-gray-700">
                        {t("contentManagement.table.crStatus")}
                      </th>
                      <th className="text-left py-3 px-4 sm:px-6 text-sm font-medium text-gray-700">
                        {t("contentManagement.table.views")}
                      </th>
                      <th className="text-left py-3 px-4 sm:px-6 text-sm font-medium text-gray-700">
                        {t("contentManagement.table.actions")}
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filteredBusinesses.map((business) => (
                      <tr key={business.id} className="hover:bg-gray-50">
                        <td className="py-4 px-4 sm:px-6">
                          <input
                            type="checkbox"
                            checked={selectedItems.includes(business.id)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedItems([
                                  ...selectedItems,
                                  business.id,
                                ]);
                              } else {
                                setSelectedItems(
                                  selectedItems.filter(
                                    (id) => id !== business.id
                                  )
                                );
                              }
                            }}
                            className="w-4 h-4 text-red-500 border-gray-300 rounded focus:ring-red-400"
                          />
                        </td>
                        <td className="py-4 px-4 sm:px-6">
                          <p className="font-medium text-gray-800 text-sm sm:text-base">
                            {business.name}
                          </p>
                          <p className="text-xs sm:text-sm text-gray-600">
                            {t("contentManagement.table.created")}:{" "}
                            {new Date(
                              business.createdDate
                            ).toLocaleDateString()}
                          </p>
                        </td>
                        <td className="py-4 px-4 sm:px-6">
                          <p className="text-gray-800 text-sm sm:text-base">
                            {business.owner}
                          </p>
                        </td>
                        <td className="py-4 px-4 sm:px-6">
                          <span className="bg-blue-100 text-blue-600 px-2 py-1 rounded text-xs sm:text-sm">
                            {business.category}
                          </span>
                        </td>
                        <td className="py-4 px-4 sm:px-6">
                          <span
                            className={`px-2 sm:px-3 py-1 rounded-full text-xs font-medium capitalize ${getStatusColor(
                              business.status
                            )}`}
                          >
                            {business.status.replace("_", " ")}
                          </span>
                        </td>
                        <td className="py-4 px-4 sm:px-6">
                          <div className="flex items-center space-x-2">
                            <i
                              className={getCRStatusIcon(business.crStatus)}
                            ></i>
                            <span
                              className={`text-xs font-medium capitalize ${getStatusColor(
                                business.crStatus
                              )}`}
                            >
                              {business.crStatus.replace("_", " ")}
                            </span>
                          </div>
                        </td>
                        <td className="py-4 px-4 sm:px-6">
                          <span className="font-medium text-gray-800 text-sm sm:text-base">
                            {business.views}
                          </span>
                        </td>
                        <td className="py-4 px-4 sm:px-6">
                          <div className="flex items-center space-x-1 sm:space-x-2">
                            <button
                              className="text-blue-600 hover:text-blue-700 cursor-pointer"
                              title={t("contentManagement.actions.viewDetails")}
                            >
                              <i className="ri-eye-line text-sm sm:text-base"></i>
                            </button>
                            <button
                              onClick={() => {
                                setEditingBusiness(business);
                                setShowEditBusiness(true);
                              }}
                              className="text-indigo-600 hover:text-indigo-700 cursor-pointer"
                              title={t("contentManagement.actions.edit")}
                            >
                              <i className="ri-edit-line text-sm sm:text-base"></i>
                            </button>
                            <button
                              onClick={() => {
                                setBusinesses((prev) =>
                                  prev.map((b) =>
                                    b.id === business.id
                                      ? { ...b, status: "approved" }
                                      : b
                                  )
                                );
                              }}
                              className="text-green-600 hover:text-green-700 cursor-pointer"
                              title={t("contentManagement.actions.approve")}
                            >
                              <i className="ri-check-line text-sm sm:text-base"></i>
                            </button>
                            <button
                              onClick={() => {
                                setBusinesses((prev) =>
                                  prev.map((b) =>
                                    b.id === business.id
                                      ? { ...b, status: "flagged" }
                                      : b
                                  )
                                );
                              }}
                              className="text-yellow-600 hover:text-yellow-700 cursor-pointer"
                              title={t("contentManagement.actions.flag")}
                            >
                              <i className="ri-flag-line text-sm sm:text-base"></i>
                            </button>
                            <button
                              onClick={() => {
                                if (
                                  !confirm(
                                    t(
                                      "contentManagement.messages.deleteConfirm"
                                    )
                                  )
                                )
                                  return;
                                setBusinesses((prev) =>
                                  prev.filter((b) => b.id !== business.id)
                                );
                                setSelectedItems((prev) =>
                                  prev.filter((id) => id !== business.id)
                                );
                              }}
                              className="text-red-600 hover:text-red-700 cursor-pointer"
                              title={t("contentManagement.actions.delete")}
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
            </div>
          )}

          {/* Pending Reviews Tab */}
          {activeTab === "reviews" && (
            <div className="space-y-4 sm:space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="min-w-0">
                  <h3 className="text-base sm:text-lg font-semibold text-gray-800">
                    {t("contentManagement.reviews.title")}
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-600">
                    {t("contentManagement.reviews.description")}
                  </p>
                </div>
                <div className="flex items-center space-x-4">
                  <span className="text-xs sm:text-sm text-gray-600">
                    {pendingReviews.filter((r) => r.flagged).length}{" "}
                    {t("contentManagement.reviews.flagged")}
                  </span>
                </div>
              </div>

              {pendingReviews.map((review) => (
                <div
                  key={review.id}
                  className={`border rounded-lg p-4 sm:p-6 ${
                    review.flagged
                      ? "border-red-200 bg-red-50"
                      : "border-gray-200 bg-white"
                  }`}
                >
                  <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start space-x-3 mb-4">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                          <i className="ri-star-line text-orange-600 text-lg sm:text-xl"></i>
                        </div>
                        <div className="min-w-0 flex-1">
                          <h4 className="font-semibold text-gray-800 text-sm sm:text-base truncate">
                            {review.businessName}
                          </h4>
                          <p className="text-xs sm:text-sm text-gray-600">
                            {t("contentManagement.reviews.submittedBy")}:{" "}
                            {review.customerName}
                          </p>
                        </div>
                        {review.flagged && (
                          <span className="bg-red-100 text-red-600 px-2 sm:px-3 py-1 rounded-full text-xs font-medium flex-shrink-0">
                            <i className="ri-flag-line mr-1"></i>
                            {t("contentManagement.reviews.flagged")}
                          </span>
                        )}
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 mb-4">
                        <div>
                          <span className="font-medium text-gray-700 text-sm">
                            {t("contentManagement.reviews.rating")}:
                          </span>
                          <div className="flex items-center space-x-2 mt-1">
                            <div className="flex text-yellow-400">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <i
                                  key={star}
                                  className={`${
                                    star <= review.rating
                                      ? "ri-star-fill"
                                      : "ri-star-line text-gray-300"
                                  } text-sm`}
                                ></i>
                              ))}
                            </div>
                            <span className="text-xs sm:text-sm text-gray-600">
                              ({review.rating}/5)
                            </span>
                          </div>
                        </div>
                        <div>
                          <span className="font-medium text-gray-700 text-sm">
                            {t("contentManagement.reviews.submissionDate")}:
                          </span>
                          <p className="text-gray-600 text-sm">
                            {new Date(
                              review.submissionDate
                            ).toLocaleDateString()}
                          </p>
                        </div>
                        <div>
                          <span className="font-medium text-gray-700 text-sm">
                            {t("contentManagement.reviews.status")}:
                          </span>
                          <span className="bg-yellow-100 text-yellow-600 px-2 py-1 rounded text-xs ml-2">
                            {review.status.replace("_", " ")}
                          </span>
                        </div>
                      </div>

                      <div className="bg-gray-50 p-3 sm:p-4 rounded-lg mb-4">
                        <span className="font-medium text-gray-700 text-sm">
                          {t("contentManagement.reviews.content")}:
                        </span>
                        <p className="text-gray-700 mt-2 leading-relaxed text-sm sm:text-base">
                          {review.reviewText}
                        </p>
                      </div>

                      {review.flagged && (
                        <div className="bg-red-100 border border-red-200 rounded-lg p-3 mb-4">
                          <div className="flex items-center space-x-2">
                            <i className="ri-alert-line text-red-600"></i>
                            <span className="font-medium text-red-800 text-sm">
                              {t("contentManagement.reviews.flaggedTitle")}
                            </span>
                          </div>
                          <p className="text-xs sm:text-sm text-red-700 mt-1">
                            {t("contentManagement.reviews.flaggedDescription")}
                          </p>
                        </div>
                      )}
                    </div>

                    <div className="flex flex-col space-y-2 lg:ml-4 lg:w-auto w-full">
                      <button
                        onClick={() => setSelectedReview(review)}
                        className="bg-blue-500 text-white px-3 sm:px-4 py-2 rounded hover:bg-blue-600 text-xs sm:text-sm cursor-pointer whitespace-nowrap"
                      >
                        <i className="ri-eye-line mr-2"></i>
                        {t("contentManagement.actions.viewDetails")}
                      </button>
                      <button
                        onClick={() => handleReviewAction("approve", review.id)}
                        className="bg-green-500 text-white px-3 sm:px-4 py-2 rounded hover:bg-green-600 text-xs sm:text-sm cursor-pointer whitespace-nowrap"
                      >
                        <i className="ri-check-line mr-2"></i>
                        {t("contentManagement.actions.approve")}
                      </button>
                      <button
                        onClick={() => handleReviewAction("reject", review.id)}
                        className="bg-red-500 text-white px-3 sm:px-4 py-2 rounded hover:bg-red-600 text-xs sm:text-sm cursor-pointer whitespace-nowrap"
                      >
                        <i className="ri-close-line mr-2"></i>
                        {t("contentManagement.actions.reject")}
                      </button>
                      {!review.flagged && (
                        <button
                          onClick={() => handleReviewAction("flag", review.id)}
                          className="bg-orange-500 text-white px-3 sm:px-4 py-2 rounded hover:bg-orange-600 text-xs sm:text-sm cursor-pointer whitespace-nowrap"
                        >
                          <i className="ri-flag-line mr-2"></i>
                          {t("contentManagement.actions.flag")}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}

              {pendingReviews.length === 0 && (
                <div className="text-center py-8 sm:py-12 text-gray-500">
                  <i className="ri-star-line text-3xl sm:text-4xl mb-3 sm:mb-4"></i>
                  <p className="text-sm sm:text-base">
                    {t("contentManagement.reviews.noPending")}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Document Verification Tab */}
          {activeTab === "verification" && (
            <div className="space-y-4 sm:space-y-6">
              {documentVerifications.map((doc) => (
                <div
                  key={doc.id}
                  className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 sm:p-6"
                >
                  <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start space-x-3 mb-4">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-yellow-100 rounded-lg flex items-center justify-center flex-shrink-0">
                          <i className="ri-file-shield-line text-yellow-600 text-lg sm:text-xl"></i>
                        </div>
                        <div className="min-w-0 flex-1">
                          <h4 className="font-semibold text-gray-800 text-sm sm:text-base truncate">
                            {doc.businessName}
                          </h4>
                          <p className="text-xs sm:text-sm text-gray-600">
                            {t("contentManagement.verification.owner")}:{" "}
                            {doc.ownerName}
                          </p>
                        </div>
                        <span
                          className={`px-2 sm:px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                            doc.status
                          )} flex-shrink-0`}
                        >
                          {doc.status.replace("_", " ")}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 mb-4">
                        <div>
                          <span className="font-medium text-gray-700 text-sm">
                            {t("contentManagement.verification.documentType")}:
                          </span>
                          <p className="text-gray-600 text-sm">
                            {doc.documentType}
                          </p>
                        </div>
                        <div>
                          <span className="font-medium text-gray-700 text-sm">
                            {t("contentManagement.verification.crNumber")}:
                          </span>
                          <p className="text-gray-600 text-sm">
                            {doc.crNumber}
                          </p>
                        </div>
                        <div>
                          <span className="font-medium text-gray-700 text-sm">
                            {t("contentManagement.verification.uploadDate")}:
                          </span>
                          <p className="text-gray-600 text-sm">
                            {new Date(doc.uploadDate).toLocaleDateString()}
                          </p>
                        </div>
                        <div>
                          <span className="font-medium text-gray-700 text-sm">
                            {t("contentManagement.verification.issueDate")}:
                          </span>
                          <p className="text-gray-600 text-sm">
                            {new Date(doc.issueDate).toLocaleDateString()}
                          </p>
                        </div>
                        <div>
                          <span className="font-medium text-gray-700 text-sm">
                            {t("contentManagement.verification.expiryDate")}:
                          </span>
                          <p className="text-gray-600 text-sm">
                            {new Date(doc.expiryDate).toLocaleDateString()}
                          </p>
                        </div>
                        <div>
                          <span className="font-medium text-gray-700 text-sm">
                            {t("contentManagement.verification.reviewer")}:
                          </span>
                          <p className="text-gray-600 text-sm">
                            {doc.reviewer ||
                              t("contentManagement.verification.notAssigned")}
                          </p>
                        </div>
                      </div>

                      {doc.notes && (
                        <div className="bg-white p-3 rounded border border-yellow-200 mb-4">
                          <span className="font-medium text-gray-700 text-sm">
                            {t("contentManagement.verification.reviewNotes")}:
                          </span>
                          <p className="text-gray-600 mt-1 text-sm">
                            {doc.notes}
                          </p>
                        </div>
                      )}
                    </div>

                    <div className="flex flex-col space-y-2 lg:ml-4 lg:w-auto w-full">
                      <button
                        onClick={() => handleDocumentAction("view", doc.id)}
                        className="bg-blue-500 text-white px-3 sm:px-4 py-2 rounded hover:bg-blue-600 text-xs sm:text-sm cursor-pointer whitespace-nowrap"
                      >
                        <i className="ri-eye-line mr-2"></i>
                        {t("contentManagement.actions.viewDocument")}
                      </button>
                      <button
                        onClick={() => handleDocumentAction("approve", doc.id)}
                        className="bg-green-500 text-white px-3 sm:px-4 py-2 rounded hover:bg-green-600 text-xs sm:text-sm cursor-pointer whitespace-nowrap"
                      >
                        <i className="ri-check-line mr-2"></i>
                        {t("contentManagement.actions.approve")}
                      </button>
                      <button
                        onClick={() => handleDocumentAction("reject", doc.id)}
                        className="bg-red-500 text-white px-3 sm:px-4 py-2 rounded hover:bg-red-600 text-xs sm:text-sm cursor-pointer whitespace-nowrap"
                      >
                        <i className="ri-close-line mr-2"></i>
                        {t("contentManagement.actions.reject")}
                      </button>
                      <button
                        onClick={() =>
                          handleDocumentAction("request_resubmit", doc.id)
                        }
                        className="bg-orange-500 text-white px-3 sm:px-4 py-2 rounded hover:bg-orange-600 text-xs sm:text-sm cursor-pointer whitespace-nowrap"
                      >
                        <i className="ri-refresh-line mr-2"></i>
                        {t("contentManagement.actions.requestResubmit")}
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              {documentVerifications.length === 0 && (
                <div className="text-center py-8 sm:py-12 text-gray-500">
                  <i className="ri-file-check-line text-3xl sm:text-4xl mb-3 sm:mb-4"></i>
                  <p className="text-sm sm:text-base">
                    {t("contentManagement.verification.noPending")}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Reported Content Tab */}
          {activeTab === "reports" && (
            <div className="space-y-4">
              {reportedContent.map((report) => (
                <div
                  key={report.id}
                  className="bg-red-50 border border-red-200 rounded-lg p-4 sm:p-6"
                >
                  <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-3 mb-2">
                        <h4 className="font-semibold text-gray-800 text-sm sm:text-base truncate">
                          {report.business}
                        </h4>
                        <span
                          className={`px-2 sm:px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                            report.status
                          )} flex-shrink-0`}
                        >
                          {report.status}
                        </span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs sm:text-sm text-gray-600 mb-3">
                        <div>
                          <span className="font-medium">
                            {t("contentManagement.reports.type")}:
                          </span>{" "}
                          {report.type.replace("_", " ")}
                        </div>
                        <div>
                          <span className="font-medium">
                            {t("contentManagement.reports.reportedBy")}:
                          </span>{" "}
                          {report.reportedBy}
                        </div>
                        <div>
                          <span className="font-medium">
                            {t("contentManagement.reports.date")}:
                          </span>{" "}
                          {new Date(report.reportDate).toLocaleDateString()}
                        </div>
                      </div>
                      <div className="mb-3">
                        <span className="font-medium text-gray-700 text-sm">
                          {t("contentManagement.reports.reason")}:
                        </span>{" "}
                        {report.reason}
                      </div>
                      <div className="bg-white p-3 rounded border border-red-200">
                        <span className="font-medium text-gray-700 text-sm">
                          {t("contentManagement.reports.content")}:
                        </span>
                        <p className="text-gray-600 mt-1 text-sm">
                          {report.content}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 lg:ml-4 lg:flex-col lg:space-x-0 lg:space-y-2 w-full lg:w-auto">
                      <button
                        onClick={() =>
                          handleContentAction("approve", report.id, "report")
                        }
                        className="bg-green-500 text-white px-3 py-2 rounded hover:bg-green-600 text-xs sm:text-sm cursor-pointer w-full lg:w-auto"
                      >
                        {t("contentManagement.actions.approve")}
                      </button>
                      <button
                        onClick={() =>
                          handleContentAction("takedown", report.id, "report")
                        }
                        className="bg-red-500 text-white px-3 py-2 rounded hover:bg-red-600 text-xs sm:text-sm cursor-pointer w-full lg:w-auto"
                      >
                        {t("contentManagement.actions.takeDown")}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Review Detail Modal */}
      {selectedReview && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-4 sm:p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                    <i className="ri-star-line text-orange-600 text-lg sm:text-xl"></i>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800 text-base sm:text-lg">
                      {t("contentManagement.reviewModal.title")}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {selectedReview.businessName}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedReview(null)}
                  className="text-gray-400 hover:text-gray-600 cursor-pointer"
                >
                  <i className="ri-close-line text-xl"></i>
                </button>
              </div>
            </div>

            <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    {t("contentManagement.reviewModal.business")}
                  </label>
                  <p className="text-gray-800 text-sm sm:text-base">
                    {selectedReview.businessName}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    {t("contentManagement.reviewModal.submittedBy")}
                  </label>
                  <p className="text-gray-800 text-sm sm:text-base">
                    {selectedReview.customerName}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    {t("contentManagement.reviewModal.rating")}
                  </label>
                  <div className="flex items-center space-x-2">
                    <div className="flex text-yellow-400">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <i
                          key={star}
                          className={`${
                            star <= selectedReview.rating
                              ? "ri-star-fill"
                              : "ri-star-line text-gray-300"
                          } text-sm`}
                        ></i>
                      ))}
                    </div>
                    <span className="text-sm text-gray-600">
                      ({selectedReview.rating}/5)
                    </span>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    {t("contentManagement.reviewModal.submissionDate")}
                  </label>
                  <p className="text-gray-800 text-sm sm:text-base">
                    {new Date(
                      selectedReview.submissionDate
                    ).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">
                  {t("contentManagement.reviewModal.reviewContent")}
                </label>
                <div className="bg-gray-50 p-3 sm:p-4 rounded-lg mt-2">
                  <p className="text-gray-700 leading-relaxed text-sm sm:text-base">
                    {selectedReview.reviewText}
                  </p>
                </div>
              </div>

              {selectedReview.flagged && (
                <div className="bg-red-100 border border-red-200 rounded-lg p-3 sm:p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <i className="ri-alert-line text-red-600"></i>
                    <span className="font-medium text-red-800 text-sm sm:text-base">
                      {t("contentManagement.reviewModal.flaggedTitle")}
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-red-700">
                    {t("contentManagement.reviewModal.flaggedDescription")}
                  </p>
                  <ul className="text-xs sm:text-sm text-red-700 mt-2 list-disc list-inside space-y-1">
                    <li>{t("contentManagement.reviewModal.checkLanguage")}</li>
                    <li>
                      {t("contentManagement.reviewModal.verifyAuthenticity")}
                    </li>
                    <li>
                      {t("contentManagement.reviewModal.ensureCompliance")}
                    </li>
                  </ul>
                </div>
              )}

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 sm:p-4">
                <h4 className="font-medium text-blue-800 text-sm sm:text-base mb-2">
                  {t("contentManagement.reviewModal.approvalProcess")}
                </h4>
                <ul className="text-xs sm:text-sm text-blue-700 space-y-1">
                  <li>• {t("contentManagement.reviewModal.approvedAppear")}</li>
                  <li>
                    • {t("contentManagement.reviewModal.ownerNotification")}
                  </li>
                  <li>
                    • {t("contentManagement.reviewModal.contributeRating")}
                  </li>
                  <li>
                    • {t("contentManagement.reviewModal.actionPermanent")}
                  </li>
                </ul>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-end space-y-3 sm:space-y-0 sm:space-x-3 pt-4 border-t border-gray-200">
                <button
                  onClick={() => setSelectedReview(null)}
                  className="px-4 sm:px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium text-sm cursor-pointer w-full sm:w-auto order-2 sm:order-1"
                >
                  {t("contentManagement.actions.close")}
                </button>
                <button
                  onClick={() => {
                    handleReviewAction("reject", selectedReview.id);
                    setSelectedReview(null);
                  }}
                  className="px-4 sm:px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 font-medium text-sm cursor-pointer w-full sm:w-auto order-3 sm:order-2"
                >
                  <i className="ri-close-line mr-2"></i>
                  {t("contentManagement.actions.rejectReview")}
                </button>
                <button
                  onClick={() => {
                    handleReviewAction("approve", selectedReview.id);
                    setSelectedReview(null);
                  }}
                  className="px-4 sm:px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 font-medium text-sm cursor-pointer w-full sm:w-auto order-1 sm:order-3"
                >
                  <i className="ri-check-line mr-2"></i>
                  {t("contentManagement.actions.approveReview")}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Business Modal */}
      {showEditBusiness && editingBusiness && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full max-h-screen overflow-y-auto">
            <div className="p-4 sm:p-6 border-b border-gray-200 flex items-center justify-between">
              <h3 className="text-base sm:text-lg font-semibold text-gray-800">
                {t("contentManagement.editBusiness.title")}
              </h3>
              <button
                onClick={() => setShowEditBusiness(false)}
                className="text-gray-400 hover:text-gray-600 cursor-pointer"
              >
                <i className="ri-close-line text-xl"></i>
              </button>
            </div>
            <div className="p-4 sm:p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t("contentManagement.editBusiness.name")}
                </label>
                <input
                  type="text"
                  value={editingBusiness.name}
                  onChange={(e) =>
                    setEditingBusiness({
                      ...editingBusiness,
                      name: e.target.value,
                    })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-400 focus:border-transparent text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t("contentManagement.editBusiness.owner")}
                </label>
                <input
                  type="text"
                  value={editingBusiness.owner}
                  onChange={(e) =>
                    setEditingBusiness({
                      ...editingBusiness,
                      owner: e.target.value,
                    })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-400 focus:border-transparent text-sm"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t("contentManagement.editBusiness.category")}
                  </label>
                  <input
                    type="text"
                    value={editingBusiness.category}
                    onChange={(e) =>
                      setEditingBusiness({
                        ...editingBusiness,
                        category: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-400 focus:border-transparent text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t("contentManagement.editBusiness.status")}
                  </label>
                  <select
                    value={editingBusiness.status}
                    onChange={(e) =>
                      setEditingBusiness({
                        ...editingBusiness,
                        status: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-400 focus:border-transparent text-sm"
                  >
                    <option value="approved">
                      {t("contentManagement.editBusiness.approved")}
                    </option>
                    <option value="pending_verification">
                      {t("contentManagement.editBusiness.pendingVerification")}
                    </option>
                    <option value="flagged">
                      {t("contentManagement.editBusiness.flagged")}
                    </option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t("contentManagement.editBusiness.crStatus")}
                  </label>
                  <select
                    value={editingBusiness.crStatus}
                    onChange={(e) =>
                      setEditingBusiness({
                        ...editingBusiness,
                        crStatus: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-400 focus:border-transparent text-sm"
                  >
                    <option value="verified">
                      {t("contentManagement.editBusiness.verified")}
                    </option>
                    <option value="under_review">
                      {t("contentManagement.editBusiness.underReview")}
                    </option>
                    <option value="pending_review">
                      {t("contentManagement.editBusiness.pendingReview")}
                    </option>
                    <option value="rejected">
                      {t("contentManagement.editBusiness.rejected")}
                    </option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t("contentManagement.editBusiness.views")}
                  </label>
                  <input
                    type="number"
                    value={editingBusiness.views}
                    onChange={(e) =>
                      setEditingBusiness({
                        ...editingBusiness,
                        views: parseInt(e.target.value || "0", 10),
                      })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-400 focus:border-transparent text-sm"
                  />
                </div>
              </div>
            </div>
            <div className="p-4 sm:p-6 border-t border-gray-200 flex flex-col sm:flex-row justify-end gap-3">
              <button
                onClick={() => setShowEditBusiness(false)}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium text-sm cursor-pointer order-2 sm:order-1"
              >
                {t("contentManagement.actions.cancel")}
              </button>
              <button
                onClick={() => {
                  setBusinesses((prev) =>
                    prev.map((b) =>
                      b.id === editingBusiness.id
                        ? { ...b, ...editingBusiness }
                        : b
                    )
                  );
                  setShowEditBusiness(false);
                }}
                className="px-6 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 font-medium text-sm cursor-pointer order-1 sm:order-2"
              >
                {t("contentManagement.actions.save")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
