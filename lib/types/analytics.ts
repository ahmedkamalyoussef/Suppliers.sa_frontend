export interface AnalyticsResponse {
  revenue: {
    current: number;
    change: string;
  };
  totalUsers: {
    count: number;
    change: string;
  };
  totalBusinesses: {
    count: number;
    change: string;
  };
  paidSubscriptions: {
    count: number;
    change: string;
  };
  topBusinessCategories: Array<{
    name: string;
    businesses: number;
    growth: string;
    revenue: string;
  }>;
  revenueByPlan: Array<{
    plan: string;
    revenue: number;
    users: number;
    color: string;
  }>;
  dailyUserActivity: Array<{
    date: string;
    newUsers: number;
    activeUsers: number;
    revenue: number;
    inquiries: number;
  }>;
  serverPerformance: Array<{
    title: string;
    subtitle: string;
    icon: string;
    color: string;
    usage: number;
  }>;
}
