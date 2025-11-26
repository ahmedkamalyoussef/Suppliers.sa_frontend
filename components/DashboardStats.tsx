"use client";

import { useState, useEffect } from "react";
import { useLanguage } from "../lib/LanguageContext";
import { api } from "../lib/api/service";
import { API_CONFIG } from "../lib/api/config";

export default function DashboardStats() {
  const { t } = useLanguage();
  const [timeRange, setTimeRange] = useState("30");
  const [showAllActivity, setShowAllActivity] = useState(false);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    views: { current: 0, change: 0, trend: "up" as "up" | "down" },
    contacts: { current: 0, change: 0, trend: "up" as "up" | "down" },
    inquiries: { current: 0, change: 0, trend: "up" as "up" | "down" },
    rating: { current: 0, change: 0, trend: "up" as "up" | "down" },
  });
  const [recentActivities, setRecentActivities] = useState<any[]>([]);
 
  useEffect(() => {
    // fetchDashboardData();
  }, [timeRange]);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const response = await api.get<{
        success: boolean;
        data?: {
          stats?: {
            views?: number;
            viewsChange?: number;
            contacts?: number;
            contactsChange?: number;
            inquiries?: number;
            inquiriesChange?: number;
            rating?: number;
            ratingChange?: number;
          };
          recentActivities?: any[];
        };
      }>(API_CONFIG.supplier.dashboard, {
        params: { range: timeRange },
      });

      if (response.success && response.data) {
        const dashboardData = response.data;
        if (dashboardData.stats) {
          setStats({
            views: {
              current: dashboardData.stats.views || 0,
              change: Math.abs(dashboardData.stats.viewsChange || 0),
              trend:
                (dashboardData.stats.viewsChange || 0) >= 0 ? "up" : "down",
            },
            contacts: {
              current: dashboardData.stats.contacts || 0,
              change: Math.abs(dashboardData.stats.contactsChange || 0),
              trend:
                (dashboardData.stats.contactsChange || 0) >= 0 ? "up" : "down",
            },
            inquiries: {
              current: dashboardData.stats.inquiries || 0,
              change: Math.abs(dashboardData.stats.inquiriesChange || 0),
              trend:
                (dashboardData.stats.inquiriesChange || 0) >= 0 ? "up" : "down",
            },
            rating: {
              current: dashboardData.stats.rating || 0,
              change: Math.abs(dashboardData.stats.ratingChange || 0),
              trend:
                (dashboardData.stats.ratingChange || 0) >= 0 ? "up" : "down",
            },
          });
        }
        if (dashboardData.recentActivities) {
          setRecentActivities(dashboardData.recentActivities);
        }
      }
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const quickActions = [
    {
      title: "Update Business Hours",
      description: "Modify your working schedule",
      icon: "ri-time-line",
      color: "bg-blue-500",
      action: "hours",
    },
    {
      title: "Add New Products",
      description: "Update your product keywords",
      icon: "ri-add-circle-line",
      color: "bg-green-500",
      action: "products",
    },
    {
      title: "Respond to Reviews",
      description: "3 reviews need responses",
      icon: "ri-chat-1-line",
      color: "bg-yellow-500",
      action: "reviews",
    },
    {
      title: "Upload Photos",
      description: "Add more business images",
      icon: "ri-camera-line",
      color: "bg-purple-500",
      action: "photos",
    },
  ];

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Time Range Filter */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-800">
          {t("dashboard.overview")}
        </h2>
        <select
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value)}
          className="px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent text-sm pr-6 sm:pr-8 w-full sm:w-auto"
        >
          <option value="7">{t("dashboard.last7")}</option>
          <option value="30">{t("dashboard.last30")}</option>
          <option value="90">{t("dashboard.last90")}</option>
          <option value="365">{t("dashboard.last365")}</option>
        </select>
      </div>

      {/* Stats Cards */}
      {loading ? (
        <div className="flex justify-center items-center py-12">
          <i className="ri-loader-4-line animate-spin text-4xl text-yellow-500"></i>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <div className="bg-white p-4 sm:p-6 rounded-xl border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <i className="ri-eye-line text-blue-600 text-lg sm:text-xl"></i>
              </div>
              <span
                className={`text-xs sm:text-sm font-medium ${
                  stats.views.trend === "up" ? "text-green-600" : "text-red-600"
                }`}
              >
                <i
                  className={`${
                    stats.views.trend === "up"
                      ? "ri-arrow-up-line"
                      : "ri-arrow-down-line"
                  } mr-1`}
                ></i>
                {Math.abs(stats.views.change)}%
              </span>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-1">
              {stats.views.current.toLocaleString()}
            </h3>
            <p className="text-gray-600 text-xs sm:text-sm">
              {t("dashboard.profileViews")}
            </p>
          </div>

          <div className="bg-white p-4 sm:p-6 rounded-xl border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <i className="ri-contacts-line text-green-600 text-lg sm:text-xl"></i>
              </div>
              <span
                className={`text-xs sm:text-sm font-medium ${
                  stats.contacts.trend === "up"
                    ? "text-green-600"
                    : "text-red-600"
                }`}
              >
                <i
                  className={`${
                    stats.contacts.trend === "up"
                      ? "ri-arrow-up-line"
                      : "ri-arrow-down-line"
                  } mr-1`}
                ></i>
                {Math.abs(stats.contacts.change)}%
              </span>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-1">
              {stats.contacts.current}
            </h3>
            <p className="text-gray-600 text-xs sm:text-sm">
              {t("dashboard.contactRequests")}
            </p>
          </div>

          <div className="bg-white p-4 sm:p-6 rounded-xl border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <i className="ri-question-line text-yellow-600 text-lg sm:text-xl"></i>
              </div>
              <span
                className={`text-xs sm:text-sm font-medium ${
                  stats.inquiries.trend === "up"
                    ? "text-green-600"
                    : "text-red-600"
                }`}
              >
                <i
                  className={`${
                    stats.inquiries.trend === "up"
                      ? "ri-arrow-up-line"
                      : "ri-arrow-down-line"
                  } mr-1`}
                ></i>
                {Math.abs(stats.inquiries.change)}%
              </span>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-1">
              {stats.inquiries.current}
            </h3>
            <p className="text-gray-600 text-xs sm:text-sm">
              {t("dashboard.businessInquiries")}
            </p>
          </div>

          <div className="bg-white p-4 sm:p-6 rounded-xl border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <i className="ri-star-line text-purple-600 text-lg sm:text-xl"></i>
              </div>
              <span
                className={`text-xs sm:text-sm font-medium ${
                  stats.rating.trend === "up"
                    ? "text-green-600"
                    : "text-red-600"
                }`}
              >
                <i
                  className={`${
                    stats.rating.trend === "up"
                      ? "ri-arrow-up-line"
                      : "ri-arrow-down-line"
                  } mr-1`}
                ></i>
                {Math.abs(stats.rating.change)}
              </span>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-1">
              {stats.rating.current}
            </h3>
            <p className="text-gray-600 text-xs sm:text-sm">
              {t("dashboard.averageRating")}
            </p>
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div>
        <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-4 sm:mb-6">
          {t("dashboard.quickActions")}
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {quickActions.map((action, index) => (
            <button
              key={index}
              className="bg-white p-4 sm:p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all text-left cursor-pointer group"
            >
              <div
                className={`w-10 h-10 sm:w-12 sm:h-12 ${action.color} rounded-lg flex items-center justify-center mb-3 sm:mb-4 group-hover:scale-110 transition-transform`}
              >
                <i
                  className={`${action.icon} text-white text-lg sm:text-xl`}
                ></i>
              </div>
              <h4 className="font-semibold text-gray-800 mb-2 text-sm sm:text-base">
                {index === 0
                  ? t("dashboard.updateHours")
                  : index === 1
                  ? t("dashboard.addProducts")
                  : index === 2
                  ? t("dashboard.respondReviews")
                  : t("dashboard.uploadPhotos")}
              </h4>
              <p className="text-gray-600 text-xs sm:text-sm">
                {index === 0
                  ? t("dashboard.updateHoursDesc")
                  : index === 1
                  ? t("dashboard.addProductsDesc")
                  : index === 2
                  ? t("dashboard.respondReviewsDesc")
                  : t("dashboard.uploadPhotosDesc")}
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div>
        <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-4 sm:mb-6">
          {t("dashboard.recentActivity")}
        </h3>
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <i className="ri-loader-4-line animate-spin text-2xl text-yellow-500"></i>
            </div>
          ) : recentActivities.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <i className="ri-inbox-line text-4xl mb-2"></i>
              <p>{t("dashboard.noActivity")}</p>
            </div>
          ) : (
            <div className="space-y-1">
              {recentActivities.map((activity, index) => (
                <div
                  key={activity.id}
                  className={`p-4 sm:p-6 ${
                    index !== recentActivities.length - 1
                      ? "border-b border-gray-100"
                      : ""
                  }`}
                >
                  <div className="flex items-start space-x-3 sm:space-x-4">
                    <div
                      className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center ${activity.color}`}
                    >
                      <i className={`${activity.icon} text-xs sm:text-sm`}></i>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-gray-800 mb-1 text-sm sm:text-base">
                        {activity.title}
                      </h4>
                      <p className="text-gray-600 text-xs sm:text-sm mb-2">
                        {activity.message}
                      </p>
                      <span className="text-gray-400 text-xs">
                        {activity.time}
                      </span>
                    </div>
                    <button className="text-gray-400 hover:text-gray-600 cursor-pointer flex-shrink-0">
                      <i className="ri-more-line text-sm sm:text-base"></i>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {recentActivities.length > 0 && (
            <div className="p-3 sm:p-4 border-t border-gray-100">
              <button
                onClick={() => setShowAllActivity(true)}
                className="w-full text-center py-2 text-gray-600 hover:text-gray-800 font-medium text-xs sm:text-sm cursor-pointer"
              >
                {t("dashboard.viewAllActivity")}
                <i className="ri-arrow-right-line ml-1 sm:ml-2"></i>
              </button>
            </div>
          )}
        </div>
      </div>

      {showAllActivity && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-3 sm:p-4 z-50">
          <div className="bg-white rounded-2xl w-full max-w-3xl max-h-[80vh] overflow-hidden">
            <div className="p-4 sm:p-6 border-b border-gray-200 flex items-center justify-between">
              <h3 className="text-lg sm:text-xl font-bold text-gray-800">
                {t("dashboard.allActivity")}
              </h3>
              <button
                onClick={() => setShowAllActivity(false)}
                className="text-gray-400 hover:text-gray-600 text-xl sm:text-2xl cursor-pointer"
              >
                <i className="ri-close-line"></i>
              </button>
            </div>
            <div
              className="p-4 sm:p-6 overflow-y-auto"
              style={{ maxHeight: "calc(80vh - 88px)" }}
            >
              <div className="space-y-3">
                {recentActivities.map((activity) => (
                  <div
                    key={`all-${activity.id}`}
                    className="p-3 sm:p-4 border border-gray-100 rounded-xl flex items-start space-x-3 sm:space-x-4"
                  >
                    <div
                      className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center ${activity.color}`}
                    >
                      <i className={`${activity.icon} text-xs sm:text-sm`}></i>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-gray-800 mb-1 text-sm sm:text-base">
                        {activity.title}
                      </h4>
                      <p className="text-gray-600 text-xs sm:text-sm mb-1">
                        {activity.message}
                      </p>
                      <span className="text-gray-400 text-xs">
                        {activity.time}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="p-3 sm:p-4 border-t border-gray-100 flex justify-end">
              <button
                onClick={() => setShowAllActivity(false)}
                className="px-3 sm:px-4 py-2 rounded border border-gray-300 text-gray-700 hover:bg-gray-50 text-sm sm:text-base"
              >
                {t("dashboard.close")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
