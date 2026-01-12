export interface RegistrationData {
  businessName: string;
  email: string;
  phone: string;
  password: string;
  password_confirmation: string;
  accept_policies: boolean;
}

export interface RegistrationResponse {
  message: string;
  supplier: any;
}

export interface SendOtpRequest {
  email: string;
}

export interface VerifyOtpRequest {
  email: string;
  otp: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  email: string;
  otp: string;
  password: string;
  password_confirmation: string;
}

export interface OtpResponse {
  message: string;
  success: boolean;
  supplier?: any;
  admin?: any;
  super_admin?: any;
  accessToken?: string;
  tokenType?: string;
  userType?: "supplier" | "admin" | "super_admin";
}
