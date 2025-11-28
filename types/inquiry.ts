export interface InquiryRequest {
  name: string;
  email: string;
  phone: string;
  company: string;
  subject: string;
  message: string;
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
