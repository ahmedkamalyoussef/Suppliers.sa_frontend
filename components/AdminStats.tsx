"use client";

import { useState } from "react";
import { useLanguage } from "../lib/LanguageContext";

export default function AdminStats() {
  const { t } = useLanguage();
  const [timeRange, setTimeRange] = useState("30days");

  const systemStats = [
    {
      title: t("adminStats.totalUsers"),
      value: "2,847",
      change: "+12.5%",
      trend: "up",
      icon: "ri-user-line",
      color: "bg-blue-500",
    },
    {
      title: t("adminStats.activeBusinesses"),
      value: "1,234",
      change: "+8.2%",
      trend: "up",
      icon: "ri-store-line",
      color: "bg-green-500",
    },
    {
      title: t("adminStats.monthlyRevenue"),
      value: "$45,678",
      change: "+15.3%",
      trend: "up",
      icon: "ri-money-dollar-circle-line",
      color: "bg-yellow-500",
    },
    {
      title: t("adminStats.systemHealth"),
      value: "99.8%",
      change: "+0.1%",
      trend: "up",
      icon: "ri-pulse-line",
      color: "bg-purple-500",
    },
  ];

  const recentActivities = [
    {
      type: "user_registration",
      message: t("adminStats.newBusinessRegistered").replace(
        "{{name}}",
        "Tech Solutions Co."
      ),
      time: "5 minutes ago",
      icon: "ri-user-add-line",
      color: "bg-green-100 text-green-600",
    },
    {
      type: "payment",
      message: t("adminStats.premiumPaymentReceived").replace(
        "{{name}}",
        "Metro Electronics"
      ),
      time: "12 minutes ago",
      icon: "ri-bank-card-line",
      color: "bg-blue-100 text-blue-600",
    },
    {
      type: "content_report",
      message: t("adminStats.contentReported").replace(
        "{{reason}}",
        "Inappropriate business description"
      ),
      time: "25 minutes ago",
      icon: "ri-flag-line",
      color: "bg-red-100 text-red-600",
    },
    {
      type: "system",
      message: t("adminStats.databaseBackupCompleted"),
      time: "1 hour ago",
      icon: "ri-database-2-line",
      color: "bg-purple-100 text-purple-600",
    },
    {
      type: "employee",
      message: t("adminStats.newEmployeeAdded")
        .replace("{{name}}", "Sarah Johnson")
        .replace("{{role}}", "Content Moderator"),
      time: "2 hours ago",
      icon: "ri-team-line",
      color: "bg-yellow-100 text-yellow-600",
    },
  ];

  const pendingActions = [
    {
      title: t("adminStats.businessVerification"),
      count: 12,
      priority: "high",
      action: t("adminStats.reviewNow"),
    },
    {
      title: t("adminStats.contentReports"),
      count: 8,
      priority: "medium",
      action: t("adminStats.moderate"),
    },
    {
      title: t("adminStats.paymentDisputes"),
      count: 3,
      priority: "high",
      action: t("adminStats.resolve"),
    },
    {
      title: t("adminStats.systemUpdates"),
      count: 2,
      priority: "low",
      action: t("adminStats.schedule"),
    },
  ];

  const quickActions = [
    {
      title: t("adminStats.addEmployee"),
      description: t("adminStats.addEmployeeDesc"),
      icon: "ri-user-add-line",
      color: "bg-blue-500",
    },
    {
      title: t("adminStats.broadcastMessage"),
      description: t("adminStats.broadcastMessageDesc"),
      icon: "ri-megaphone-line",
      color: "bg-green-500",
    },
    {
      title: t("adminStats.generateReport"),
      description: t("adminStats.generateReportDesc"),
      icon: "ri-file-chart-line",
      color: "bg-purple-500",
    },
    {
      title: t("adminStats.systemMaintenance"),
      description: t("adminStats.systemMaintenanceDesc"),
      icon: "ri-tools-line",
      color: "bg-orange-500",
    },
  ];

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-800">
          {t("adminStats.title")}
        </h2>
        <select
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value)}
          className="px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-400 focus:border-transparent text-sm w-full sm:w-auto"
        >
          <option value="7days">{t("adminStats.timeRange7")}</option>
          <option value="30days">{t("adminStats.timeRange30")}</option>
          <option value="90days">{t("adminStats.timeRange90")}</option>
        </select>
      </div>

      {/* System Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {systemStats.map((stat, index) => (
          <div
            key={index}
            className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-100"
          >
            <div className="flex items-center justify-between">
              <div
                className={`w-10 h-10 sm:w-12 sm:h-12 ${stat.color} rounded-lg flex items-center justify-center flex-shrink-0`}
              >
                <i className={`${stat.icon} text-white text-lg sm:text-xl`}></i>
              </div>
              <span
                className={`text-xs sm:text-sm font-medium px-2 py-1 rounded-full ${
                  stat.trend === "up"
                    ? "bg-green-100 text-green-600"
                    : "bg-red-100 text-red-600"
                }`}
              >
                {stat.change}
              </span>
            </div>
            <div className="mt-3 sm:mt-4">
              <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-800 break-words">
                {stat.value}
              </h3>
              <p className="text-gray-600 text-xs sm:text-sm mt-1">
                {stat.title}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6">
        <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-4 sm:mb-6">
          {t("adminStats.quickActions")}
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {quickActions.map((action, index) => (
            <button
              key={index}
              className="p-3 sm:p-4 border border-gray-200 rounded-lg hover:border-gray-300 hover:shadow-md transition-all text-left cursor-pointer w-full"
            >
              <div
                className={`w-8 h-8 sm:w-10 sm:h-10 ${action.color} rounded-lg flex items-center justify-center mb-2 sm:mb-3 flex-shrink-0`}
              >
                <i
                  className={`${action.icon} text-white text-sm sm:text-base`}
                ></i>
              </div>
              <h4 className="font-medium text-gray-800 text-sm sm:text-base mb-1">
                {action.title}
              </h4>
              <p className="text-xs sm:text-sm text-gray-600 line-clamp-2">
                {action.description}
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* Pending Actions and Recent Activity */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Pending Actions */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-4 sm:p-6 border-b border-gray-200">
            <h3 className="text-base sm:text-lg font-semibold text-gray-800">
              {t("adminStats.pendingActions")}
            </h3>
          </div>
          <div className="p-4 sm:p-6 space-y-3 sm:space-y-4">
            {pendingActions.map((item, index) => (
              <div
                key={index}
                className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 sm:p-4 bg-gray-50 rounded-lg gap-3"
              >
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-gray-800 text-sm sm:text-base">
                    {item.title}
                  </h4>
                  <div className="flex items-center space-x-2 mt-1 sm:mt-2">
                    <span className="text-xl sm:text-2xl font-bold text-gray-700">
                      {item.count}
                    </span>
                    <span
                      className={`text-xs px-2 py-1 rounded-full font-medium ${
                        item.priority === "high"
                          ? "bg-red-100 text-red-600"
                          : item.priority === "medium"
                          ? "bg-yellow-100 text-yellow-600"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {item.priority === "high"
                        ? t("adminStats.highPriority")
                        : item.priority === "medium"
                        ? t("adminStats.mediumPriority")
                        : t("adminStats.lowPriority")}
                    </span>
                  </div>
                </div>
                <button className="bg-red-500 text-white px-3 sm:px-4 py-2 rounded-lg hover:bg-red-600 font-medium text-xs sm:text-sm whitespace-nowrap cursor-pointer w-full sm:w-auto mt-2 sm:mt-0">
                  {item.action}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-4 sm:p-6 border-b border-gray-200">
            <h3 className="text-base sm:text-lg font-semibold text-gray-800">
              {t("adminStats.recentActivity")}
            </h3>
          </div>
          <div className="p-4 sm:p-6">
            <div className="space-y-3 sm:space-y-4">
              {recentActivities.map((activity, index) => (
                <div
                  key={index}
                  className="flex items-start space-x-2 sm:space-x-3"
                >
                  <div
                    className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center ${activity.color} flex-shrink-0 mt-0.5`}
                  >
                    <i className={`${activity.icon} text-xs sm:text-sm`}></i>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs sm:text-sm text-gray-800 break-words">
                      {activity.message}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {activity.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* System Health Monitor */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6">
        <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-4 sm:mb-6">
          {t("adminStats.systemHealthMonitor")}
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
          <div className="text-center">
            <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto bg-green-100 rounded-full flex items-center justify-center mb-3 sm:mb-4">
              <i className="ri-server-line text-green-600 text-xl sm:text-2xl"></i>
            </div>
            <h4 className="font-medium text-gray-800 text-sm sm:text-base">
              {t("adminStats.serverStatus")}
            </h4>
            <p className="text-xs sm:text-sm text-green-600 font-medium">
              {t("adminStats.online")}
            </p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto bg-blue-100 rounded-full flex items-center justify-center mb-3 sm:mb-4">
              <i className="ri-database-2-line text-blue-600 text-xl sm:text-2xl"></i>
            </div>
            <h4 className="font-medium text-gray-800 text-sm sm:text-base">
              {t("adminStats.database")}
            </h4>
            <p className="text-xs sm:text-sm text-blue-600 font-medium">
              {t("adminStats.healthy")}
            </p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto bg-yellow-100 rounded-full flex items-center justify-center mb-3 sm:mb-4">
              <i className="ri-shield-check-line text-yellow-600 text-xl sm:text-2xl"></i>
            </div>
            <h4 className="font-medium text-gray-800 text-sm sm:text-base">
              {t("adminStats.security")}
            </h4>
            <p className="text-xs sm:text-sm text-yellow-600 font-medium">
              {t("adminStats.protected")}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
