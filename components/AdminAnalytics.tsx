"use client";

import { useState, useEffect } from "react";
import type React from "react";
import { useLanguage } from "../lib/LanguageContext";
import { useAuth } from "../hooks/useAuth";

type TimeRange = "7days" | "30days" | "90days" | "1year";
type ChartKey = "revenue" | "users" | "businesses" | "subscriptions";

type AnalyticsSeries = {
  current: number;
  previous: number;
  growth: number;
  data: number[];
};

type RevenuePlan = {
  plan: string;
  revenue: number;
  users: number;
  color: string;
};
type CategoryRow = {
  name: string;
  businesses: number;
  revenue: string;
  growth: number;
};
type ActivityRow = {
  date: string;
  newUsers: number;
  activeUsers: number;
  revenue: number;
};

export default function AdminAnalytics() {
  const { t } = useLanguage();
  const { user } = useAuth();

  const [accessDenied, setAccessDenied] = useState<boolean>(false);
  const [permissions, setPermissions] = useState<any>(null);
  const [timeRange, setTimeRange] = useState<TimeRange>("30days");
  const [chartType, setChartType] = useState<ChartKey>("revenue");
  const [analyticsData, setAnalyticsData] = useState<Record<
    ChartKey,
    AnalyticsSeries
  > | null>(null);
  const [topCategories, setTopCategories] = useState<CategoryRow[]>([]);
  const [revenueByPlan, setRevenueByPlan] = useState<RevenuePlan[]>([]);
  const [userActivity, setUserActivity] = useState<ActivityRow[]>([]);
  const [serverPerformance, setServerPerformance] = useState<any[]>([]);
  const [isExporting, setIsExporting] = useState<boolean>(false);

  // Permission checking functions
  const hasPermission = (permission: string) => {
    // Super admin has all permissions
    if (user?.role === "super_admin") return true;

    if (!user || !permissions) return false;

    return permissions[permission] === true;
  };

  const canViewAnalytics =
    user?.role === "super_admin" || hasPermission("analytics_view");
  const canExportAnalytics =
    user?.role === "super_admin" || hasPermission("analytics_export");

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

        // Check if all analytics permissions are false
        const allAnalyticsPermissionsFalse =
          !data.permissions.analytics_view &&
          !data.permissions.analytics_export;

        if (allAnalyticsPermissionsFalse) {
          setAccessDenied(true);
        }
      } catch (error) {
        console.error("Admin Analytics - API Error:", error);
      }
    };

    fetchPermissions();
  }, [user?.role]);

  const handleExport = async () => {
    if (!canExportAnalytics) return;
    
    setIsExporting(true);
    try {
      const { apiService } = await import("../lib/api");
      const range = timeRange === "7days" ? 7 : timeRange === "30days" ? 30 : timeRange === "90days" ? 90 : 365;
      await apiService.exportAdminAnalytics(range);
      
      console.log("Export successful");
    } catch (error) {
      console.error("Error exporting analytics:", error);
    } finally {
      setIsExporting(false);
    }
  };

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const { apiService } = await import("../lib/api");
        const range =
          timeRange === "7days"
            ? 7
            : timeRange === "30days"
            ? 30
            : timeRange === "90days"
            ? 90
            : 365;
        const data = await apiService.getAnalytics(range);
        console.log("Analytics data:", data);

        // Set analytics data
        const newAnalyticsData: Record<ChartKey, AnalyticsSeries> = {
          revenue: {
            current: data.revenue.current,
            previous:
              data.revenue.current / (1 + parseFloat(data.revenue.change)),
            growth: parseFloat(data.revenue.change),
            data: data.dailyUserActivity.map((day) => day.revenue),
          },
          users: {
            current: data.totalUsers.count,
            previous:
              data.totalUsers.count / (1 + parseFloat(data.totalUsers.change)),
            growth: parseFloat(data.totalUsers.change),
            data: data.dailyUserActivity.map((day) => day.newUsers),
          },
          businesses: {
            current: data.totalBusinesses.count,
            previous:
              data.totalBusinesses.count /
              (1 + parseFloat(data.totalBusinesses.change)),
            growth: parseFloat(data.totalBusinesses.change),
            data: data.dailyUserActivity.map((day, index) => {
              // Simulate business growth over time with some variation
              const baseValue = data.totalBusinesses.count;
              const variation = (index / data.dailyUserActivity.length) * parseFloat(data.totalBusinesses.change) * baseValue;
              return Math.round(baseValue - variation + (Math.random() * 10 - 5));
            }),
          },
          subscriptions: {
            current: data.paidSubscriptions.count,
            previous:
              data.paidSubscriptions.count /
              (1 + parseFloat(data.paidSubscriptions.change)),
            growth: parseFloat(data.paidSubscriptions.change),
            data: data.dailyUserActivity.map((day, index) => {
              // Simulate subscription growth over time with some variation
              const baseValue = data.paidSubscriptions.count;
              const variation = (index / data.dailyUserActivity.length) * parseFloat(data.paidSubscriptions.change) * baseValue;
              return Math.round(baseValue - variation + (Math.random() * 5 - 2));
            }),
          },
        };
        setAnalyticsData(newAnalyticsData);

        // Set top categories
        const newTopCategories: CategoryRow[] = data.topBusinessCategories.map(
          (cat) => ({
            name: cat.name,
            businesses: cat.businesses,
            revenue: cat.revenue,
            growth: parseFloat(cat.growth),
          })
        );
        setTopCategories(newTopCategories);

        // Set revenue by plan
        setRevenueByPlan(data.revenueByPlan);

        // Set user activity
        const newUserActivity: ActivityRow[] = data.dailyUserActivity
          .map((day) => ({
            date: day.date,
            newUsers: day.newUsers,
            activeUsers: day.activeUsers,
            revenue: day.revenue,
          }))
          .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        setUserActivity(newUserActivity);

        // Set server performance
        setServerPerformance(data.serverPerformance);
      } catch (error) {
        console.error("Error fetching analytics:", error);
      }
    };

    if (canViewAnalytics) {
      fetchAnalytics();
    }
  }, [timeRange, canViewAnalytics]);

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
            You don't have permission to access Analytics Dashboard
          </p>
        </div>
      </div>
    );
  }

  const getGrowthColor = (growth: number) => {
    return growth > 0 ? "text-green-600" : "text-red-600";
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat().format(num);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-800">
          {t("adminAnalytics.title")}
        </h2>
        <div className="flex flex-col sm:flex-row gap-3">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value as TimeRange)}
            className="px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-400 focus:border-transparent text-sm w-full sm:w-auto"
          >
            <option value="7days">{t("adminAnalytics.timeRange7")}</option>
            <option value="30days">{t("adminAnalytics.timeRange30")}</option>
            <option value="90days">{t("adminAnalytics.timeRange90")}</option>
            <option value="1year">{t("adminAnalytics.timeRange1Year")}</option>
          </select>
          <button
            disabled={!canExportAnalytics || isExporting}
            onClick={handleExport}
            className={`px-4 sm:px-6 py-2 rounded-lg font-medium text-sm whitespace-nowrap w-full sm:w-auto ${
              !canExportAnalytics || isExporting
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-blue-500 text-white hover:bg-blue-600 cursor-pointer"
            }`}
          >
            <i className={`${isExporting ? "ri-loader-4-line animate-spin" : "ri-download-line"} mr-2`}></i>
            {isExporting ? "Exporting..." : t("adminAnalytics.exportReport")}
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {analyticsData
          ? (
              Object.entries(analyticsData) as [ChartKey, AnalyticsSeries][]
            ).map(([key, data]) => (
              <div
                key={key}
                className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-100"
              >
                <div className="flex items-center justify-between mb-4">
                  <div
                    className={`w-10 h-10 sm:w-12 sm:h-12 rounded-lg flex items-center justify-center ${
                      key === "revenue"
                        ? "bg-green-100"
                        : key === "users"
                        ? "bg-blue-100"
                        : key === "businesses"
                        ? "bg-purple-100"
                        : "bg-yellow-100"
                    }`}
                  >
                    <i
                      className={`text-lg sm:text-xl ${
                        key === "revenue"
                          ? "ri-money-dollar-circle-line text-green-600"
                          : key === "users"
                          ? "ri-user-line text-blue-600"
                          : key === "businesses"
                          ? "ri-store-line text-purple-600"
                          : "ri-vip-crown-line text-yellow-600"
                      }`}
                    ></i>
                  </div>
                  <span
                    className={`text-xs sm:text-sm font-medium px-2 py-1 rounded-full ${
                      data.growth > 0
                        ? "bg-green-100 text-green-600"
                        : "bg-red-100 text-red-600"
                    }`}
                  >
                    {data.growth > 0 ? "+" : ""}
                    {data.growth}%
                  </span>
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-800 break-words">
                    {key === "revenue"
                      ? formatCurrency(data.current)
                      : formatNumber(data.current)}
                  </h3>
                  <p className="text-gray-600 text-xs sm:text-sm capitalize mt-1">
                    {key === "businesses"
                      ? t("adminAnalytics.totalBusinesses")
                      : key === "subscriptions"
                      ? t("adminAnalytics.paidSubscriptions")
                      : key === "revenue"
                      ? t("adminAnalytics.totalRevenue")
                      : key === "users"
                      ? t("adminAnalytics.totalUsers")
                      : `Total ${key}`}
                  </p>
                </div>

                {/* Mini Chart */}
                <div className="mt-3 sm:mt-4 h-6 sm:h-8 flex items-end space-x-0.5 sm:space-x-1">
                  {data.data.map((value: number, index: number) => (
                    <div
                      key={index}
                      className={`flex-1 rounded-t ${
                        key === "revenue"
                          ? "bg-green-200"
                          : key === "users"
                          ? "bg-blue-200"
                          : key === "businesses"
                          ? "bg-purple-200"
                          : "bg-yellow-200"
                      }`}
                      style={{
                        height: `${(value / Math.max(...data.data)) * 100}%`,
                      }}
                    ></div>
                  ))}
                </div>
              </div>
            ))
          : // Loading skeleton
            Array.from({ length: 4 }).map((_, index) => (
              <div
                key={index}
                className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-100"
              >
                <div className="animate-pulse">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-200 rounded-lg"></div>
                    <div className="h-6 w-12 bg-gray-200 rounded-full"></div>
                  </div>
                  <div className="h-8 w-24 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 w-16 bg-gray-200 rounded"></div>
                </div>
              </div>
            ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Revenue by Plan */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6">
          <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-4 sm:mb-6">
            {t("adminAnalytics.revenueByPlan")}
          </h3>
          <div className="space-y-3 sm:space-y-4">
            {revenueByPlan.length > 0
              ? revenueByPlan.map((plan, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center space-x-2 sm:space-x-3">
                      <div
                        className={`w-3 h-3 sm:w-4 sm:h-4 rounded ${plan.color}`}
                      ></div>
                      <div className="min-w-0 flex-1">
                        <p className="font-medium text-gray-800 text-sm sm:text-base truncate">
                          {plan.plan}
                        </p>
                        <p className="text-xs sm:text-sm text-gray-600 truncate">
                          {plan.users} {t("adminAnalytics.users")}
                        </p>
                      </div>
                    </div>
                    <div className="text-right min-w-0 flex-shrink-0 ml-2">
                      <p className="font-semibold text-gray-800 text-sm sm:text-base">
                        {formatCurrency(plan.revenue)}
                      </p>
                      <div className="w-20 sm:w-32 bg-gray-200 rounded-full h-1.5 sm:h-2 mt-1">
                        <div
                          className={`h-1.5 sm:h-2 rounded-full ${plan.color}`}
                          style={{
                            width: `${
                              (plan.revenue /
                                Math.max(
                                  ...revenueByPlan.map((p) => p.revenue)
                                )) *
                              100
                            }%`,
                          }}
                        ></div>
                      </div>
                    </div>
                  </div>
                ))
              : // Loading skeleton
                Array.from({ length: 3 }).map((_, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center space-x-2 sm:space-x-3">
                      <div className="w-3 h-3 sm:w-4 sm:h-4 bg-gray-200 rounded animate-pulse"></div>
                      <div className="min-w-0 flex-1">
                        <div className="h-4 w-16 bg-gray-200 rounded mb-1 animate-pulse"></div>
                        <div className="h-3 w-12 bg-gray-200 rounded animate-pulse"></div>
                      </div>
                    </div>
                    <div className="text-right min-w-0 flex-shrink-0 ml-2">
                      <div className="h-4 w-20 bg-gray-200 rounded mb-1 animate-pulse"></div>
                      <div className="w-20 bg-gray-200 rounded-full h-1.5 sm:h-2 animate-pulse"></div>
                    </div>
                  </div>
                ))}
          </div>
        </div>

        {/* Top Categories */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6">
          <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-4 sm:mb-6">
            {t("adminAnalytics.topBusinessCategories")}
          </h3>
          <div className="space-y-3 sm:space-y-4">
            {topCategories.length > 0
              ? topCategories.map((category, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center space-x-2 sm:space-x-3 min-w-0 flex-1">
                      <div className="w-6 h-6 sm:w-8 sm:h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <span className="text-blue-600 font-semibold text-xs sm:text-sm">
                          {index + 1}
                        </span>
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-medium text-gray-800 text-sm sm:text-base truncate">
                          {category.name}
                        </p>
                        <p className="text-xs sm:text-sm text-gray-600 truncate">
                          {category.businesses} {t("adminAnalytics.businesses")}
                        </p>
                      </div>
                    </div>
                    <div className="text-right min-w-0 flex-shrink-0 ml-2">
                      <p className="font-semibold text-gray-800 text-sm sm:text-base">
                        {category.revenue}
                      </p>
                      <p
                        className={`text-xs sm:text-sm ${getGrowthColor(
                          category.growth
                        )}`}
                      >
                        {category.growth > 0 ? "+" : ""}
                        {category.growth}%
                      </p>
                    </div>
                  </div>
                ))
              : // Loading skeleton
                Array.from({ length: 5 }).map((_, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center space-x-2 sm:space-x-3 min-w-0 flex-1">
                      <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gray-200 rounded-lg flex items-center justify-center flex-shrink-0 animate-pulse">
                        <div className="w-3 h-3 bg-gray-300 rounded animate-pulse"></div>
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="h-4 w-24 bg-gray-200 rounded mb-1 animate-pulse"></div>
                        <div className="h-3 w-16 bg-gray-200 rounded animate-pulse"></div>
                      </div>
                    </div>
                    <div className="text-right min-w-0 flex-shrink-0 ml-2">
                      <div className="h-4 w-16 bg-gray-200 rounded mb-1 animate-pulse"></div>
                      <div className="h-3 w-12 bg-gray-200 rounded animate-pulse"></div>
                    </div>
                  </div>
                ))}
          </div>
        </div>
      </div>

      {/* User Activity Timeline */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6">
        <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-4 sm:mb-6">
          {t("adminAnalytics.dailyUserActivity")}
        </h3>
        <div className="overflow-x-auto">
          <div className="max-h-96 overflow-y-auto">
            <table className="w-full min-w-[600px]">
              <thead className="bg-gray-50 border-b border-gray-200 sticky top-0 z-10">
                <tr>
                  <th className="text-left py-2 sm:py-3 px-3 sm:px-6 text-xs sm:text-sm font-medium text-gray-700">
                    {t("adminAnalytics.date")}
                  </th>
                  <th className="text-left py-2 sm:py-3 px-3 sm:px-6 text-xs sm:text-sm font-medium text-gray-700">
                    {t("adminAnalytics.newUsers")}
                  </th>
                  <th className="text-left py-2 sm:py-3 px-3 sm:px-6 text-xs sm:text-sm font-medium text-gray-700">
                    {t("adminAnalytics.activeUsers")}
                  </th>
                  <th className="text-left py-2 sm:py-3 px-3 sm:px-6 text-xs sm:text-sm font-medium text-gray-700">
                    {t("adminAnalytics.revenue")}
                  </th>
                  <th className="text-left py-2 sm:py-3 px-3 sm:px-6 text-xs sm:text-sm font-medium text-gray-700">
                    {t("adminAnalytics.activity")}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {userActivity.length > 0
                  ? userActivity.map((activity, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="py-3 sm:py-4 px-3 sm:px-6">
                          <span className="font-medium text-gray-800 text-xs sm:text-sm">
                            {new Date(activity.date).toLocaleDateString()}
                          </span>
                        </td>
                        <td className="py-3 sm:py-4 px-3 sm:px-6">
                          <span className="bg-green-100 text-green-600 px-2 py-1 rounded text-xs sm:text-sm font-medium">
                            +{activity.newUsers}
                          </span>
                        </td>
                        <td className="py-3 sm:py-4 px-3 sm:px-6">
                          <span className="font-medium text-gray-800 text-xs sm:text-sm">
                            {formatNumber(activity.activeUsers)}
                          </span>
                        </td>
                        <td className="py-3 sm:py-4 px-3 sm:px-6">
                          <span className="font-medium text-gray-800 text-xs sm:text-sm">
                            {formatCurrency(activity.revenue)}
                          </span>
                        </td>
                        <td className="py-3 sm:py-4 px-3 sm:px-6">
                          <div className="w-16 sm:w-24 bg-gray-200 rounded-full h-1.5 sm:h-2">
                            <div
                              className="bg-blue-500 h-1.5 sm:h-2 rounded-full"
                              style={{
                                width: `${
                                  (activity.activeUsers /
                                    Math.max(
                                      ...userActivity.map((a) => a.activeUsers)
                                    )) *
                                  100
                                }%`,
                              }}
                            ></div>
                          </div>
                        </td>
                      </tr>
                    ))
                  : // Loading skeleton
                    Array.from({ length: 10 }).map((_, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="py-3 sm:py-4 px-3 sm:px-6">
                          <div className="h-4 w-20 bg-gray-200 rounded animate-pulse"></div>
                        </td>
                        <td className="py-3 sm:py-4 px-3 sm:px-6">
                          <div className="h-6 w-12 bg-gray-200 rounded animate-pulse"></div>
                        </td>
                        <td className="py-3 sm:py-4 px-3 sm:px-6">
                          <div className="h-4 w-16 bg-gray-200 rounded animate-pulse"></div>
                        </td>
                        <td className="py-3 sm:py-4 px-3 sm:px-6">
                          <div className="h-4 w-20 bg-gray-200 rounded animate-pulse"></div>
                        </td>
                        <td className="py-3 sm:py-4 px-3 sm:px-6">
                          <div className="w-16 sm:w-24 bg-gray-200 rounded-full h-1.5 sm:h-2 animate-pulse"></div>
                        </td>
                      </tr>
                    ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* System Performance */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {serverPerformance.length > 0
          ? serverPerformance.map((perf, index) => (
              <div
                key={index}
                className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6"
              >
                <div className="flex items-center space-x-2 sm:space-x-3 mb-4">
                  <div
                    className={`w-10 h-10 sm:w-12 sm:h-12 ${perf.color} rounded-lg flex items-center justify-center flex-shrink-0`}
                  >
                    <i className={`${perf.icon} text-lg sm:text-xl`}></i>
                  </div>
                  <div className="min-w-0">
                    <h4 className="font-semibold text-gray-800 text-sm sm:text-base">
                      {perf.title}
                    </h4>
                    <p className="text-xs sm:text-sm text-gray-600 truncate">
                      {perf.subtitle}
                    </p>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-xs sm:text-sm">
                    <span className="text-gray-600">Usage</span>
                    <span className="font-medium">{perf.usage}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-1.5 sm:h-2">
                    <div
                      className={`h-1.5 sm:h-2 rounded-full ${perf.color}`}
                      style={{ width: `${perf.usage}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))
          : // Loading skeleton
            Array.from({ length: 3 }).map((_, index) => (
              <div
                key={index}
                className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6"
              >
                <div className="animate-pulse">
                  <div className="flex items-center space-x-2 sm:space-x-3 mb-4">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-200 rounded-lg"></div>
                    <div className="min-w-0">
                      <div className="h-4 w-24 bg-gray-200 rounded mb-1"></div>
                      <div className="h-3 w-16 bg-gray-200 rounded"></div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs sm:text-sm">
                      <div className="h-3 w-12 bg-gray-200 rounded"></div>
                      <div className="h-3 w-8 bg-gray-200 rounded"></div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-1.5 sm:h-2"></div>
                  </div>
                </div>
              </div>
            ))}
      </div>
    </div>
  );
}
