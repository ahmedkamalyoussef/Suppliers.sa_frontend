export interface AdminDashboardResponse {
  system_health: {
    current: string;
    change: string;
    trend: "stable" | "up" | "down";
  };
  revenue: {
    current: number;
    change: string;
    trend: "stable" | "up" | "down";
  };
  activeBusinesses: {
    count: number;
    change: string;
    trend: "stable" | "up" | "down";
  };
  totalUsers: {
    count: number;
    change: string;
    trend: "stable" | "up" | "down";
  };
  recentActivity: Array<{
    type: "user_registration" | "inquiry";
    message: string;
    time: string;
    icon: string;
    color: string;
  }>;
  businessVerification: {
    pending: number;
    change: string;
    trend: "stable" | "up" | "down";
  };
  content_reports_count: number;
  healthChecks: {
    serverStatus: {
      status: "ok" | "error";
      uptime: string;
    };
    database: {
      status: "ok" | "error";
      message: string;
    };
    security: {
      status: "ok" | "error";
      message: string;
    };
  };
}
