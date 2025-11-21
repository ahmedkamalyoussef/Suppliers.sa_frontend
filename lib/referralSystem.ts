export interface User {
  id: string;
  businessName: string;
  phone: string; // Stored as digits only (e.g., "501234567")
  email: string;
  cr?: string; // Commercial Registration number
  referralCode: string; // Phone or CR
  totalReferrals: number;
  referralDiscount: number; // 0-40%
  createdAt: Date;
}

export interface Referral {
  id: string;
  referrerCode: string; // Phone or CR of the referrer
  newUserEmail: string;
  newUserPhone: string;
  timestamp: Date;
  discountApplied: number; // 5% per referral
}

export interface ReferralNotification {
  id: string;
  referrerCode: string;
  newUserName: string;
  newUserEmail: string;
  discountGained: number;
  timestamp: Date;
  read: boolean;
}

// Mock database - in production, this would be a real database
let usersDatabase: User[] = [
  {
    id: "user-1",
    businessName: "Tech Solutions",
    phone: "501234567",
    email: "tech@example.com",
    cr: "CR-12345678",
    referralCode: "501234567",
    totalReferrals: 0,
    referralDiscount: 0,
    createdAt: new Date("2024-01-01"),
  },
  {
    id: "user-2",
    businessName: "Trading Co",
    phone: "551234567",
    email: "trading@example.com",
    cr: "CR-87654321",
    referralCode: "551234567",
    totalReferrals: 2,
    referralDiscount: 10,
    createdAt: new Date("2024-01-15"),
  },
];

let referralsDatabase: Referral[] = [];
let notificationsDatabase: ReferralNotification[] = [];

export const referralSystem = {
  // Find user by phone or CR
  findUserByReferralCode(code: string): User | undefined {
    return usersDatabase.find(
      (user) =>
        user.referralCode === code ||
        user.phone === code ||
        user.cr === code
    );
  },

  // Check if referral code exists
  isValidReferralCode(code: string): boolean {
    return this.findUserByReferralCode(code) !== undefined;
  },

  // Register new user and process referral
  registerUserWithReferral(
    businessName: string,
    phone: string, // digits only
    email: string,
    referralCode?: string
  ): { user: User; discount: number; referrerEmail?: string } {
    const newUserId = `user-${Date.now()}`;
    const referralDiscount = referralCode ? this.calculateDiscount(referralCode) : 0;

    const newUser: User = {
      id: newUserId,
      businessName,
      phone,
      email,
      referralCode: phone, // Use phone as referral code
      totalReferrals: 0,
      referralDiscount,
      createdAt: new Date(),
    };

    // Add user to database
    usersDatabase.push(newUser);

    let referrerEmail: string | undefined;

    // Process referral if code provided
    if (referralCode) {
      const referrer = this.findUserByReferralCode(referralCode);
      if (referrer) {
        referrerEmail = referrer.email;

        // Update referrer's count and discount
        referrer.totalReferrals += 1;
        const newReferrerDiscount = Math.min(
          referrer.referralDiscount + 5,
          40
        );
        referrer.referralDiscount = newReferrerDiscount;

        // Log referral
        const referral: Referral = {
          id: `ref-${Date.now()}`,
          referrerCode: referralCode,
          newUserEmail: email,
          newUserPhone: phone,
          timestamp: new Date(),
          discountApplied: 5,
        };
        referralsDatabase.push(referral);

        // Create notification for referrer
        const notification: ReferralNotification = {
          id: `notif-${Date.now()}`,
          referrerCode: referralCode,
          newUserName: businessName,
          newUserEmail: email,
          discountGained: 5,
          timestamp: new Date(),
          read: false,
        };
        notificationsDatabase.push(notification);
      }
    }

    return { user: newUser, discount: referralDiscount, referrerEmail };
  },

  // Calculate cumulative discount from referral code
  calculateDiscount(referralCode: string): number {
    const referrer = this.findUserByReferralCode(referralCode);
    return referrer ? referrer.referralDiscount : 0;
  },

  // Get referrer info for notification
  getReferrerInfo(
    referralCode: string
  ): { email: string; discount: number } | null {
    const referrer = this.findUserByReferralCode(referralCode);
    if (!referrer) return null;
    return {
      email: referrer.email,
      discount: referrer.referralDiscount,
    };
  },

  // Get all notifications for a referrer
  getNotifications(referralCode: string): ReferralNotification[] {
    return notificationsDatabase.filter(
      (notif) => notif.referrerCode === referralCode
    );
  },

  // Mark notification as read
  markNotificationAsRead(notificationId: string): void {
    const notification = notificationsDatabase.find(
      (n) => n.id === notificationId
    );
    if (notification) {
      notification.read = true;
    }
  },

  // Get user by email for referral notifications
  getUserByEmail(email: string): User | undefined {
    return usersDatabase.find((user) => user.email === email);
  },

  // Debug: Get all users (for testing)
  getAllUsers(): User[] {
    return usersDatabase;
  },

  // Debug: Get all referrals
  getAllReferrals(): Referral[] {
    return referralsDatabase;
  },
};
