export interface Partnership {
  id: number;
  name: string;
  image: string;
  created_at?: string;
  updated_at?: string;
}

export interface PartnershipFormData {
  name: string;
  image: File;
}

export interface CreatePartnershipRequest {
  name: string;
  image: File;
}

export interface UpdatePartnershipRequest {
  name: string;
  image: File;
}

export interface CreatePartnershipResponse {
  message: string;
  partnership: Partnership;
}

export interface UpdatePartnershipResponse {
  message: string;
  partnership: Partnership;
}

export interface DeletePartnershipResponse {
  message: string;
}

export interface GetPartnershipsResponse extends Array<Partnership> {}
