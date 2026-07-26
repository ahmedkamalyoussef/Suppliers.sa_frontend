import { ProfileFormData } from "@/lib/types";
type Day =
  | "monday"
  | "tuesday"
  | "wednesday"
  | "thursday"
  | "friday"
  | "saturday"
  | "sunday";

interface WorkingHoursDay {
  open: string;
  close: string;
  closed: boolean;
}

export const initialFormData: ProfileFormData = {
  businessName: "",
  category: "",
  description: "",
  services: [],
  contactEmail: "",
  contactPhone: "",
  website: "",
  address: "Riyadh",
  mainPhone: "",
  businessType: "",
  categories: [],
  productKeywords: [],
  targetCustomers: [],
  serviceDistance: 0,
  additionalPhones: [],
  workingHours: {
    monday: { open: "09:00", close: "17:00", closed: false },
    tuesday: { open: "09:00", close: "17:00", closed: false },
    wednesday: { open: "09:00", close: "17:00", closed: false },
    thursday: { open: "09:00", close: "17:00", closed: false },
    friday: { open: "09:00", close: "17:00", closed: false },
    saturday: { open: "09:00", close: "17:00", closed: false },
    sunday: { open: "09:00", close: "17:00", closed: false },
  },
  whoDoYouServe: "",
  location: { lat: 24.7136, lng: 46.6753 },
  hasBranches: false,
  branches: [],
  document: null,
};
