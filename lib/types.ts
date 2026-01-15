export interface WorkingHours {
  [key: string]: {
    open: string;
    close: string;
    closed: boolean;
  };
}

export interface AdditionalPhone {
  id: number;
  type: string;
  number: string;
  name: string;
}

export interface Preferences {
  marketing_emails: boolean;
  profile_visibility: "public" | "limited";
  show_email_publicly: boolean;
  show_phone_publicly: boolean;
  allow_direct_contact: boolean;
  allow_search_engine_indexing: boolean;
}

export type Branch = {
  id: string;
  name: string;
  address: string;
  phone: string;
  email: string;
  manager: string;
  location: { lat: number; lng: number };
  workingHours: WorkingHours;
  status: "active" | "inactive" | string;
  specialServices: string[];
  isMainBranch: boolean;
};

export interface ProfileFormData {
  businessName: string;
  category: string;
  categories: string[];
  description: string;
  services: string[];
  contactEmail: string;
  contactPhone: string;
  website: string;
  address: string;
  mainPhone: string;
  businessType: string;
  productKeywords: string[];
  targetCustomers: string[];
  serviceDistance: number;
  additionalPhones: AdditionalPhone[];
  workingHours: {
    monday: { open: string; close: string; closed: boolean };
    tuesday: { open: string; close: string; closed: boolean };
    wednesday: { open: string; close: string; closed: boolean };
    thursday: { open: string; close: string; closed: boolean };
    friday: { open: string; close: string; closed: boolean };
    saturday: { open: string; close: string; closed: boolean };
    sunday: { open: string; close: string; closed: boolean };
  };
  whoDoYouServe: string;
  location: Location;
  hasBranches: boolean;
  branches: Branch[];
  document: File | null;
}

export interface Location {
  lat: number;
  lng: number;
}

export interface Errors {
  [key: string]: string;
}

export interface CompleteProfileFormProps {
  formData: ProfileFormData;
  setFormData: React.Dispatch<React.SetStateAction<ProfileFormData>>;
  selectedLocation: Location;
  setSelectedLocation: (location: Location) => void;
  currentStep: number;
  setCurrentStep: (step: number) => void;
  nextStep: () => void;
  prevStep: () => void;
  goToStep: (step: number) => void;
}

export interface Business {
  id: number;
  name: string;
  slug: string;
  categories: string[];
  reviewsCount: number;
  status: string;
  plan: string;
  mainPhone: string;
  contactEmail: string;
  services: string[];
  targetMarket: string[];
  preferences: Preferences;
  businessImage?: string;
  category?: string;
  businessType?: string;
  address?: string;
  serviceDistance?: number;
  rating?: number;
  latitude?: string;
  longitude?: string;
}

// Inbox Interfaces
export interface InboxMessage {
  id: number;
  type:
    | "supplier_to_supplier_inquiry"
    | "supplier_rating"
    | "message"
    | "review_reply";
  subject: string;
  message: string;
  is_read: boolean;
  created_at: string;
  time_ago: string;
  direction: "received" | "sent";
  sender: {
    id: number | null;
    name: string;
  };
  receiver: {
    id: number;
    name: string;
  };
  // Supplier to supplier inquiry fields
  inquiry_type?: string;
  is_reply?: boolean;
  // Supplier rating fields
  score?: number;
  rating_type?: string;
  has_reply?: boolean;
  // Message fields
  sender_email?: string;
  receiver_email?: string;
  // Review reply fields
  reply_type?: string;
  rating_id?: number;
}

export interface InboxResponse {
  inbox: InboxMessage[];
  sent: InboxMessage[];
  all: InboxMessage[];
  unread_count: number;
  avg_response_time: string;
  response_rate: string;
}

// Supplier Management Interfaces
export type SupplierStatus =
  | "active"
  | "suspended"
  | "pending"
  | "inactive"
  | "approved";
export type SupplierPlan = "Basic" | "Premium" | "Enterprise";

export interface Supplier {
  id: number;
  name: string;
  email: string;
  businessName: string;
  plan: SupplierPlan;
  status: SupplierStatus;
  joinDate: string;
  lastActive: string;
  revenue: string;
  profileCompletion: number;
  avatar: string;
  rating?: number | null;
  reviewsCount: number;
}

