export interface Document {
  id: number;
  supplier_id: number;
  document_type: string;
  file_path: string;
  status: "pending" | "approved" | "rejected" | "flagged";
  created_at: string;
  updated_at: string;
  reviewer_id?: number;
  review_notes?: string;
  supplier?: {
    id: number;
    name: string;
    email: string;
    phone: string;
    profile_image?: string;
    status: string;
    created_at: string;
    updated_at: string;
  };
  reviewer?: {
    id: number;
    name: string;
    email: string;
  };
}

export interface DocumentsResponse {
  data: Document[];
  pagination: {
    currentPage: number;
    perPage: number;
    total: number;
    lastPage: number;
  };
}

export interface DocumentActionResponse {
  message: string;
  data: Document;
}
