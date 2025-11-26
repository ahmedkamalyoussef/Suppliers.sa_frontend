"use client";

import { useState } from "react";
import { useLanguage } from "@/lib/LanguageContext"; // عدل المسار حسب مكانك

type ChartKey = "views" | "contacts" | "inquiries";

export default function DashboardAnalytics() {
  const { t, translations, language } = useLanguage();
  const [timeRange, setTimeRange] = useState("30days");
  const [chartType, setChartType] = useState<ChartKey>("views");

  const chartData: Record<ChartKey, number[]> = {
    views: [
      120, 180, 250, 200, 300, 280, 350, 400, 380, 450, 420, 500, 480, 550, 520,
      600, 580, 650, 620, 700, 680, 750, 720, 800, 780, 850, 820, 900, 880, 950,
    ],
    contacts: [
      5, 8, 12, 10, 15, 14, 18, 20, 19, 22, 21, 25, 24, 28, 26, 30, 29, 32, 31,
      35, 34, 38, 36, 40, 39, 42, 41, 45, 44, 48,
    ],
    inquiries: [
      2, 3, 5, 4, 6, 5, 7, 8, 7, 9, 8, 10, 9, 11, 10, 12, 11, 13, 12, 14, 13,
      15, 14, 16, 15, 17, 16, 18, 17, 19,
    ],
  };
 
  const topSearchKeywords = [
    { keyword: "LED TV", searches: 156, change: 12 },
    { keyword: "Samsung electronics", searches: 134, change: 8 },
    { keyword: "laptop wholesale", searches: 98, change: -3 },
    { keyword: "iPhone repair", searches: 87, change: 15 },
    { keyword: "gaming computers", searches: 76, change: 22 },
    { keyword: "mobile accessories", searches: 65, change: 5 },
    { keyword: "electronic components", searches: 54, change: -2 },
    { keyword: "bulk orders", searches: 43, change: 18 },
  ];

  const customerInsights = {
    demographics: [
      { type: "Large Organizations", percentage: 45, count: 127 },
      { type: "Small Businesses", percentage: 35, count: 98 },
      { type: "Individuals", percentage: 20, count: 56 },
    ],
    topLocations: [
      { city: "Riyadh", visitors: 234, percentage: 42 },
      { city: "Jeddah", visitors: 156, percentage: 28 },
      { city: "Dammam", visitors: 89, percentage: 16 },
      { city: "Mecca", visitors: 45, percentage: 8 },
      { city: "Medina", visitors: 32, percentage: 6 },
    ],
  };

  const performanceMetrics = [
    {
      metric: "Profile Completion",
      value: 95,
      target: 100,
      color: "bg-green-500",
    },
    { metric: "Response Rate", value: 88, target: 90, color: "bg-yellow-500" },
    {
      metric: "Customer Satisfaction",
      value: 4.8,
      target: 4.5,
      color: "bg-blue-500",
      isRating: true,
    },
    {
      metric: "Search Visibility",
      value: 72,
      target: 80,
      color: "bg-purple-500",
    },
  ];

  const recommendationItems: string[] =
    ((translations as any)[language]?.dashboardAnalytics?.recommendations
      ?.items as string[]) || [];

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h2 className="text-2xl font-bold text-gray-800">
          {t("dashboardAnalytics.title")}
        </h2>
        <div className="flex space-x-3">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent text-sm pr-8"
          >
            <option value="7days">
              {t("dashboardAnalytics.timeRange.last7days")}
            </option>
            <option value="30days">
              {t("dashboardAnalytics.timeRange.last30days")}
            </option>
            <option value="90days">
              {t("dashboardAnalytics.timeRange.last90days")}
            </option>
          </select>
          <button className="px-4 py-2 border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50 font-medium text-sm whitespace-nowrap cursor-pointer">
            <i className="ri-download-line mr-2"></i>
            {t("dashboardAnalytics.exportButton")}
          </button>
        </div>
      </div>

      {/* Performance Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {performanceMetrics.map((metric, index) => (
          <div
            key={index}
            className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-gray-600">
                {t(
                  `dashboardAnalytics.metrics.${metric.metric
                    .toLowerCase()
                    .replace(/\s+/g, "")}`
                )}
              </h3>
              <div className={`w-3 h-3 rounded-full ${metric.color}`}></div>
            </div>
            {/* ... باقي المحتوى */}
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-800">
              {t("dashboardAnalytics.charts.title")}
            </h3>
            <div className="flex space-x-2">
              {(["views", "contacts", "inquiries"] as ChartKey[]).map(
                (type) => (
                  <button
                    key={type}
                    onClick={() => setChartType(type)}
                    className={`px-3 py-1 rounded-full text-sm font-medium cursor-pointer capitalize transition-all ${
                      chartType === type
                        ? "bg-yellow-400 text-white"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    {t(`dashboardAnalytics.charts.${type}`)}
                  </button>
                )
              )}
            </div>
          </div>
        </div>

        <div className="p-6">
          <div className="h-64 flex items-end space-x-1">
            {chartData[chartType].map((value: number, index: number) => (
              <div
                key={index}
                className="bg-yellow-400 rounded-t flex-1 transition-all duration-300 hover:bg-yellow-500"
                style={{
                  height: `${
                    (value / Math.max(...chartData[chartType])) * 100
                  }%`,
                }}
                title={`${t("dashboardAnalytics.charts.day")} ${
                  index + 1
                }: ${value} ${t(`dashboardAnalytics.charts.${chartType}`)}`}
              ></div>
            ))}
          </div>
          <div className="flex justify-between text-xs text-gray-500 mt-2">
            <span>{t("dashboardAnalytics.charts.daysAgo")}</span>
            <span>{t("dashboardAnalytics.charts.today")}</span>
          </div>
        </div>
      </div>

      {/* Search Keywords & Customer Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Top Search Keywords */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800">
              {t("dashboardAnalytics.keywords.title")}
            </h3>
            <p className="text-sm text-gray-600">
              {t("dashboardAnalytics.keywords.subtitle")}
            </p>
          </div>
          {/* ... باقي محتوى الكلمات المفتاحية */}
        </div>

        {/* Customer Demographics */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800">
              {t("dashboardAnalytics.insights.title")}
            </h3>
            <p className="text-sm text-gray-600">
              {t("dashboardAnalytics.insights.subtitle")}
            </p>
          </div>
          <div className="p-6 space-y-6">
            <div>
              <h4 className="text-sm font-semibold text-gray-700 mb-3">
                {t("dashboardAnalytics.insights.customerTypes")}
              </h4>
              {/* ... */}
            </div>
            <div>
              <h4 className="text-sm font-semibold text-gray-700 mb-3">
                {t("dashboardAnalytics.insights.topLocations")}
              </h4>
              {/* ... */}
            </div>
          </div>
        </div>
      </div>

      {/* Recommendations */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-100">
        <div className="flex items-start space-x-4">
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
            <i className="ri-lightbulb-line text-blue-600 text-xl"></i>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              {t("dashboardAnalytics.recommendations.title")}
            </h3>
            <ul className="space-y-2 text-sm text-gray-700">
              {recommendationItems.map((item: string, index: number) => (
                <li key={index} className="flex items-start space-x-2">
                  <i className="ri-check-line text-green-500 mt-0.5"></i>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
