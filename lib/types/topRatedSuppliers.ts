export interface TopRatedSupplier {
  id: number;
  name: string;
  email: string;
  phone: string;
  business_name: string;
  business_type: string;
  category: string;
  business_image: string;
  profile_visibility: "public" | "limited";
  allow_direct_contact: boolean;
  average_rating: number;
  total_ratings: number;
  profile_views: string;
  certifications: string[];
  total_certifications: number;
  status: string;
  plan: string;
  created_at: string;
}

export interface TopRatedSuppliersResponse {
  suppliers: TopRatedSupplier[];
  count: number;
  limit: number;
}
