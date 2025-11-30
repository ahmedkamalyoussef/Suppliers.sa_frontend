export interface InquiryRequest {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}

export interface BusinessRequest {
  appearance: "showName" | "anonymous";
  industry: string;
  preferred_distance: string;
  description: string;
}

export interface BusinessRequestResponse {
  message: string;
  inquiries_sent: number;
  matching_suppliers_count: number;
  note?: string;
}

export interface InquiryResponse {
  message: string;
  data: {
    id: number;
    from: string;
    subject: string;
    message: string;
    contact: string;
    phone: string;
    type: string;
    from_source: string;
    isRead: boolean;
    receivedAt: string;
    updatedAt: string;
  };
}
