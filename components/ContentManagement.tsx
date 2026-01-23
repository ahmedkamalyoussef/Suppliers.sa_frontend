"use client";

import { useState, useEffect } from "react";
import { useLanguage } from "@/lib/LanguageContext";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "react-toastify";
import { AdminInquiry } from "@/lib/types";

interface Business {
  id: number;
  name: string;
  owner: string;
  category: string;
  status: string;
  crStatus: string;
  views: number;
  createdDate: string;
  read: boolean;
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
  customerProfileImage?: string;
  businessProfileImage?: string;
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
  documentLink?: string;
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
  const [filterReadStatus, setFilterReadStatus] = useState<string>("false");
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [pendingReviews, setPendingReviews] = useState<Review[]>([]);
  const [documentVerifications, setDocumentVerifications] = useState<
    DocumentVerification[]
  >([]);
  const [reportedContent, setReportedContent] = useState<ReportedContent[]>([]);
  const [inquiries, setInquiries] = useState<AdminInquiry[]>([]);
  const [selectedInquiry, setSelectedInquiry] = useState<AdminInquiry | null>(
    null,
  );
  const [showInquiryModal, setShowInquiryModal] = useState(false);
  const [replyMessage, setReplyMessage] = useState("");
  const [isReplying, setIsReplying] = useState(false);
  const [approvedToday, setApprovedToday] = useState<number>(0);
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);
  const [showEditBusiness, setShowEditBusiness] = useState<boolean>(false);
  const [editingBusiness, setEditingBusiness] = useState<Business | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<{
    [key: string]: boolean;
  }>({});

  useEffect(() => {
    // Skip all permission checks for super admin
    if (user?.role === "super_admin") {
      return;
    }

    const fetchPermissions = async () => {
      try {
        const { apiService } = await import("../lib/api");
        const data = await apiService.getPermissions();
        setPermissions(data.permissions);

        // Check if all content management permissions are false
        const allContentPermissionsFalse =
          !data.permissions.content_management_view &&
          !data.permissions.content_management_supervise &&
          !data.permissions.content_management_delete;

        if (allContentPermissionsFalse) {
          setAccessDenied(true);
        }
      } catch (error) {
        console.error("Content Management - API Error:", error);
      }
    };

    fetchPermissions();
  }, [user?.role]);

  // Permission checking functions
  const hasPermission = (permission: string) => {
    // Super admin has all permissions
    if (user?.role === "super_admin") return true;

    if (!user || !permissions) return false;

    return permissions[permission] === true;
  };

  const canViewContent =
    user?.role === "super_admin" ||
    hasPermission("content_management_view") ||
    hasPermission("content_management_supervise");
  const canDeleteContent =
    user?.role === "super_admin" ||
    hasPermission("content_management_delete") ||
    hasPermission("content_management_supervise");
  const canSuperviseContent =
    user?.role === "super_admin" ||
    hasPermission("content_management_supervise");

  // Fetch ratings and documents data
  useEffect(() => {
    const fetchData = async () => {
      if (!canViewContent) return;

      setLoading(true);
      setError(null);

      try {
        const { apiService } = await import("../lib/api");

        // Fetch ratings
        const ratingsResponse = await apiService.getRatings("all");
        const formattedRatings = ratingsResponse.data.map((rating: any) => ({
          id: rating.id,
          businessName:
            rating.supplier?.profile?.business_name ||
            rating.supplier?.name ||
            "Unknown Business",
          customerName:
            rating.raterSupplier?.profile?.business_name ||
            rating.raterSupplier?.name ||
            "Anonymous",
          rating: rating.score,
          reviewText: rating.comment || "",
          submissionDate: rating.createdAt,
          status: rating.status,
          flagged: rating.status === "flagged",
          customerProfileImage: rating.raterSupplier?.profile_image,
          businessProfileImage:
            rating.supplier?.profile?.business_image ||
            rating.supplier?.profile_image,
        }));
        setPendingReviews(formattedRatings);

        // Fetch documents
        const documentsResponse = await apiService.getDocuments("all");
        const formattedDocuments = documentsResponse.data.map((doc: any) => ({
          id: doc.id,
          businessName: doc.business?.name || "Unknown Business",
          ownerName: doc.business?.owner_name || "Unknown Owner",
          documentType: doc.document_type || "Unknown",
          crNumber: doc.cr_number || "",
          uploadDate: doc.created_at,
          issueDate: doc.issue_date || doc.created_at,
          expiryDate: doc.expiry_date || "",
          status: doc.status,
          reviewer: doc.reviewer?.name || null,
          notes: doc.notes || null,
          documentLink: doc.document_link,
        }));
        setDocumentVerifications(formattedDocuments);

        // Fetch approved today count
        const approvedTodayResponse = await apiService.getApprovedToday();
        setApprovedToday(approvedTodayResponse.approvedToday);
      } catch (err) {
        console.error("Failed to fetch data:", err);
        setError("Failed to load data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [canViewContent]);

  // Separate useEffect for inquiries that depends on filterReadStatus
  useEffect(() => {
    const fetchInquiries = async () => {
      if (!canViewContent) return;

      try {
        const { apiService } = await import("../lib/api");

        // Fetch inquiries with read status filter
        const inquiriesResponse = await apiService.getInquiries();

        // Try different ways to access the data
        let inquiriesData: any[] = [];
        if (inquiriesResponse) {
          if (Array.isArray(inquiriesResponse)) {
            inquiriesData = inquiriesResponse;
          } else if (
            (inquiriesResponse as any).inquiries &&
            Array.isArray((inquiriesResponse as any).inquiries)
          ) {
            inquiriesData = (inquiriesResponse as any).inquiries;
          } else if (
            (inquiriesResponse as any).data &&
            Array.isArray((inquiriesResponse as any).data)
          ) {
            inquiriesData = (inquiriesResponse as any).data;
          }
        }

        // Filter based on read status
        const filteredInquiries = inquiriesData.filter((inquiry) => {
          return inquiry.is_read.toString() === filterReadStatus;
        });

        setInquiries(filteredInquiries);
      } catch (err) {
        console.error("Failed to fetch inquiries:", err);
      }
    };

    // Only fetch when on inquiries tab
    if (activeTab === "inquiries") {
      fetchInquiries();
    }
  }, [canViewContent, filterReadStatus, activeTab]);
  // Show access denied if permissions are false (skip for super admin)
  if (accessDenied && user?.role !== "super_admin") {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <div className="text-center">
          <i className="ri-lock-line text-6xl text-gray-300 mb-4"></i>
          <h3 className="text-xl font-semibold text-gray-600 mb-2">
            Access Denied
          </h3>
          <p className="text-gray-500">
            You don't have permission to access Content Management
          </p>
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
      id: "inquiries",
      name: t("contentManagement.tabs.inquiries"),
      icon: "ri-message-3-line",
    },
    {
      id: "reports",
      name: t("contentManagement.tabs.reports"),
      icon: "ri-flag-line",
    },
  ];

  const businessListings = businesses;
  const filteredBusinesses = businesses.filter((b) => {
    return b.read.toString() === filterReadStatus;
  });

  // Combine business data with inquiries data
  const businessesWithInquiries = filteredBusinesses.map((business) => {
    const businessInquiries = (inquiries || []).filter(
      (inquiry) => inquiry.from === "supplier" && inquiry.sender_id !== null,
    );
    return {
      ...business,
      inquiries: businessInquiries,
      hasInquiries: businessInquiries.length > 0,
      unreadInquiries: businessInquiries.filter((inq) => !inq.is_read).length,
    };
  });

  const filteredReviews =
    filterStatus === "all"
      ? pendingReviews
      : pendingReviews.filter((r) => r.status === filterStatus);

  // Helper function to refresh approved today count
  const refreshApprovedToday = async () => {
    try {
      const { apiService } = await import("../lib/api");
      const approvedTodayResponse = await apiService.getApprovedToday();
      setApprovedToday(approvedTodayResponse.approvedToday);
    } catch (error) {
      console.error("Failed to refresh approved today count:", error);
    }
  };

  // Handler for viewing inquiry details
  const handleViewInquiry = (inquiry: AdminInquiry) => {
    setSelectedInquiry(inquiry);
    setShowInquiryModal(true);
  };

  // Handler for closing inquiry modal with automatic mark as read
  const handleCloseInquiryModal = async () => {
    setReplyMessage("");
    setIsReplying(false);

    if (selectedInquiry) {
      try {
        if (!selectedInquiry.is_read) {
          const { apiService } = await import("../lib/api");

          // Use the new markAsReadForAdmin method
          const response = await apiService.markAsReadForAdmin(
            selectedInquiry.id,
          );

          // Update the local state to mark the inquiry as read
          setInquiries((prevInquiries) =>
            prevInquiries.map((inquiry) =>
              inquiry.id === selectedInquiry.id
                ? { ...inquiry, is_read: true }
                : inquiry,
            ),
          );
        }
      } catch (error) {
        console.error("Failed to mark inquiry as read:", error);
      }
    }
    setShowInquiryModal(false);
    setSelectedInquiry(null);
  };

  const handleReplyToInquiryClick = (inquiry: AdminInquiry) => {
    setSelectedInquiry(inquiry);
    setReplyMessage("");
    setShowInquiryModal(true);
  };

  const handleReplyToInquiry = async () => {
    if (!selectedInquiry || !replyMessage.trim()) return;

    setIsReplying(true);

    try {
      const { apiService } = await import("../lib/api");

      // Use the same endpoint as User Management
      await apiService.createInquiry({
        receiver_id: selectedInquiry.sender_id,
        name: "Admin",
        email: user?.email || "admin@supplier.sa",
        phone: "",
        subject: `${selectedInquiry.subject}`,
        message: replyMessage.trim(),
      });

      // Show success message
      toast.success(t("contentManagement.inquiries.replySuccess"));

      // Close the modal and reset form
      setReplyMessage("");
      setShowInquiryModal(false);
      setSelectedInquiry(null);

      // Refresh the inquiries list
      const inquiriesResponse = await apiService.getInquiries();
      if (inquiriesResponse) {
        let inquiriesData: any[] = [];
        if (Array.isArray(inquiriesResponse)) {
          inquiriesData = inquiriesResponse;
        } else if (
          inquiriesResponse.inquiries &&
          Array.isArray(inquiriesResponse.inquiries)
        ) {
          inquiriesData = inquiriesResponse.inquiries;
        }
        setInquiries(inquiriesData);
      }
    } catch (error) {
      console.error("Failed to send reply:", error);
      toast.error(t("contentManagement.inquiries.replyError"));
    } finally {
      setIsReplying(false);
    }
  };

  const handleBulkAction = async (action: string): Promise<void> => {
    // Check permissions for delete actions
    if (action === "reject" || action === "delete") {
      if (!canDeleteContent && !canSuperviseContent) {
        return;
      }
    }

    if (selectedItems.length === 0) return;

    try {
      const { apiService } = await import("../lib/api");

      if (action === "approve") {
        // For bulk approval, we need to determine the type based on active tab
        if (activeTab === "businesses") {
          // Approve businesses
          await Promise.all(
            selectedItems.map((itemId) =>
              apiService.updateSupplier(itemId, { status: "approved" }),
            ),
          );

          // Update local state
          setBusinesses((prev) =>
            prev.map((b) =>
              selectedItems.includes(b.id) ? { ...b, status: "approved" } : b,
            ),
          );
        } else if (activeTab === "reviews") {
          // Approve reviews
          await Promise.all(
            selectedItems.map((itemId) => apiService.approveRating(itemId)),
          );

          // Refresh reviews data
          const ratingsResponse = await apiService.getRatings("all");
          const formattedRatings = ratingsResponse.data.map((rating: any) => ({
            id: rating.id,
            businessName:
              rating.supplier?.profile?.business_name ||
              rating.supplier?.name ||
              "Unknown Business",
            customerName:
              rating.raterSupplier?.profile?.business_name ||
              rating.raterSupplier?.name ||
              "Anonymous",
            rating: rating.score,
            reviewText: rating.comment || "",
            submissionDate: rating.createdAt,
            status: rating.status,
            flagged: rating.status === "flagged",
            customerProfileImage: rating.raterSupplier?.profile_image,
            businessProfileImage:
              rating.supplier?.profile?.business_image ||
              rating.supplier?.profile_image,
          }));
          setPendingReviews(formattedRatings);
        } else if (activeTab === "documents") {
          // Approve documents
          await Promise.all(
            selectedItems.map((itemId) => apiService.approveDocument(itemId)),
          );

          // Refresh documents data
          const documentsResponse = await apiService.getDocuments("all");
          const formattedDocuments = documentsResponse.data.map((doc: any) => ({
            id: doc.id,
            businessName: doc.business?.name || "Unknown Business",
            ownerName: doc.business?.owner_name || "Unknown Owner",
            documentType: doc.document_type || "Unknown",
            crNumber: doc.cr_number || "",
            uploadDate: doc.created_at,
            issueDate: doc.issue_date || doc.created_at,
            expiryDate: doc.expiry_date || "",
            status: doc.status,
            reviewer: doc.reviewer?.name || null,
            notes: doc.notes || null,
            documentLink: doc.document_link,
          }));
          setDocumentVerifications(formattedDocuments);
        }

        // Refresh approved today count for approve actions
        await refreshApprovedToday();

        toast.success(
          t("contentManagement.notifications.bulkApproved").replace(
            "{count}",
            selectedItems.length.toString(),
          ),
        );
      } else if (action === "reject") {
        // Handle bulk reject if needed
        // Implementation depends on what reject should do for each type
        toast.info("Bulk reject action not implemented yet");
      }

      setSelectedItems([]);
    } catch (error) {
      console.error(`Failed to perform bulk ${action}:`, error);
      toast.error(t("contentManagement.notifications.bulkActionError"));
    }
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

  const handleReviewAction = async (
    action: string,
    reviewId: number,
  ): Promise<void> => {
    // Check permissions for delete actions
    if (action === "reject" || action === "delete") {
      if (!canDeleteContent && !canSuperviseContent) {
        return;
      }
    }

    const actionKey = `${action}-${reviewId}`;
    setActionLoading((prev) => ({ ...prev, [actionKey]: true }));

    try {
      const { apiService } = await import("../lib/api");

      switch (action) {
        case "approve":
          await apiService.approveRating(reviewId);
          break;
        case "reject":
          await apiService.rejectRating(reviewId);
          break;
        case "flag":
          await apiService.flagRating(reviewId);
          break;
        default:
          return;
      }

      // Refresh data after action
      const ratingsResponse = await apiService.getRatings("all");
      const formattedRatings = ratingsResponse.data.map((rating: any) => ({
        id: rating.id,
        businessName:
          rating.supplier?.profile?.business_name ||
          rating.supplier?.name ||
          "Unknown Business",
        customerName:
          rating.raterSupplier?.profile?.business_name ||
          rating.raterSupplier?.name ||
          "Anonymous",
        rating: rating.score,
        reviewText: rating.comment || "",
        submissionDate: rating.createdAt,
        status: rating.status,
        flagged: rating.status === "flagged",
        customerProfileImage: rating.raterSupplier?.profile_image,
        businessProfileImage:
          rating.supplier?.profile?.business_image ||
          rating.supplier?.profile_image,
      }));
      setPendingReviews(formattedRatings);

      // Refresh approved today count if action was approve
      if (action === "approve") {
        await refreshApprovedToday();
      }

      // Show success toast based on action
      const actionMessages = {
        approve: t("contentManagement.notifications.reviewApproved"),
        reject: t("contentManagement.notifications.reviewRejected"),
        flag: t("contentManagement.notifications.reviewFlagged"),
      };

      toast.success(
        actionMessages[action as keyof typeof actionMessages] ||
          t("contentManagement.notifications.reviewActionCompleted"),
      );
    } catch (error) {
      console.error(`Failed to ${action} review:`, error);
      setError(`Failed to ${action} review. Please try again.`);
    } finally {
      setActionLoading((prev) => ({ ...prev, [actionKey]: false }));
    }
  };

  const handleDocumentAction = async (
    action: string,
    docId: number,
  ): Promise<void> => {
    // Check permissions for delete actions
    if (action === "reject" || action === "delete") {
      if (!canDeleteContent && !canSuperviseContent) {
        return;
      }
    }

    const actionKey = `doc-${action}-${docId}`;
    setActionLoading((prev) => ({ ...prev, [actionKey]: true }));

    try {
      const { apiService } = await import("../lib/api");

      switch (action) {
        case "approve":
          await apiService.approveDocument(docId);
          break;
        case "reject":
          await apiService.rejectDocument(docId);
          break;
        case "view":
          // Handle view action - open document link
          const document = documentVerifications.find(
            (doc) => doc.id === docId,
          );
          if (document?.documentLink) {
            window.open(document.documentLink, "_blank");
          }
          setActionLoading((prev) => ({ ...prev, [actionKey]: false }));
          return;
        default:
          setActionLoading((prev) => ({ ...prev, [actionKey]: false }));
          return;
      }

      // Refresh data after action
      const documentsResponse = await apiService.getDocuments("all");
      const formattedDocuments = documentsResponse.data.map((doc: any) => ({
        id: doc.id,
        businessName: doc.business?.name || "Unknown Business",
        ownerName: doc.business?.owner_name || "Unknown Owner",
        documentType: doc.document_type || "Unknown",
        crNumber: doc.cr_number || "",
        uploadDate: doc.created_at,
        issueDate: doc.issue_date || doc.created_at,
        expiryDate: doc.expiry_date || "",
        status: doc.status,
        reviewer: doc.reviewer?.name || null,
        notes: doc.notes || null,
        documentLink: doc.document_link,
      }));
      setDocumentVerifications(formattedDocuments);

      // Refresh approved today count if action was approve
      if (action === "approve") {
        await refreshApprovedToday();
      }

      // Show success toast based on action
      const actionMessages = {
        approve: t("contentManagement.notifications.documentApproved"),
        reject: t("contentManagement.notifications.documentRejected"),
      };

      toast.success(
        actionMessages[action as keyof typeof actionMessages] ||
          t("contentManagement.notifications.documentActionCompleted"),
      );
    } catch (error) {
      console.error(`Failed to ${action} document:`, error);
      setError(`Failed to ${action} document. Please try again.`);
    } finally {
      setActionLoading((prev) => ({ ...prev, [actionKey]: false }));
    }
  };

  const handleContentAction = (
    action: string,
    reportId: number,
    type: string,
  ): void => {
    // Check permissions for delete actions
    if (action === "reject" || action === "delete") {
      if (!canDeleteContent && !canSuperviseContent) {
        return;
      }
    }
    setReportedContent((prev) =>
      prev.filter((report) => report.id !== reportId),
    );
  };

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8">
      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <i className="ri-alert-line text-red-600"></i>
            <span className="text-red-800 font-medium">{error}</span>
            <button
              onClick={() => setError(null)}
              className="ml-auto text-red-600 hover:text-red-800"
            >
              <i className="ri-close-line"></i>
            </button>
          </div>
        </div>
      )}

      {/* Loading Indicator */}
      {loading && (
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500"></div>
          <span className="ml-3 text-gray-600">Loading data...</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-800">
          {t("contentManagement.title")}
        </h2>
        <div className="flex flex-col sm:flex-row gap-3">
          {selectedItems.length > 0 && canSuperviseContent && (
            <div className="flex gap-2">
              <button
                onClick={() => handleBulkAction("approve")}
                className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-4 py-2.5 rounded-lg hover:from-green-600 hover:to-emerald-700 font-medium text-sm whitespace-nowrap cursor-pointer transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
              >
                <i className="ri-check-line mr-2"></i>
                {t("contentManagement.buttons.approve")} ({selectedItems.length}
                )
              </button>
              <button
                onClick={() => handleBulkAction("reject")}
                className="bg-gradient-to-r from-red-500 to-rose-600 text-white px-4 py-2.5 rounded-lg hover:from-red-600 hover:to-rose-700 font-medium text-sm whitespace-nowrap cursor-pointer transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
              >
                <i className="ri-close-line mr-2"></i>
                {t("contentManagement.buttons.reject")} ({selectedItems.length})
              </button>
            </div>
          )}
          {canSuperviseContent && (
            <button
              onClick={() => {
                /* export logic */
              }}
              className="px-4 sm:px-6 py-2 rounded-lg font-medium text-sm whitespace-nowrap bg-blue-500 text-white hover:bg-blue-600 cursor-pointer"
            >
              <i className="ri-download-line mr-2"></i>
              {t("contentManagement.buttons.exportReport")}
            </button>
          )}
        </div>
      </div>

      {/* Content Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4 lg:gap-6">
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
                {approvedToday}
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
                  value={filterReadStatus}
                  onChange={(e) => setFilterReadStatus(e.target.value)}
                  className="px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-400 focus:border-transparent text-sm w-full sm:w-auto"
                >
                  <option value="true">
                    {t("contentManagement.filters.read")}
                  </option>
                  <option value="false">
                    {t("contentManagement.filters.unread")}
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
                                businessesWithInquiries.map((b) => b.id),
                              );
                            } else {
                              setSelectedItems([]);
                            }
                          }}
                          checked={
                            selectedItems.length ===
                              businessesWithInquiries.length &&
                            businessesWithInquiries.length > 0
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
                        {t("contentManagement.table.views")}
                      </th>
                      <th className="text-left py-3 px-4 sm:px-6 text-sm font-medium text-gray-700">
                        {t("contentManagement.table.created")}
                      </th>
                      <th className="text-left py-3 px-4 sm:px-6 text-sm font-medium text-gray-700">
                        {t("contentManagement.table.actions")}
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {businessesWithInquiries.map((business) => (
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
                                    (id) => id !== business.id,
                                  ),
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
                              business.createdDate,
                            ).toLocaleDateString()}
                          </p>
                          {business.hasInquiries && (
                            <div className="mt-1">
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                                <i className="ri-message-3-line mr-1"></i>
                                {business.unreadInquiries > 0
                                  ? `${business.unreadInquiries} unread`
                                  : `${business.inquiries.length} inquiries`}
                              </span>
                            </div>
                          )}
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
                              business.status,
                            )}`}
                          >
                            {business.status.replace("_", " ")}
                          </span>
                        </td>
                        <td className="py-4 px-4 sm:px-6">
                          <span className="font-medium text-gray-800 text-sm sm:text-base">
                            {business.views}
                          </span>
                        </td>
                        <td className="py-4 px-4 sm:px-6">
                          <p className="text-gray-800 text-sm sm:text-base">
                            {new Date(
                              business.createdDate,
                            ).toLocaleDateString()}
                          </p>
                        </td>
                        <td className="py-4 px-4 sm:px-6">
                          <div className="flex items-center space-x-1 sm:space-x-2">
                            <button
                              className="text-blue-600 hover:text-blue-700 cursor-pointer"
                              title={t("contentManagement.actions.viewDetails")}
                            >
                              <i className="ri-eye-line text-sm sm:text-base"></i>
                            </button>
                            {canSuperviseContent && (
                              <>
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
                                  onClick={async () => {
                                    try {
                                      const { apiService } =
                                        await import("../lib/api");
                                      await apiService.updateSupplier(
                                        business.id,
                                        { status: "approved" },
                                      );

                                      // Update local state
                                      setBusinesses((prev) =>
                                        prev.map((b) =>
                                          b.id === business.id
                                            ? { ...b, status: "approved" }
                                            : b,
                                        ),
                                      );

                                      // Refresh approved today count
                                      await refreshApprovedToday();

                                      toast.success(
                                        t(
                                          "contentManagement.notifications.businessApproved",
                                        ),
                                      );
                                    } catch (error) {
                                      console.error(
                                        "Failed to approve business:",
                                        error,
                                      );
                                      toast.error(
                                        t(
                                          "contentManagement.notifications.businessActionError",
                                        ),
                                      );
                                    }
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
                                          : b,
                                      ),
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
                                          "contentManagement.messages.deleteConfirm",
                                        ),
                                      )
                                    )
                                      return;
                                    setBusinesses((prev) =>
                                      prev.filter((b) => b.id !== business.id),
                                    );
                                    setSelectedItems((prev) =>
                                      prev.filter((id) => id !== business.id),
                                    );
                                  }}
                                  className="text-red-600 hover:text-red-700 cursor-pointer"
                                  title={t("contentManagement.actions.delete")}
                                >
                                  <i className="ri-delete-bin-line text-sm sm:text-base"></i>
                                </button>
                              </>
                            )}
                            {/* Inquiries actions */}
                            {business.hasInquiries && (
                              <>
                                <div className="border-l border-gray-300 h-4 mx-1"></div>
                                {business.inquiries.map((inquiry) => (
                                  <div
                                    key={inquiry.id}
                                    className="flex items-center space-x-1"
                                  >
                                    {!inquiry.is_read ? (
                                      <span
                                        className="text-yellow-500"
                                        title="Unread"
                                      >
                                        <i className="ri-circle-fill text-sm"></i>
                                      </span>
                                    ) : null}
                                    {inquiry.sender_id &&
                                    inquiry.sender_id !== 0 ? (
                                      <button
                                        className="text-blue-600 hover:text-blue-700 cursor-pointer"
                                        title="Reply to inquiry"
                                      >
                                        <i className="ri-reply-line text-sm sm:text-base"></i>
                                      </button>
                                    ) : null}
                                  </div>
                                ))}
                              </>
                            )}
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
                    {filteredReviews.filter((r) => r.flagged).length}{" "}
                    {t("contentManagement.reviews.flagged")}
                  </span>
                </div>
              </div>

              {filteredReviews.map((review) => (
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
                        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden">
                          {review.businessProfileImage ? (
                            <img
                              src={review.businessProfileImage}
                              alt={review.businessName}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full bg-orange-100 flex items-center justify-center">
                              <i className="ri-store-line text-orange-600 text-lg sm:text-xl"></i>
                            </div>
                          )}
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
                            {review.submissionDate
                              ? new Date(
                                  review.submissionDate,
                                ).toLocaleDateString()
                              : "N/A"}
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
                    </div>

                    <div className="flex flex-col space-y-2 lg:ml-4 lg:w-auto w-full">
                      <button
                        onClick={() => setSelectedReview(review)}
                        className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-2.5 rounded-lg hover:from-blue-600 hover:to-blue-700 text-xs sm:text-sm font-medium cursor-pointer whitespace-nowrap transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                      >
                        <i className="ri-eye-line mr-2"></i>
                        {t("contentManagement.actions.viewDetails")}
                      </button>
                      {canSuperviseContent && (
                        <>
                          <button
                            onClick={() =>
                              handleReviewAction("approve", review.id)
                            }
                            disabled={actionLoading[`approve-${review.id}`]}
                            className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-4 py-2.5 rounded-lg hover:from-green-600 hover:to-emerald-700 text-xs sm:text-sm font-medium cursor-pointer whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 disabled:transform-none disabled:shadow-sm"
                          >
                            {actionLoading[`approve-${review.id}`] ? (
                              <i className="ri-loader-4-line animate-spin mr-2"></i>
                            ) : (
                              <i className="ri-check-line mr-2"></i>
                            )}
                            {t("contentManagement.actions.approve")}
                          </button>
                          <button
                            onClick={() =>
                              handleReviewAction("reject", review.id)
                            }
                            disabled={actionLoading[`reject-${review.id}`]}
                            className="bg-gradient-to-r from-red-500 to-rose-600 text-white px-4 py-2.5 rounded-lg hover:from-red-600 hover:to-rose-700 text-xs sm:text-sm font-medium cursor-pointer whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 disabled:transform-none disabled:shadow-sm"
                          >
                            {actionLoading[`reject-${review.id}`] ? (
                              <i className="ri-loader-4-line animate-spin mr-2"></i>
                            ) : (
                              <i className="ri-close-line mr-2"></i>
                            )}
                            {t("contentManagement.actions.reject")}
                          </button>
                          {!review.flagged && (
                            <button
                              onClick={() =>
                                handleReviewAction("flag", review.id)
                              }
                              disabled={actionLoading[`flag-${review.id}`]}
                              className="bg-gradient-to-r from-amber-500 to-orange-600 text-white px-4 py-2.5 rounded-lg hover:from-amber-600 hover:to-orange-700 text-xs sm:text-sm font-medium cursor-pointer whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 disabled:transform-none disabled:shadow-sm"
                            >
                              {actionLoading[`flag-${review.id}`] ? (
                                <i className="ri-loader-4-line animate-spin mr-2"></i>
                              ) : (
                                <i className="ri-flag-line mr-2"></i>
                              )}
                              {t("contentManagement.actions.flag")}
                            </button>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))}

              {filteredReviews.length === 0 && (
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
                            doc.status,
                          )} flex-shrink-0`}
                        >
                          {doc.status.replace("_", " ")}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 mb-4">
                        <div>
                          <span className="font-medium text-gray-700 text-sm">
                            {t("contentManagement.verification.uploadDate")}:
                          </span>
                          <p className="text-gray-600 text-sm">
                            {new Date(doc.uploadDate).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col space-y-2 lg:ml-4 lg:w-auto w-full">
                      <button
                        onClick={() => handleDocumentAction("view", doc.id)}
                        disabled={actionLoading[`doc-view-${doc.id}`]}
                        className="text-blue-600 p-2.5 rounded-lg cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:-translate-y-0.5 disabled:transform-none "
                      >
                        {actionLoading[`doc-view-${doc.id}`] ? (
                          <i className="ri-loader-4-line animate-spin text-lg"></i>
                        ) : (
                          <i className="ri-eye-line text-lg"></i>
                        )}
                      </button>
                      {canSuperviseContent && (
                        <>
                          <button
                            onClick={() =>
                              handleDocumentAction("approve", doc.id)
                            }
                            disabled={actionLoading[`doc-approve-${doc.id}`]}
                            className="text-green-600 p-2.5 rounded-lg cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:-translate-y-0.5 disabled:transform-none "
                          >
                            {actionLoading[`doc-approve-${doc.id}`] ? (
                              <i className="ri-loader-4-line animate-spin text-lg"></i>
                            ) : (
                              <i className="ri-check-line text-lg"></i>
                            )}
                          </button>
                          <button
                            onClick={() =>
                              handleDocumentAction("reject", doc.id)
                            }
                            disabled={actionLoading[`doc-reject-${doc.id}`]}
                            className="text-red-600 p-2.5 rounded-lg cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:-translate-y-0.5 disabled:transform-none "
                          >
                            {actionLoading[`doc-reject-${doc.id}`] ? (
                              <i className="ri-loader-4-line animate-spin text-lg"></i>
                            ) : (
                              <i className="ri-close-line text-lg"></i>
                            )}
                          </button>
                        </>
                      )}
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

          {/* Inquiries Tab */}
          {activeTab === "inquiries" && (
            <div className="space-y-4">
              <div className="px-6 py-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-800">
                    {t("contentManagement.tabs.inquiries")}
                  </h3>
                  <select
                    value={filterReadStatus}
                    onChange={(e) => setFilterReadStatus(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-400 focus:border-transparent text-sm"
                  >
                    <option value="true">
                      {t("contentManagement.filters.read")}
                    </option>
                    <option value="false">
                      {t("contentManagement.filters.unread")}
                    </option>
                  </select>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[800px]">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="text-left py-3 px-4 sm:px-6 text-sm font-medium text-gray-700">
                        {t("contentManagement.inquiries.sender")}
                      </th>
                      <th className="text-left py-3 px-4 sm:px-6 text-sm font-medium text-gray-700">
                        {t("contentManagement.inquiries.subject")}
                      </th>
                      <th className="text-left py-3 px-4 sm:px-6 text-sm font-medium text-gray-700">
                        {t("contentManagement.inquiries.type")}
                      </th>
                      <th className="text-left py-3 px-4 sm:px-6 text-sm font-medium text-gray-700">
                        {t("contentManagement.inquiries.from")}
                      </th>
                      <th className="text-left py-3 px-4 sm:px-6 text-sm font-medium text-gray-700">
                        {t("contentManagement.inquiries.status")}
                      </th>
                      <th className="text-left py-3 px-4 sm:px-6 text-sm font-medium text-gray-700">
                        {t("contentManagement.inquiries.date")}
                      </th>
                      <th className="text-left py-3 px-4 sm:px-6 text-sm font-medium text-gray-700">
                        {t("contentManagement.table.actions")}
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {(inquiries || []).map((inquiry) => (
                      <tr key={inquiry.id} className="hover:bg-gray-50">
                        <td className="py-4 px-4 sm:px-6">
                          <div>
                            <p className="font-medium text-gray-800 text-sm sm:text-base">
                              {inquiry.full_name}
                            </p>
                            <p className="text-xs sm:text-sm text-gray-600">
                              {inquiry.email_address}
                            </p>
                            {inquiry.phone_number && (
                              <p className="text-xs sm:text-sm text-gray-600">
                                {inquiry.phone_number}
                              </p>
                            )}
                          </div>
                        </td>
                        <td className="py-4 px-4 sm:px-6">
                          <p className="text-gray-800 text-sm sm:text-base font-medium">
                            {inquiry.subject}
                          </p>
                          <p className="text-xs sm:text-sm text-gray-600 truncate max-w-xs">
                            {inquiry.message}
                          </p>
                        </td>
                        <td className="py-4 px-4 sm:px-6">
                          <span
                            className={`px-2 py-1 rounded text-xs sm:text-sm ${
                              inquiry.type === "inquiry"
                                ? "bg-blue-100 text-blue-600"
                                : "bg-green-100 text-green-600"
                            }`}
                          >
                            {t(
                              `contentManagement.inquiries.types.${inquiry.type}`,
                            )}
                          </span>
                        </td>
                        <td className="py-4 px-4 sm:px-6">
                          <span
                            className={`px-2 py-1 rounded text-xs sm:text-sm ${
                              inquiry.from === "supplier"
                                ? "bg-purple-100 text-purple-600"
                                : "bg-orange-100 text-orange-600"
                            }`}
                          >
                            {t(
                              `contentManagement.inquiries.fromTypes.${inquiry.from}`,
                            )}
                          </span>
                        </td>
                        <td className="py-4 px-4 sm:px-6">
                          <span
                            className={`px-2 py-1 rounded text-xs sm:text-sm ${
                              inquiry.is_read
                                ? "bg-gray-100 text-gray-600"
                                : "bg-yellow-100 text-yellow-600"
                            }`}
                          >
                            {t(
                              `contentManagement.inquiries.statusTypes.${
                                inquiry.is_read ? "read" : "unread"
                              }`,
                            )}
                          </span>
                        </td>
                        <td className="py-4 px-4 sm:px-6">
                          <p className="text-gray-800 text-sm sm:text-base">
                            {new Date(inquiry.created_at).toLocaleDateString()}
                          </p>
                        </td>
                        <td className="py-4 px-4 sm:px-6">
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => handleViewInquiry(inquiry)}
                              className="text-blue-600 hover:text-blue-700 cursor-pointer"
                              title={t("contentManagement.actions.view")}
                            >
                              <i className="ri-eye-line text-lg"></i>
                            </button>
                            {inquiry.from === "supplier" && (
                              <button
                                onClick={() =>
                                  handleReplyToInquiryClick(inquiry)
                                }
                                className="text-green-600 hover:text-green-700 cursor-pointer"
                                title={t("contentManagement.actions.reply")}
                              >
                                <i className="ri-reply-line text-lg"></i>
                              </button>
                            )}
                            {!inquiry.is_read && (
                              <span className="text-yellow-500" title="Unread">
                                <i className="ri-circle-fill text-sm"></i>
                              </span>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {(inquiries || []).length === 0 && (
                <div className="text-center py-8 sm:py-12 text-gray-500">
                  <i className="ri-message-3-line text-3xl sm:text-4xl mb-3 sm:mb-4"></i>
                  <p className="text-sm sm:text-base">
                    {t("contentManagement.inquiries.noInquiries")}
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
                            report.status,
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
                      {canSuperviseContent && (
                        <>
                          <button
                            onClick={() =>
                              handleContentAction(
                                "approve",
                                report.id,
                                "report",
                              )
                            }
                            className="bg-green-500 text-white px-3 py-2 rounded hover:bg-green-600 text-xs sm:text-sm cursor-pointer w-full lg:w-auto"
                          >
                            {t("contentManagement.actions.approve")}
                          </button>
                          <button
                            onClick={() =>
                              handleContentAction(
                                "takedown",
                                report.id,
                                "report",
                              )
                            }
                            className="bg-red-500 text-white px-3 py-2 rounded hover:bg-red-600 text-xs sm:text-sm cursor-pointer w-full lg:w-auto"
                          >
                            {t("contentManagement.actions.takeDown")}
                          </button>
                        </>
                      )}
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
                  <div className="flex items-center space-x-3 mt-1">
                    <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
                      {selectedReview.businessProfileImage ? (
                        <img
                          src={selectedReview.businessProfileImage}
                          alt={selectedReview.businessName}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                          <i className="ri-store-line text-gray-400 text-lg"></i>
                        </div>
                      )}
                    </div>
                    <p className="text-gray-800 text-sm sm:text-base">
                      {selectedReview.businessName}
                    </p>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    {t("contentManagement.reviewModal.submittedBy")}
                  </label>
                  <div className="flex items-center space-x-3 mt-1">
                    <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
                      {selectedReview.customerProfileImage ? (
                        <img
                          src={selectedReview.customerProfileImage}
                          alt={selectedReview.customerName}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                          <i className="ri-user-line text-gray-400 text-lg"></i>
                        </div>
                      )}
                    </div>
                    <p className="text-gray-800 text-sm sm:text-base">
                      {selectedReview.customerName}
                    </p>
                  </div>
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
                    {selectedReview?.submissionDate
                      ? new Date(
                          selectedReview.submissionDate,
                        ).toLocaleDateString()
                      : "N/A"}
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
                  className="px-4 sm:px-6 py-2.5 bg-gradient-to-r from-red-500 to-rose-600 text-white rounded-lg hover:from-red-600 hover:to-rose-700 font-medium text-sm cursor-pointer w-full sm:w-auto order-3 sm:order-2 transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                >
                  <i className="ri-close-line mr-2"></i>
                  {t("contentManagement.actions.rejectReview")}
                </button>
                <button
                  onClick={() => {
                    handleReviewAction("approve", selectedReview.id);
                    setSelectedReview(null);
                  }}
                  className="px-4 sm:px-6 py-2.5 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg hover:from-green-600 hover:to-emerald-700 font-medium text-sm cursor-pointer w-full sm:w-auto order-1 sm:order-3 transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
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
                        : b,
                    ),
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

      {/* Inquiry Details Modal */}
      {showInquiryModal && selectedInquiry && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <h2 className="text-xl font-semibold text-gray-800">
                  {t("contentManagement.inquiries.inquiryDetails")}
                </h2>
                <button
                  onClick={handleCloseInquiryModal}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <i className="ri-close-line text-2xl"></i>
                </button>
              </div>

              <div className="space-y-4">
                {/* Sender Information */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-medium text-gray-700 mb-3">
                    {t("contentManagement.inquiries.senderInfo")}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">
                        {t("contentManagement.inquiries.name")}
                      </p>
                      <p className="font-medium text-gray-800">
                        {selectedInquiry.full_name}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">
                        {t("contentManagement.inquiries.email")}
                      </p>
                      <p className="font-medium text-gray-800">
                        {selectedInquiry.email_address}
                      </p>
                    </div>
                    {selectedInquiry.phone_number && (
                      <div>
                        <p className="text-sm text-gray-600">
                          {t("contentManagement.inquiries.phone")}
                        </p>
                        <p className="font-medium text-gray-800">
                          {selectedInquiry.phone_number}
                        </p>
                      </div>
                    )}
                    <div>
                      <p className="text-sm text-gray-600">
                        {t("contentManagement.inquiries.senderId")}
                      </p>
                      <p className="font-medium text-gray-800">
                        {selectedInquiry.sender_id || "N/A"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Inquiry Details */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-medium text-gray-700 mb-3">
                    {t("contentManagement.inquiries.inquiryInfo")}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">
                        {t("contentManagement.inquiries.subject")}
                      </p>
                      <p className="font-medium text-gray-800">
                        {selectedInquiry.subject}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">
                        {t("contentManagement.inquiries.type")}
                      </p>
                      <span
                        className={`px-2 py-1 rounded text-xs font-medium ${
                          selectedInquiry.type === "inquiry"
                            ? "bg-blue-100 text-blue-600"
                            : "bg-green-100 text-green-600"
                        }`}
                      >
                        {t(
                          `contentManagement.inquiries.types.${selectedInquiry.type}`,
                        )}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">
                        {t("contentManagement.inquiries.from")}
                      </p>
                      <span
                        className={`px-2 py-1 rounded text-xs font-medium ${
                          selectedInquiry.from === "supplier"
                            ? "bg-purple-100 text-purple-600"
                            : "bg-orange-100 text-orange-600"
                        }`}
                      >
                        {t(
                          `contentManagement.inquiries.fromTypes.${selectedInquiry.from}`,
                        )}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">
                        {t("contentManagement.inquiries.status")}
                      </p>
                      <span
                        className={`px-2 py-1 rounded text-xs font-medium ${
                          selectedInquiry.is_read
                            ? "bg-gray-100 text-gray-600"
                            : "bg-yellow-100 text-yellow-600"
                        }`}
                      >
                        {t(
                          `contentManagement.inquiries.statusTypes.${
                            selectedInquiry.is_read ? "read" : "unread"
                          }`,
                        )}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">
                        {t("contentManagement.inquiries.date")}
                      </p>
                      <p className="font-medium text-gray-800">
                        {new Date(
                          selectedInquiry.created_at,
                        ).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Message */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-medium text-gray-700 mb-3">
                    {t("contentManagement.inquiries.message")}
                  </h3>
                  <p className="text-gray-800 whitespace-pre-wrap">
                    {selectedInquiry.message}
                  </p>
                </div>

                {/* Reply Form */}
                {selectedInquiry.sender_id &&
                  selectedInquiry.sender_id !== 0 && (
                    <div className="mt-4 pt-4 border-t">
                      <h4 className="font-medium text-gray-700 mb-2">
                        {t("contentManagement.inquiries.reply")}
                      </h4>
                      <textarea
                        value={replyMessage}
                        onChange={(e) => setReplyMessage(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-lg mb-2"
                        rows={3}
                        placeholder={t(
                          "contentManagement.inquiries.replyPlaceholder",
                        )}
                      />
                      <div className="flex justify-end space-x-3">
                        <button
                          onClick={handleReplyToInquiry}
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
                          disabled={!replyMessage.trim() || isReplying}
                        >
                          {isReplying ? (
                            <>
                              <svg
                                className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                              >
                                <circle
                                  className="opacity-25"
                                  cx="12"
                                  cy="12"
                                  r="10"
                                  stroke="currentColor"
                                  strokeWidth="4"
                                ></circle>
                                <path
                                  className="opacity-75"
                                  fill="currentColor"
                                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                ></path>
                              </svg>
                              {t("contentManagement.inquiries.sending")}
                            </>
                          ) : (
                            t("contentManagement.inquiries.sendReply")
                          )}
                        </button>
                      </div>
                    </div>
                  )}

                {/* Actions */}
                <div className="flex justify-end space-x-3 pt-4 border-t">
                  <button
                    onClick={handleCloseInquiryModal}
                    className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    {t("contentManagement.actions.close")}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
