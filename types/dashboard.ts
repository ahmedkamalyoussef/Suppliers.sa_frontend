// Dashboard interfaces
export interface DashboardStat {
  current: number;
  change: number;
  trend: "up" | "down";
}

export interface DashboardStats {
  views: DashboardStat;
  contacts: DashboardStat;
  inquiries: DashboardStat;
  rating: DashboardStat;
}

export interface DashboardActivity {
  id: number;
  type: string;
  title: string;
  message: string;
  time: string;
  icon: string;
  color: string;
}

export interface DashboardOverview {
  stats: DashboardStats;
  recentActivities: DashboardActivity[];
}

export interface DashboardResponse {
  overview: DashboardOverview;
}
