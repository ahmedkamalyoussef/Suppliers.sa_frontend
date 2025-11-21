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

export interface FormData {
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
}

export interface Location {
  lat: number;
  lng: number;
}

export interface Errors {
  [key: string]: string;
}

export interface CompleteProfileFormProps {
  formData: FormData;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
  selectedLocation: Location;
  setSelectedLocation: React.Dispatch<React.SetStateAction<Location>>; // إضافة هذا السطر
}
