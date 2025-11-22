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
  address: "",
  mainPhone: "",
  businessType: "",
  categories: [],
  productKeywords: [],
  targetCustomers: [],
  serviceDistance: 0,
  additionalPhones: [],
  workingHours: {
    monday: { open: "", close: "", closed: false },
    tuesday: { open: "", close: "", closed: false },
    wednesday: { open: "", close: "", closed: false },
    thursday: { open: "", close: "", closed: false },
    friday: { open: "", close: "", closed: false },
    saturday: { open: "", close: "", closed: false },
    sunday: { open: "", close: "", closed: false },
  },
  whoDoYouServe: "",
  location: { lat: 24.7136, lng: 46.6753 },
  hasBranches: false,
  branches: [],
  document: null,
};
