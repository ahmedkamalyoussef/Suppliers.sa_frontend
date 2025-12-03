export interface Business {
  id: number;
  name: string;
  businessImage: string;
  slug: string;
  category: string;
  categories: string[];
  targetMarket: string[];
  services: string[];
  businessType: string;
  address: string;
  serviceDistance: number;
  rating?: number;
  reviewsCount: number;
  status: string;
  plan: string;
  latitude: string;
  longitude: string;
  mainPhone: string;
  contactEmail: string;
  preferences: {
    marketing_emails: boolean;
    profile_visibility: "public" | "limited";
    show_email_publicly: boolean;
    show_phone_publicly: boolean;
    allow_direct_contact: boolean;
    allow_search_engine_indexing: boolean;
  };
}

export interface BusinessListResponse {
  data: Business[];
  meta: {
    current_page: number;
    per_page: number;
    total: number;
    last_page: number;
  };
}
