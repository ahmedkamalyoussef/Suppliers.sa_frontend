"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { apiService } from "./api";

export interface SupplierProfile {
  id: number;
  name: string;
  status: string;
  profile: {
    business_type: string;
    website: string;
    contact_email: string;
    description: string | null;
    service_distance: string;
    target_market: string[];
    main_phone: string;
    additional_phones: Array<{
      id: number;
      type: string;
      number: string;
      name: string;
    }>;
    business_address: string;
    latitude: string;
    longitude: string;
    working_hours: {
      [key: string]: {
        open: string;
        close: string;
        closed: boolean;
      };
    };
    services_offered: string[];
  };
  profile_image: string;
  ratings: {
    average: number | null;
    count: number;
    reviews: any[];
  };
  certifications: Array<{
    id: number;
    certification_name: string;
  }>;
  product_images: Array<{
    id: number;
    image_url: string;
  }>;
  services: Array<{
    id: number;
    service_name: string;
  }>;
}

export interface User {
  id: number;
  slug: string;
  name: string;
  email: string;
  phone: string;
  profileImage: string;
  emailVerifiedAt: string;
  status: string;
  plan: string;
  profileCompletion: number;
  profile?: any;
  branches?: any[];
}

export interface AuthContextType {
  user: User | null;
  token: string | null;
  tokenType: string;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (user: User, token: string, tokenType: string) => void;
  logout: () => Promise<void>;
  updateUser: (userData: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [tokenType, setTokenType] = useState<string>("Bearer");
  const [isLoading, setIsLoading] = useState(true);

  // Check for existing auth on mount
  useEffect(() => {
    const savedToken = localStorage.getItem("supplier_token");
    const savedTokenType = localStorage.getItem("token_type") || "Bearer";
    const savedUser = localStorage.getItem("supplier_user");

    if (savedToken) {
      setToken(savedToken);
      setTokenType(savedTokenType);

      // Try to restore user data from localStorage
      if (savedUser) {
        try {
          const userData = JSON.parse(savedUser);
          setUser(userData);
        } catch (error) {
          console.error("Failed to parse saved user data:", error);
        }
      }

      setIsLoading(false);
    } else {
      setIsLoading(false);
    }
  }, []);

  const login = (
    userData: User,
    accessToken: string,
    accessTokenType: string
  ) => {
    setUser(userData);
    setToken(accessToken);
    setTokenType(accessTokenType);

    // Save to localStorage
    localStorage.setItem("supplier_token", accessToken);
    localStorage.setItem("token_type", accessTokenType || "Bearer");
    localStorage.setItem("supplier_user", JSON.stringify(userData));
  };

  const logout = async () => {
    try {
      // Call logout API
      await apiService.logout();
    } catch (error) {
      console.error("Logout API failed:", error);
      // Continue with local logout even if API fails
    }

    // Clear local state
    setUser(null);
    setToken(null);
    setTokenType("Bearer");

    // Clear localStorage
    localStorage.removeItem("supplier_token");
    localStorage.removeItem("token_type");
    localStorage.removeItem("supplier_user");
  };

  const updateUser = (userData: Partial<User>) => {
    if (user) {
      setUser({ ...user, ...userData });
    }
  };

  const isAuthenticated = !!token; // Only check token, not user data for now

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        tokenType,
        isAuthenticated,
        isLoading,
        login,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
