export interface Rating {
  id: number;
  score: number;
  comment: string;
  status: "pending_review" | "approved" | "rejected" | "flagged";
  createdAt: string;
  updatedAt: string;
  moderatedBy?: {
    id: number;
    name: string;
    email: string;
  };
  flaggedBy?: {
    id: number;
    name: string;
    email: string;
  };
  supplier: {
    id: number;
    name: string;
    email: string;
    phone: string;
    profile_image: string;
    status: string;
    created_at: string;
    updated_at: string;
    profile: {
      business_name: string;
      business_type: string;
      description: string;
      website: string;
      main_phone: string;
      business_address: string;
      latitude: string;
      longitude: string;
      category: string;
      business_image: string;
    };
  };
}

export interface RatingsResponse {
  data: Rating[];
  pagination: {
    currentPage: number;
    perPage: number;
    total: number;
    lastPage: number;
  };
}

export interface RatingActionResponse {
  message: string;
  data: Rating;
}
