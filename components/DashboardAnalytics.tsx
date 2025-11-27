"use client";

import { useState, useEffect } from "react";
import { useLanguage } from "@/lib/LanguageContext";
import { apiService } from "@/lib/api";

type ChartKey = "views" | "contacts" | "inquiries";

export default function DashboardAnalytics() {
  const { t, translations, language } = useLanguage();
  const [timeRange, setTimeRange] = useState("30days");
  const [chartType, setChartType] = useState<ChartKey>("views");

  // State for chart data
  const [chartData, setChartData] = useState<Record<ChartKey, number[]>>({
    views: [],
    contacts: [],
    inquiries: [],
  });
  const [chartLabels, setChartLabels] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Keywords data state
  const [keywordsData, setKeywordsData] = useState<{
    keywords: Array<{
      keyword: string;
      searches: number;
      change: number;
      contacts: number;
      last_searched: string;
    }>;
    totalSearches: number;
    averageChange: number;
    period: string;
  } | null>(null);

  // Customer insights state
  const [customerInsightsData, setCustomerInsights] = useState<{
    demographics: Array<{
      type: string;
      percentage: number;
      count: number;
    }>;
    topLocations: Array<{
      city: string;
      visitors: number;
      percentage: number;
    }>;
    totalVisitors: number;
    totalCustomers: number;
    period: string;
  } | null>(null);

  // Recommendations state
  const [recommendations, setRecommendations] = useState<{
    recommendations: string[];
    priority: "low" | "medium" | "high";
    generated_at: string;
    based_on: {
      profile_completion: number;
      response_rate: number;
      customer_satisfaction: number;
      search_visibility: number;
      total_inquiries: number;
      total_ratings: number;
      profile_views: number;
    };
  } | null>(null);
  const [performanceMetrics, setPerformanceMetrics] = useState<Array<{
    metric: string;
    value: number;
    target: number;
    color: string;
    unit?: string;
    isRating?: boolean;
  }>>([]);

  // Fetch charts data when chartType or timeRange changes
  const fetchChartsData = async () => {
    try {
      setIsLoading(true);
      const range =
        timeRange === "7days" ? 7 : timeRange === "30days" ? 30 : 90;
      const response = await apiService.getChartsData(range, chartType);

      // Ensure we have valid data array
      const chartData = Array.isArray(response.data)
        ? response.data.map((val) => Number(val) || 0)
        : [];

      setChartData((prev) => ({
        ...prev,
        [chartType]: chartData,
      }));

      if (response.labels && Array.isArray(response.labels)) {
        setChartLabels(response.labels);
      } else {
        // Generate default labels if none provided
        setChartLabels(
          Array.from({ length: chartData.length }, (_, i) => `${i + 1}`)
        );
      }

      console.log(`Fetched ${chartType} data:`, {
        data: chartData,
        labels: response.labels,
        hasData: chartData.some((val) => val > 0),
      });
    } catch (error) {
      console.error("Error fetching charts data:", error);
      // Set empty data on error
      setChartData((prev) => ({
        ...prev,
        [chartType]: [],
      }));
      setChartLabels([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Initial data fetch
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const range = timeRange === "7days" ? 7 : timeRange === "30days" ? 30 : 90;
        
        // 1. Get Performance Metrics
        const metricsResponse = await apiService.getPerformanceMetrics();
        console.log("Performance Metrics:", metricsResponse);
        
        // Map the API response to the expected format
        const mappedMetrics = metricsResponse.metrics.map(metric => ({
          metric: metric.metric,
          value: metric.value,
          target: metric.target,
          color: getMetricColor(metric.metric),
          unit: metric.unit,
          isRating: metric.isRating
        }));
        
        setPerformanceMetrics(mappedMetrics);

        // 2. Get Charts Data
        await fetchChartsData();

        // 3. Get Keywords Analytics with range parameter
        const keywords = await apiService.getKeywordsAnalytics(range);
        console.log("Keywords Analytics:", keywords);
        setKeywordsData(keywords);

        // 4. Get Customer Insights with range parameter
        const insights = await apiService.getCustomerInsights(range);
        console.log("Customer Insights:", insights);
        setCustomerInsights(insights);

        // 5. Get Recommendations
        const recommendations = await apiService.getRecommendations();
        console.log("Recommendations:", recommendations);
        setRecommendations(recommendations);
      } catch (error) {
        console.error("Error fetching initial data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchInitialData();
  }, [timeRange, chartType]);

  // Update chart data when chartType or timeRange changes
  useEffect(() => {
    if (chartType) {
      fetchChartsData();
    }
  }, [chartType, timeRange]);

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

  // Helper function to get color based on metric name
  const getMetricColor = (metricName: string): string => {
    switch(metricName) {
      case 'Profile Completion':
        return 'bg-green-500';
      case 'Response Rate':
        return 'bg-yellow-500';
      case 'Customer Satisfaction':
        return 'bg-blue-500';
      case 'Search Visibility':
        return 'bg-purple-500';
      default:
        return 'bg-gray-500';
    }
  };

  // Get priority color based on recommendation priority
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800";
      case "medium":
        return "bg-yellow-100 text-yellow-800";
      case "low":
      default:
        return "bg-green-100 text-green-800";
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col space-y-4 md:space-y-0 md:flex-row md:justify-between md:items-center gap-4">
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-gray-800">
            {t("dashboardAnalytics.title")}
          </h2>
          <p className="text-sm text-gray-600 max-w-2xl">
            {t("dashboardAnalytics.description")}
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
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
          <button
            onClick={async () => {
              try {
                // The downloadAnalyticsCSV method handles everything automatically
                await apiService.exportAnalytics("csv");
                alert(t("dashboardAnalytics.exportSuccess"));
              } catch (error) {
                console.error("Export failed:", error);
                alert(t("dashboardAnalytics.exportError"));
              }
            }}
            className="px-4 py-2 border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50 font-medium text-sm whitespace-nowrap cursor-pointer flex items-center"
          >
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
            <div className="text-2xl font-bold">
              {metric.value}
              {metric.unit === 'stars' || metric.isRating ? (
                <span className="text-sm text-gray-500">/5</span>
              ) : metric.unit === '%' ? (
                <span className="text-sm text-gray-500">%</span>
              ) : null}
            </div>
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
            {isLoading ? (
              // Skeleton loader
              Array(30)
                .fill(0)
                .map((_, i) => (
                  <div
                    key={i}
                    className="bg-gray-200 rounded-t flex-1 animate-pulse"
                    style={{
                      height: `${Math.random() * 30 + 20}%`,
                    }}
                  ></div>
                ))
            ) : chartData[chartType]?.length > 0 ? (
              // Chart data
              chartData[chartType].map((value: number, index: number) => {
                // Calculate bar height with logarithmic scale for better visualization
                const maxBarHeight = 100; // Maximum height in percentage
                const scaleFactor = 5; // Adjust this to control how quickly bars grow

                // For zero values, show a very subtle bar (1% height)
                let heightPercent = 1; // Default minimum height for all bars

                if (value > 0) {
                  // Use logarithmic scale for positive values
                  heightPercent = Math.min(
                    Math.log2(value + 1) * scaleFactor,
                    maxBarHeight
                  );
                  // Ensure minimum height for better visibility
                  heightPercent = Math.max(heightPercent, 2);
                }

                return (
                  <div
                    key={index}
                    className={`${
                      value >= 0
                        ? "bg-yellow-400/40 hover:bg-yellow-500/70"
                        : "bg-gray-200"
                    } rounded-t flex-1 transition-all duration-300`}
                    style={{
                      height: `${heightPercent}%`,
                    }}
                    title={`${chartLabels[index] || index + 1}: ${value} ${t(
                      `dashboardAnalytics.charts.${chartType}`
                    )}`}
                  ></div>
                );
              })
            ) : (
              // No data message
              <div className="w-full h-full flex items-center justify-center text-gray-500">
                {t("dashboardAnalytics.noData")}
              </div>
            )}
          </div>
          <div className="flex justify-between text-xs text-gray-500 mt-2">
            <span>
              {chartLabels[0] || t("dashboardAnalytics.charts.start")}
            </span>
            <span>
              {chartLabels[chartLabels.length - 1] ||
                t("dashboardAnalytics.charts.end")}
            </span>
          </div>
        </div>
      </div>

      {/* Search Keywords & Customer Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Top Search Keywords */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
          <div className="p-6 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-800">
                {t("dashboardAnalytics.keywords.title")}
              </h3>
              {keywordsData?.period && (
                <span className="text-xs text-gray-500">
                  
                  {keywordsData.period}
                </span>
              )}
            </div>
            <p className="text-sm text-gray-600 mt-1">
              {t("dashboardAnalytics.keywords.subtitle")}
            </p>
          </div>
          <div className="p-6">
            {!keywordsData ? (
              <div className="flex justify-center items-center h-40">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-400"></div>
              </div>
            ) : keywordsData.keywords && keywordsData.keywords.length > 0 ? (
              <div className="space-y-4">
                {keywordsData.keywords.map((keyword, index) => {
                  const maxSearches = Math.max(
                    ...keywordsData.keywords.map((k) => k.searches)
                  );
                  return (
                    <div key={index} className="space-y-1">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-gray-900">
                          {keyword.keyword}
                        </span>
                        <span className="text-xs text-gray-500">
                          {keyword.searches}{" "}
                          {t("dashboardAnalytics.keywords.searches")}
                        </span>
                      </div>
                      <div className="w-full bg-gray-100 rounded-full h-2">
                        <div
                          className="bg-blue-500 h-2 rounded-full"
                          style={{
                            width: `${(keyword.searches / maxSearches) * 100}%`,
                          }}
                        ></div>
                      </div>
                      <div className="flex justify-between text-xs text-gray-500">
                        
                        <span className="text-gray-400 text-xs">
                          Last search : {new Date(keyword.last_searched).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  );
                })}
                {keywordsData.totalSearches !== undefined && (
                  <div className="pt-4 mt-4 border-t border-gray-100 text-sm text-gray-500">
                    {t("dashboardAnalytics.keywords.totalSearches")}:
                    <span className="font-medium ml-1">
                      {keywordsData.totalSearches}
                    </span>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                {t("dashboardAnalytics.noData")}
              </div>
            )}
          </div>
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
              <div className="flex justify-between items-center mb-3">
                <h4 className="text-sm font-semibold text-gray-700">
                  {t("dashboardAnalytics.insights.customerTypes")}
                </h4>
                {customerInsightsData?.totalCustomers && (
                  <span className="text-xs text-gray-500">
                    {t("dashboardAnalytics.insights.totalCustomers")}:{" "}
                    {customerInsightsData.totalCustomers}
                  </span>
                )}
              </div>
              {!customerInsightsData ? (
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="animate-pulse">
                      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                      <div className="w-full bg-gray-100 rounded-full h-2 mt-2"></div>
                    </div>
                  ))}
                </div>
              ) : customerInsightsData.demographics &&
                customerInsightsData.demographics.length > 0 ? (
                <div className="space-y-4">
                  {customerInsightsData.demographics.map((item, index) => (
                    <div key={index} className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-700">{item.type}</span>
                        <span className="font-medium text-gray-900">
                          {item.percentage}%{" "}
                          <span className="text-gray-500 text-xs">
                            ({item.count})
                          </span>
                        </span>
                      </div>
                      <div className="w-full bg-gray-100 rounded-full h-2">
                        <div
                          className="bg-purple-500 h-2 rounded-full"
                          style={{ width: `${item.percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500">
                  {t("dashboardAnalytics.noData")}
                </p>
              )}
            </div>

            <div>
              <div className="flex justify-between items-center mb-3">
                <h4 className="text-sm font-semibold text-gray-700">
                  {t("dashboardAnalytics.insights.topLocations")}
                </h4>
                {customerInsightsData?.totalVisitors && (
                  <span className="text-xs text-gray-500">
                    {t("dashboardAnalytics.insights.totalVisitors")}:{" "}
                    {customerInsightsData.totalVisitors}
                  </span>
                )}
              </div>
              {!customerInsightsData ? (
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="animate-pulse">
                      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                      <div className="w-full bg-gray-100 rounded-full h-2 mt-2"></div>
                    </div>
                  ))}
                </div>
              ) : customerInsightsData &&
                customerInsightsData.topLocations &&
                customerInsightsData.topLocations.length > 0 ? (
                <div className="space-y-3">
                  {customerInsightsData.topLocations.map((location, index) => (
                    <div key={index} className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-700">{location.city}</span>
                        <span className="font-medium text-gray-900">
                          {location.percentage}%{" "}
                          <span className="text-gray-500 text-xs">
                            ({location.visitors})
                          </span>
                        </span>
                      </div>
                      <div className="w-full bg-gray-100 rounded-full h-2">
                        <div
                          className="bg-blue-500 h-2 rounded-full"
                          style={{ width: `${location.percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500">
                  {t("dashboardAnalytics.noData")}
                </p>
              )}
            </div>

            {customerInsightsData?.period && (
              <div className="pt-4 mt-4 border-t border-gray-100 text-xs text-gray-500">
                {customerInsightsData.period}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Recommendations */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-100">
        <div className="flex items-start space-x-4">
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
            <i className="ri-lightbulb-line text-blue-600 text-xl"></i>
          </div>
          <div className="flex-1">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-lg font-semibold text-gray-800">
                {t("dashboardAnalytics.recommendations.title")}
              </h3>
              {recommendations?.priority && (
                <span
                  className={`px-2.5 py-1 text-xs font-medium rounded-full ${getPriorityColor(
                    recommendations.priority
                  )}`}
                >
                  {t(
                    `dashboardAnalytics.recommendations.${recommendations.priority}Priority`
                  )}
                </span>
              )}
            </div>
            <p className="text-sm text-gray-600 mb-4">
              {t("dashboardAnalytics.recommendations.subtitle")}
            </p>

            {!recommendations ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="animate-pulse">
                    <div className="h-4 bg-gray-200 rounded w-full"></div>
                  </div>
                ))}
              </div>
            ) : recommendations.recommendations?.length > 0 ? (
              <ul className="space-y-3">
                {recommendations.recommendations.map((item, index) => (
                  <li key={index} className="flex items-start space-x-3">
                    <div className="flex-shrink-0 mt-1">
                      <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                    </div>
                    <p className="text-gray-600 text-sm">{item}</p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-gray-500">
                {t("dashboardAnalytics.noRecommendations")}
              </p>
            )}

            {recommendations?.generated_at && (
              <div className="mt-4 pt-4 border-t border-gray-100">
                <p className="text-xs text-gray-500">
                  {t("dashboardAnalytics.recommendations.lastUpdated")}:{" "}
                  {new Date(recommendations.generated_at).toLocaleString()}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
