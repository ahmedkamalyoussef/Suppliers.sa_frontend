"use client";

import { useState, useEffect } from "react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import BranchManagement from "../../components/BranchManagement";
import Toast from "../../components/Toast";
import { useLanguage } from "@/lib/LanguageContext";
import { apiService } from "@/lib/api";
import type {
  Branch,
  BranchCreateRequest,
  BranchUpdateRequest,
} from "@/lib/types";
import { useRouter } from "next/navigation";

export default function ManageBusinessesPage() {
  const { t } = useLanguage();
  const router = useRouter();

  const [branches, setBranches] = useState<Branch[]>([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [businessData, setBusinessData] = useState({
    businessName: "",
    category: "",
    businessType: "",
  });

  // Toast state
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error" | "info";
    isVisible: boolean;
  }>({
    message: "",
    type: "success",
    isVisible: false,
  });

  // Load business and branches data
  useEffect(() => {
    const initializePage = async () => {
      if (!apiService.isAuthenticated()) {
        router.push("/add-business");
        return;
      }

      try {
        // Load business data
        const profileData = await apiService.getProfile();
        setBusinessData({
          businessName: profileData.businessName || profileData.name || "",
          category: profileData.categories?.[0] || "",
          businessType: profileData.businessType || "",
        });

        // Load branches data from API
        const branchesResponse = await apiService.getBranches();
        setBranches(branchesResponse.branches || []);

        setIsAuthenticated(true);
      } catch (error) {
        console.error("Error loading data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    initializePage();
  }, [router]);

  // Toast helper function
  const showToast = (
    message: string,
    type: "success" | "error" | "info" = "success"
  ) => {
    setToast({ message, type, isVisible: true });
  };

  // API handler functions
  const handleSaveBranch = async (
    branchData: Branch,
    editingBranch: Branch | null
  ) => {
    try {
      if (editingBranch) {
        // Update existing branch
        const updateData: BranchUpdateRequest = {
          name: branchData.name,
          phone: branchData.phone,
          email: branchData.email,
          address: branchData.address,
          manager: branchData.manager,
          location: branchData.location,
          workingHours: branchData.workingHours,
          specialServices: branchData.specialServices,
          isMainBranch: branchData.isMainBranch,
          status: branchData.status as "active" | "inactive",
        };

        await apiService.updateBranch(editingBranch.id, updateData);

        // Update local state
        const updated = branches.map((b) =>
          b.id === editingBranch.id
            ? { ...branchData, id: editingBranch.id }
            : b
        );
        setBranches(updated);
        showToast(t("branchManagement.branchUpdated"), "success");
      } else {
        // Create new branch
        const createData: BranchCreateRequest = {
          name: branchData.name,
          phone: branchData.phone,
          email: branchData.email,
          address: branchData.address,
          manager_name: branchData.manager,
          location: branchData.location,
          workingHours: branchData.workingHours,
          specialServices: branchData.specialServices,
          isMainBranch: branchData.isMainBranch,
          status: branchData.status as "active" | "inactive",
        };

        const response = await apiService.createBranch(createData);

        // Add new branch to local state
        if (response.branch) {
          const updated = [...branches, response.branch];
          setBranches(updated);
          showToast(t("branchManagement.branchAdded"), "success");
        }
      }
    } catch (error) {
      console.error("Error saving branch:", error);
      showToast(t("branchManagement.error"), "error");
      throw error; // Re-throw to let the component handle the error
    }
  };

  const handleDeleteBranch = async (branchId: string) => {
    try {
      await apiService.deleteBranch(branchId);
      const updated = branches.filter((b) => b.id !== branchId);
      setBranches(updated);

      showToast(t("branchManagement.branchDeleted"), "success");
    } catch (error: any) {
      console.error("Error deleting branch:", error);

      // Show specific error message for main branch deletion
      if (error.message === "Cannot delete main branch") {
        showToast(t("branchManagement.mainBranchCannotDelete"), "error");
      } else {
        showToast(t("branchManagement.error"), "error");
      }
      throw error; // Re-throw to let the component handle the error
    }
  };

  const handleToggleBranchStatus = async (branchId: string) => {
    try {
      const branch = branches.find((b) => b.id === branchId);
      if (!branch) return;

      const newStatus = branch.status === "active" ? "inactive" : "active";

      await apiService.updateBranch(branchId, { status: newStatus });

      const updated = branches.map((b) =>
        b.id === branchId ? { ...b, status: newStatus } : b
      );
      setBranches(updated);
    } catch (error) {
      console.error("Error toggling branch status:", error);
      throw error; // Re-throw to let the component handle the error
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-yellow-400 border-t-transparent mx-auto mb-3"></div>
          <p className="text-gray-600 text-sm">Loading businesses...</p>
        </div>
      </div>
    );
  }

  // Redirect state
  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <main className="py-8 lg:py-12 bg-gradient-to-b from-yellow-50/50 to-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          {/* Header */}
          <div className="text-center mb-8 lg:mb-12">
            <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-3">
              {t("manageBusinesses.title")}
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              {t("manageBusinesses.subtitle")}
            </p>
          </div>

          {/* Branch Management Container */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 lg:p-8">
            <BranchManagement
              branches={branches}
              setBranches={setBranches}
              mainBusinessData={businessData}
              onSaveBranch={handleSaveBranch}
              onDeleteBranch={handleDeleteBranch}
              onToggleBranchStatus={handleToggleBranchStatus}
            />
          </div>
        </div>
      </main>

      <Footer />

      {/* Toast Notification */}
      <Toast
        message={toast.message}
        type={toast.type}
        isVisible={toast.isVisible}
        onClose={() => setToast({ ...toast, isVisible: false })}
      />
    </div>
  );
}
