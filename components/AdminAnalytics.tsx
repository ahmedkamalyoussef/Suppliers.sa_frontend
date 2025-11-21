"use client";

import { useState } from "react";
import type React from "react";
import { useLanguage } from "../lib/LanguageContext";

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
  const [timeRange, setTimeRange] = useState<TimeRange>("30days");
  const [chartType, setChartType] = useState<ChartKey>("revenue");

  const analyticsData: Record<ChartKey, AnalyticsSeries> = {
    revenue: {
      current: 45678,
      previous: 38940,
      growth: 17.3,
      data: [28000, 32000, 35000, 41000, 38000, 42000, 45678],
    },
    users: {
      current: 2847,
      previous: 2560,
      growth: 11.2,
      data: [2100, 2300, 2450, 2600, 2720, 2800, 2847],
    },
    businesses: {
      current: 1234,
      previous: 1156,
      growth: 6.7,
      data: [980, 1050, 1120, 1180, 1200, 1220, 1234],
    },
    subscriptions: {
      current: 856,
      previous: 743,
      growth: 15.2,
      data: [650, 720, 760, 780, 820, 840, 856],
    },
  };

  const topCategories: CategoryRow[] = [
    { name: "Technology", businesses: 324, revenue: "$12,450", growth: 18.5 },
    { name: "Electronics", businesses: 289, revenue: "$9,870", growth: 12.3 },
    { name: "Healthcare", businesses: 156, revenue: "$7,230", growth: 9.8 },
    { name: "Education", businesses: 143, revenue: "$5,680", growth: 15.7 },
    { name: "Retail", businesses: 132, revenue: "$4,920", growth: 8.2 },
  ];

  const revenueByPlan: RevenuePlan[] = [
    { plan: "Enterprise", revenue: 22890, users: 89, color: "bg-purple-500" },
    { plan: "Premium", revenue: 15640, users: 234, color: "bg-blue-500" },
    { plan: "Basic", revenue: 7148, users: 533, color: "bg-green-500" },
  ];

  const userActivity: ActivityRow[] = [
    { date: "2024-01-14", newUsers: 45, activeUsers: 1230, revenue: 2340 },
    { date: "2024-01-15", newUsers: 52, activeUsers: 1278, revenue: 2890 },
    { date: "2024-01-16", newUsers: 38, activeUsers: 1156, revenue: 1980 },
    { date: "2024-01-17", newUsers: 61, activeUsers: 1345, revenue: 3120 },
    { date: "2024-01-18", newUsers: 47, activeUsers: 1289, revenue: 2560 },
    { date: "2024-01-19", newUsers: 55, activeUsers: 1398, revenue: 3240 },
    { date: "2024-01-20", newUsers: 49, activeUsers: 1423, revenue: 2980 },
  ];

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
          <button className="bg-blue-500 text-white px-4 sm:px-6 py-2 rounded-lg hover:bg-blue-600 font-medium text-sm whitespace-nowrap cursor-pointer w-full sm:w-auto">
            <i className="ri-download-line mr-2"></i>
            {t("adminAnalytics.exportReport")}
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {(Object.entries(analyticsData) as [ChartKey, AnalyticsSeries][]).map(
          ([key, data]) => (
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
          )
        )}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Revenue by Plan */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6">
          <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-4 sm:mb-6">
            {t("adminAnalytics.revenueByPlan")}
          </h3>
          <div className="space-y-3 sm:space-y-4">
            {revenueByPlan.map((plan, index) => (
              <div key={index} className="flex items-center justify-between">
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
                            Math.max(...revenueByPlan.map((p) => p.revenue))) *
                          100
                        }%`,
                      }}
                    ></div>
                  </div>
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
            {topCategories.map((category, index) => (
              <div key={index} className="flex items-center justify-between">
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
          <table className="w-full min-w-[600px]">
            <thead className="bg-gray-50 border-b border-gray-200">
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
              {userActivity.map((activity, index) => (
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
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* System Performance */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6">
          <div className="flex items-center space-x-2 sm:space-x-3 mb-4">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <i className="ri-server-line text-green-600 text-lg sm:text-xl"></i>
            </div>
            <div className="min-w-0">
              <h4 className="font-semibold text-gray-800 text-sm sm:text-base">
                {t("adminAnalytics.serverPerformance")}
              </h4>
              <p className="text-xs sm:text-sm text-gray-600 truncate">
                {t("adminAnalytics.uptime")}
              </p>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-xs sm:text-sm">
              <span className="text-gray-600">
                {t("adminAnalytics.cpuUsage")}
              </span>
              <span className="font-medium">34%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-1.5 sm:h-2">
              <div
                className="bg-green-500 h-1.5 sm:h-2 rounded-full"
                style={{ width: "34%" }}
              ></div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6">
          <div className="flex items-center space-x-2 sm:space-x-3 mb-4">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <i className="ri-database-2-line text-blue-600 text-lg sm:text-xl"></i>
            </div>
            <div className="min-w-0">
              <h4 className="font-semibold text-gray-800 text-sm sm:text-base">
                {t("adminAnalytics.databaseHealth")}
              </h4>
              <p className="text-xs sm:text-sm text-gray-600 truncate">
                {t("adminAnalytics.optimal")}
              </p>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-xs sm:text-sm">
              <span className="text-gray-600">
                {t("adminAnalytics.storageUsed")}
              </span>
              <span className="font-medium">67%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-1.5 sm:h-2">
              <div
                className="bg-blue-500 h-1.5 sm:h-2 rounded-full"
                style={{ width: "67%" }}
              ></div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6">
          <div className="flex items-center space-x-2 sm:space-x-3 mb-4">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <i className="ri-speed-line text-purple-600 text-lg sm:text-xl"></i>
            </div>
            <div className="min-w-0">
              <h4 className="font-semibold text-gray-800 text-sm sm:text-base">
                {t("adminAnalytics.responseTime")}
              </h4>
              <p className="text-xs sm:text-sm text-gray-600 truncate">
                {t("adminAnalytics.fast")}
              </p>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-xs sm:text-sm">
              <span className="text-gray-600">
                {t("adminAnalytics.avgResponse")}
              </span>
              <span className="font-medium">124ms</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-1.5 sm:h-2">
              <div
                className="bg-purple-500 h-1.5 sm:h-2 rounded-full"
                style={{ width: "25%" }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
