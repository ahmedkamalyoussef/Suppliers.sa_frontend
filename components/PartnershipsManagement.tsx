"use client";

import { useState, useEffect } from "react";
import { apiService } from "../lib/api";
import { useToast } from "./ToastContext";
import { useAuth } from "../hooks/useAuth";
import type {
  Partnership,
  CreatePartnershipRequest,
  UpdatePartnershipRequest,
  DeletePartnershipResponse,
} from "../lib/types/partnerships";

export default function PartnershipsManagement() {
  const [partnerships, setPartnerships] = useState<Partnership[]>([]);
  const [loading, setLoading] = useState(true);
  const [accessDenied, setAccessDenied] = useState<boolean>(false);
  const [permissions, setPermissions] = useState<any>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingPartnership, setEditingPartnership] =
    useState<Partnership | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    image: null as File | null,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { showToast } = useToast();
  const { user } = useAuth();

  // Fetch permissions from API
  useEffect(() => {
    if (!user) return;

    const fetchPermissions = async () => {
      try {
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
        console.error("Failed to fetch permissions:", error);
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

  const canView =
    hasPermission("content_management_view") ||
    hasPermission("content_management_supervise");
  const canCreate = hasPermission("content_management_supervise");
  const canEdit = hasPermission("content_management_supervise");
  const canDelete =
    hasPermission("content_management_supervise") ||
    hasPermission("content_management_delete");

  // Fetch partnerships
  const fetchPartnerships = async () => {
    if (!canView) {
      return;
    }

    try {
      const response = await apiService.getPartnerships();
      setPartnerships(Array.isArray(response) ? response : []);
    } catch (error) {
      console.error("Failed to fetch partnerships:", error);
      showToast("Failed to fetch partnerships", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!accessDenied && canView) {
      fetchPartnerships();
    } else {
      setLoading(false);
    }
  }, [accessDenied, canView]);

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!canCreate && !canEdit) {
      showToast("You don't have permission to perform this action", "error");
      return;
    }

    if (!formData.name || (!formData.image && !editingPartnership)) {
      showToast("Please fill in all required fields", "error");
      return;
    }

    setIsSubmitting(true);
    try {
      const formDataToSend = new FormData();
      formDataToSend.append("name", formData.name);
      if (formData.image) {
        formDataToSend.append("image", formData.image);
      }

      if (editingPartnership) {
        // Update existing partnership
        await apiService.updatePartnership(
          editingPartnership.id,
          formDataToSend
        );
        showToast("Partnership updated successfully!", "success");
      } else {
        // Create new partnership
        await apiService.createPartnership(formDataToSend);
        showToast("Partnership created successfully!", "success");
      }

      // Reset form and refresh data
      setFormData({ name: "", image: null as File | null });
      setIsCreateModalOpen(false);
      setIsEditModalOpen(false);
      setEditingPartnership(null);
      fetchPartnerships();
    } catch (error) {
      console.error("Error:", error);
      showToast("Failed to save partnership. Please try again.", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle delete
  const handleDelete = async (id: number) => {
    if (!canDelete) {
      showToast("You don't have permission to delete partnerships", "error");
      return;
    }

    if (!confirm("Are you sure you want to delete this partnership?")) {
      return;
    }

    try {
      await apiService.deletePartnership(id);
      showToast("Partnership deleted successfully!", "success");
      fetchPartnerships();
    } catch (error) {
      console.error("Error:", error);
      showToast("Failed to delete partnership. Please try again.", "error");
    }
  };

  // Handle edit
  const handleEdit = (partnership: Partnership) => {
    if (!canEdit) {
      showToast("You don't have permission to edit partnerships", "error");
      return;
    }

    setEditingPartnership(partnership);
    setFormData({
      name: partnership.name,
      image: null as File | null,
    });
    setIsEditModalOpen(true);
  };

  // Reset form
  const resetForm = () => {
    setFormData({ name: "", image: null as File | null });
    setEditingPartnership(null);
    setIsCreateModalOpen(false);
    setIsEditModalOpen(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500"></div>
      </div>
    );
  }

  // Permission denied state
  if (accessDenied && user?.role !== "super_admin") {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <i className="ri-lock-line text-4xl text-gray-400 mb-4"></i>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Access Denied
          </h3>
          <p className="text-gray-600">
            You don't have permission to view partnerships management.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Partnerships Management
          </h2>
          <p className="text-gray-600 mt-1">
            Manage your trusted partnerships and partners
          </p>
        </div>
        {canCreate && (
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors flex items-center gap-2"
          >
            <i className="ri-add-line"></i>
            Add Partnership
          </button>
        )}
      </div>

      {/* Partnerships Grid */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Image
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Created At
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {partnerships.map((partnership) => (
                <tr key={partnership.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <img
                      src={partnership.image}
                      alt={partnership.name}
                      className="h-12 w-12 object-cover rounded-lg"
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {partnership.name}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">
                      {partnership.created_at
                        ? new Date(partnership.created_at).toLocaleDateString()
                        : "N/A"}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center gap-2">
                      {canEdit && (
                        <button
                          onClick={() => handleEdit(partnership)}
                          className="text-blue-600 hover:text-blue-900 transition-colors"
                        >
                          <i className="ri-edit-line"></i>
                          Edit
                        </button>
                      )}
                      {canDelete && (
                        <button
                          onClick={() => handleDelete(partnership.id)}
                          className="text-red-600 hover:text-red-900 transition-colors"
                        >
                          <i className="ri-delete-bin-line"></i>
                          Delete
                        </button>
                      )}
                      {!canEdit && !canDelete && (
                        <span className="text-gray-400 text-sm">
                          No actions available
                        </span>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {partnerships.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-500">
              <i className="ri-handshake-line text-4xl mb-4"></i>
              <p>No partnerships found</p>
              <p className="text-sm mt-2">
                Add your first partnership to get started
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Create/Edit Modal */}
      {(isCreateModalOpen || isEditModalOpen) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full mx-4">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  {editingPartnership
                    ? "Edit Partnership"
                    : "Add New Partnership"}
                </h3>
                <button
                  onClick={resetForm}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <i className="ri-close-line text-xl"></i>
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Name Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Partnership Name
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500"
                    placeholder="Enter partnership name"
                    required
                  />
                </div>

                {/* Image Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Partnership Image
                  </label>
                  <input
                    type="file"
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        image: e.target.files?.[0] || null,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500"
                    accept="image/*"
                    required={!editingPartnership}
                  />
                  {editingPartnership && (
                    <p className="text-xs text-gray-500 mt-1">
                      Leave empty to keep current image
                    </p>
                  )}
                </div>

                {/* Current Image Preview (Edit Mode) */}
                {editingPartnership && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Current Image
                    </label>
                    <img
                      src={editingPartnership.image}
                      alt={editingPartnership.name}
                      className="h-20 w-20 object-cover rounded-lg"
                    />
                  </div>
                )}

                {/* Form Actions */}
                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={resetForm}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 disabled:opacity-50 transition-colors"
                  >
                    {isSubmitting ? (
                      <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        {editingPartnership ? "Updating..." : "Creating..."}
                      </div>
                    ) : editingPartnership ? (
                      "Update Partnership"
                    ) : (
                      "Create Partnership"
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
