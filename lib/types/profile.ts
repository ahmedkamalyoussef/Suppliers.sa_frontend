export interface ProfileUpdateData {
  businessName?: string;
  businessType?: string;
  categories?: string[];
  productKeywords?: string[];
  whoDoYouServe?: string;
  serviceDistance?: string;
  services?: string[];
  website?: string;
  mainPhone?: string;
  additionalPhones?: Array<{
    number: string;
    name: string;
    type: string;
  }>;
  address?: string;
  location?: { lat: number; lng: number };
  description?: string;
  workingHours?: {
    [key: string]: {
      closed?: boolean;
      open?: string;
      close?: string;
    };
  };
  hasBranches?: boolean;
  branches?: Array<{
    name: string;
    phone?: string;
    email?: string;
    address?: string;
    manager?: string;
    location?: { lat: number; lng: number };
    workingHours?: {
      [key: string]: {
        closed?: boolean;
        open?: string;
        close?: string;
      };
    };
    specialServices?: string[];
    isMainBranch?: boolean;
  }>;
  contactEmail?: string; // From verification/login
  contactPhone?: string; // From verification/login
  category?: string;
  document?: File; // Include document in main request
}

export interface ProfileUpdateResponse {
  message: string;
  supplier: any;
}

export interface DocumentUploadResponse {
  message: string;
  data: any;
}