export interface SuppliersListResponse {
  users: Supplier[];
  pagination: {
    currentPage: number;
    perPage: number;
    total: number;
    lastPage: number;
  };
}

export interface UpdateSupplierRequest {
  plan?: SupplierPlan;
  status?: SupplierStatus;
  name?: string;
  email?: string;
  businessName?: string;
}

export interface SupplierActionResponse {
  message: string;
}

export interface GetSuppliersParams {
  status?: SupplierStatus | "all";
  plan?: SupplierPlan | "all";
  page?: number;
  per_page?: number;
  search?: string;
}

export interface CreateSupplierRequest {
  name: string;
  email: string;
  businessName: string;
  plan: SupplierPlan;
  status: SupplierStatus;
  password: string;
}

// Admin Inquiry Interfaces
export interface AdminInquiry {
  id: number;
  sender_id: number;
  full_name: string;
  email_address: string;
  phone_number: string | null;
  subject: string;
  message: string;
  type: "inquiry" | "reply";
  is_read: boolean;
  from: "supplier" | "admin";
  created_at: string;
}

export interface AdminInquiryListResponse {
  inquiries: AdminInquiry[];
}

// Branch Management Interfaces
export interface BranchCreateRequest {
  name: string;
  phone: string;
  email: string;
  address: string;
  manager_name: string;
  location: {
    lat: number;
    lng: number;
  };
  workingHours: {
    [key: string]: {
      open: string;
      close: string;
      closed: boolean;
    };
  };
  specialServices: string[];
  status: "active" | "inactive";
  isMainBranch: boolean;
}

export interface BranchUpdateRequest {
  name?: string;
  phone?: string;
  email?: string;
  address?: string;
  manager?: string;
  location?: {
    lat: number;
    lng: number;
  };
  workingHours?: {
    [key: string]: {
      open: string;
      close: string;
      closed: boolean;
    };
  };
  specialServices?: string[];
  status?: "active" | "inactive";
  isMainBranch?: boolean;
}

export interface BranchResponse {
  id: string;
  name: string;
  phone: string;
  email: string;
  address: string;
  manager: string;
  status: "active" | "inactive";
  isMainBranch: boolean;
  location: {
    lat: number;
    lng: number;
  };
  workingHours: {
    [key: string]: {
      open: string;
      close: string;
      closed: boolean;
    };
  };
  specialServices: string[];
  createdAt: string;
  updatedAt: string;
}

export interface BranchesResponse {
  branches: BranchResponse[];
}

export interface BranchActionResponse {
  message: string;
  branch?: BranchResponse;
}

// ====== COMMUNICATIONS INTERFACES ======

export interface CommunicationItem {
  id: number;
  type: "inquiry" | "message";
  sender_id: number;
  sender_name: string;
  sender_email: string;
  sender_image?: string;
  receiver_id: number;
  receiver_name: string;
  receiver_email: string;
  receiver_image?: string;
  subject: string;
  message: string;
  phone?: string;
  company?: string;
  is_read: boolean;
  read_at: string | null;
  parent_id: number | null;
  inquiry_type?: string;
  message_type?: string;
  created_at: string;
  updated_at: string;
}

export interface CommunicationStatistics {
  total_communications: number;
  total_inquiries: number;
  total_messages: number;
  unread_count: number;
  last_communication: string;
}

export interface CommunicationSuppliers {
  supplier1: {
    id: number;
    name: string;
    email: string;
  };
  supplier2: {
    id: number;
    name: string;
    email: string;
  };
}

export interface CommunicationsResponse {
  message: string;
  suppliers: CommunicationSuppliers;
  statistics: CommunicationStatistics;
  communications: CommunicationItem[];
}

export interface CommunicationSummary {
  total_inquiries: number;
  total_messages: number;
  total_communications: number;
  last_communication_at: string;
}

export interface CommunicationsSummaryResponse {
  message: string;
  supplier1_id: number;
  supplier2_id: number;
  summary: CommunicationSummary;
}
