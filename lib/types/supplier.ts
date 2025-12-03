import { Review, Certification, Product, Service } from "./common";

export interface Phone {
  id: number;
  type: string;
  number: string;
  name: string;
}

export interface WorkingHour {
  open: string;
  close: string;
  closed: boolean;
}

export interface SupplierProfileData {
  business_type: string;
  category: string;
  business_image: string;
  website: string;
  contact_email: string;
  description: string | null;
  service_distance: string;
  target_market: string[];
  main_phone: string;
  additional_phones: Phone[];
  business_address: string;
  latitude: string;
  longitude: string;
  working_hours: Record<string, WorkingHour>;
  services_offered: string[];
  products?: Product[];
}

export interface SupplierProfile {
  id: number;
  name: string;
  status: string;
  profile: SupplierProfileData;
  profile_image: string;
  ratings: {
    average: number | null;
    count: number;
    reviews: Review[];
  };
  certifications: Certification[];
  product_images: Array<{
    id: number;
    image_url: string;
    name: string;
  }>;
  services: Service[];
  preferences?: {
    marketing_emails: boolean;
    profile_visibility: "public" | "limited";
    show_email_publicly: boolean;
    show_phone_publicly: boolean;
    allow_direct_contact: boolean;
    allow_search_engine_indexing: boolean;
  };
}

// BusinessProfile extends SupplierProfile with explicit products in profile
export interface BusinessProfile extends Omit<SupplierProfile, "profile"> {
  profile: SupplierProfileData & {
    products: Product[]; // Company products inside profile
  };
}
