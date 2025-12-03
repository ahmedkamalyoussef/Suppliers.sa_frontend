export interface Inquiry {
  id: number;
  subject: string;
  message: string;
  email: string;
  phone: string;
  company: string | null;
  sender: {
    id: number;
    name: string;
  };
  receiver: {
    id: number;
    name: string;
  };
  is_read: boolean;
  type: "inquiry" | "reply";
  created_at: string;
  time_ago: string;
  is_reply: boolean;
}

export interface InquiryResponse {
  message: string;
  data: Inquiry;
}

export interface InquiryListResponse {
  data: Inquiry[];
}

export interface ReadStatusResponse {
  success: boolean;
  message: string;
}
