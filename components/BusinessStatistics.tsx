"use client";

import { useState, useEffect } from "react";
import { apiService } from "../lib/api";
import { useToast } from "../components/ToastContext";
import { useLanguage } from "../lib/LanguageContext";

interface BusinessStatistics {
  verified_businesses: number;
  successful_connections: number;
  average_rating: number;
}

export default function BusinessStatistics() {
  const [statistics, setStatistics] = useState<BusinessStatistics | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState<BusinessStatistics>({
    verified_businesses: 0,
    successful_connections: 0,
    average_rating: 0,
  });

  const { showToast } = useToast();
  const { t, isRTL } = useLanguage();

  // Fetch current statistics
  const fetchStatistics = async () => {
    try {
      setLoading(true);
      const data = await apiService.getBusinessesStatistics();
      setStatistics(data);
      setFormData(data);
    } catch (error) {
      console.error("Failed to fetch statistics:", error);
      showToast(
        isRTL ? "فشل في جلب الإحصائيات" : "Failed to fetch statistics",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  // Update statistics
  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setUpdating(true);
      const response = await apiService.updateBusinessesStatistics(formData);
      console.log("Update response:", response);
      setStatistics(formData);
      setEditMode(false);
      showToast(
        isRTL ? "تم تحديث الإحصائيات بنجاح" : "Statistics updated successfully",
        "success"
      );
    } catch (error) {
      console.error("Failed to update statistics:", error);
      showToast(
        isRTL ? "فشل في تحديث الإحصائيات" : "Failed to update statistics",
        "error"
      );
    } finally {
      setUpdating(false);
    }
  };

  // Handle form input changes
  const handleInputChange = (
    field: keyof BusinessStatistics,
    value: string
  ) => {
    const numValue = parseFloat(value) || 0;
    setFormData((prev) => ({
      ...prev,
      [field]: numValue,
    }));
  };

  useEffect(() => {
    fetchStatistics();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            {isRTL ? "الإحصائيات التجارية" : "Business Statistics"}
          </h2>
          <p className="text-gray-600 mt-1">
            {isRTL
              ? "إدارة وتحديث الإحصائيات التجارية المعروضة في الصفحة الرئيسية"
              : "Manage and update business statistics displayed on homepage"}
          </p>
        </div>
        {!editMode && (
          <button
            onClick={() => setEditMode(true)}
            className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors flex items-center gap-2"
          >
            <i className="ri-edit-line"></i>
            {isRTL ? "تحرير الإحصائيات" : "Edit Statistics"}
          </button>
        )}
      </div>

      {/* Current Statistics Display */}
      {!editMode && statistics && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  {isRTL ? "الشركات الموثقة" : "Verified Businesses"}
                </p>
                <p className="text-2xl font-bold text-gray-900 mt-2">
                  {statistics.verified_businesses.toLocaleString()}
                </p>
              </div>
              <div className="bg-blue-100 p-3 rounded-lg">
                <i className="ri-building-check-line text-blue-600 text-xl"></i>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  {isRTL ? "الوصلات الناجحة" : "Successful Connections"}
                </p>
                <p className="text-2xl font-bold text-gray-900 mt-2">
                  {statistics.successful_connections.toLocaleString()}
                </p>
              </div>
              <div className="bg-green-100 p-3 rounded-lg">
                <i className="ri-links-line text-green-600 text-xl"></i>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  {isRTL ? "متوسط التقييم" : "Average Rating"}
                </p>
                <p className="text-2xl font-bold text-gray-900 mt-2">
                  {statistics.average_rating.toFixed(1)}/5.0
                </p>
              </div>
              <div className="bg-yellow-100 p-3 rounded-lg">
                <i className="ri-star-line text-yellow-600 text-xl"></i>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Form */}
      {editMode && (
        <form
          onSubmit={handleUpdate}
          className="bg-white rounded-xl border border-gray-200 p-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-6">
            {isRTL ? "تحديث الإحصائيات" : "Update Statistics"}
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {isRTL ? "الشركات الموثقة" : "Verified Businesses"}
              </label>
              <input
                type="number"
                value={formData.verified_businesses}
                onChange={(e) =>
                  handleInputChange("verified_businesses", e.target.value)
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                min="0"
                step="1"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {isRTL ? "الوصلات الناجحة" : "Successful Connections"}
              </label>
              <input
                type="number"
                value={formData.successful_connections}
                onChange={(e) =>
                  handleInputChange("successful_connections", e.target.value)
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                min="0"
                step="1"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {isRTL ? "متوسط التقييم" : "Average Rating"}
              </label>
              <input
                type="number"
                value={formData.average_rating}
                onChange={(e) =>
                  handleInputChange("average_rating", e.target.value)
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                min="0"
                max="5"
                step="0.1"
                required
              />
            </div>
          </div>

          <div className="flex gap-3 mt-6">
            <button
              type="submit"
              disabled={updating}
              className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {updating ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  {isRTL ? "جاري التحديث..." : "Updating..."}
                </>
              ) : (
                <>
                  <i className="ri-save-line"></i>
                  {isRTL ? "حفظ التغييرات" : "Save Changes"}
                </>
              )}
            </button>
            <button
              type="button"
              onClick={() => {
                setEditMode(false);
                setFormData(
                  statistics || {
                    verified_businesses: 0,
                    successful_connections: 0,
                    average_rating: 0,
                  }
                );
              }}
              className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors flex items-center gap-2"
            >
              <i className="ri-close-line"></i>
              {isRTL ? "إلغاء" : "Cancel"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
