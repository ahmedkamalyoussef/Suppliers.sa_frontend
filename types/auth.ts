// Authentication types for different user types

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

export interface Location {
  lat: number;
  lng: number;
}

export interface Branch {
  id: string;
  name: string;
  phone: string;
  email: string;
  address: string;
  manager: string;
  status: string;
  isMainBranch: boolean;
  location: Location;
  workingHours: Record<string, WorkingHour>;
  specialServices: string[];
  createdAt: string;
  updatedAt: string;
}

export interface ProductImage {
  id: number;
  image_url: string;
  created_at: string;
  updated_at: string;
}

export interface Service {
  id: number;
  service_name: string;
  created_at: string;
  updated_at: string;
}

export interface Certification {
  id: number;
  certification_name: string;
  created_at: string;
  updated_at: string;
}

export interface SupplierProfile {
  slug: string;
  businessName: string;
  businessType: string;
  category: string;
  categories: string[];
  description: string;
  services: string[];
  website: string;
  address: string;
  mainPhone: string;
  contactEmail: string;
  targetCustomers: string[];
  whoDoYouServe: string[];
  productKeywords: string[];
  serviceDistance: string;
  additionalPhones: Phone[];
  workingHours: Record<string, WorkingHour>;
  location: Location;
}

export interface SupplierData {
  id: number;
  slug: string;
  name: string;
  email: string;
  phone: string;
  profileImage: string;
  emailVerifiedAt: string;
  status: string;
  plan: string;
  profileCompletion: number;
  profile: SupplierProfile;
  branches: Branch[];
  product_images: ProductImage[];
  services: Service[];
  certifications: Certification[];
}

export interface AdminPermissions {
  userManagement: {
    view: boolean;
    edit: boolean;
    delete: boolean;
    full: boolean;
  };
  contentManagement: {
    view: boolean;
    supervise: boolean;
    delete: boolean;
  };
  analytics: {
    view: boolean;
    export: boolean;
  };
  reports: {
    view: boolean;
    create: boolean;
  };
  system: {
    manage: boolean;
    settings: boolean;
    backups: boolean;
  };
  support: {
    manage: boolean;
  };
}

export interface AdminData {
  id: number;
  name: string;
  email: string;
  role: "admin" | "super_admin";
  department: string | null;
  jobRole: string | null;
  profileImage: string | null;
  emailVerifiedAt: string | null;
  permissions: AdminPermissions | null;
}

export interface BaseLoginResponse {
  message: string;
  userType: string;
  accessToken: string;
  tokenType: string;
}

export interface SupplierLoginResponse extends BaseLoginResponse {
  userType: "supplier";
  supplier: SupplierData;
}

export interface AdminLoginResponse extends BaseLoginResponse {
  userType: "admin";
  admin: AdminData;
}

export interface SuperAdminLoginResponse extends BaseLoginResponse {
  userType: "super_admin";
  super_admin: Omit<AdminData, "permissions">; // Super admin has no permissions
}

export type LoginResponse =
  | SupplierLoginResponse
  | AdminLoginResponse
  | SuperAdminLoginResponse;

export interface LoginRequest {
  email: string;
  password: string;
}
