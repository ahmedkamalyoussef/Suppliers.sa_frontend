export interface Review {
  id: number;
  rating: number;
  comment: string;
  created_at: string;
  user: {
    name: string;
    avatar?: string;
  };
  reply?: {
    id: number;
    reply: string;
    type: string;
    created_at: string;
  };
}

export interface Certification {
  id: number;
  certification_name: string;
}

export interface Product {
  id: number;
  product_name: string;
  created_at: string;
  updated_at: string;
}

export interface Service {
  id: number;
  service_name: string;
}
