"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import PublicBusinessProfile from "./PublicBusinessProfile";
import { apiService } from "../../../lib/api";

export default function ProfileClient({ id }: { id: string }) {
  const [profileData, setProfileData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // Auth guard - redirect to login if not authenticated
  useEffect(() => {
    const token = localStorage.getItem("supplier_token");
    const user = localStorage.getItem("supplier_user");
    
    if (!token || !user) {
      window.location.href = "/login";
      return;
    }
  }, []);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setIsLoading(true);
        let profileId = id;

        // If ID is 'me', get the logged-in user's ID
        if (id === "me") {
          const user = localStorage.getItem("supplier_user");
          if (user) {
            try {
              const userData = JSON.parse(user);
              if (userData?.id) {
                profileId = userData.id;
                // Update the URL to show the actual ID
                router.replace(`/profile/${profileId}`);
                return; // This will unmount the component and remount with the new ID
              }
            } catch (e) {
              setError("خطأ في تحميل بيانات المستخدم");
              return;
            }
          } else {
            // If no user is logged in, redirect to login
            router.replace("/login");
            return;
          }
        }

        // Fetch the profile data
        const data = await apiService.getSupplierProfile(profileId);

        // Also fetch from public businesses API to get preferences
        try {
          const businessesResponse = await apiService.getBusinesses({
            per_page: 100,
          });
          const businessWithPreferences = businessesResponse.data.find(
            (b) => b.id.toString() === profileId
          );

          if (
            businessWithPreferences?.preferences?.profile_visibility ===
            "limited"
          ) {
            // Check if current user is the owner of this profile
            const userData = localStorage.getItem("supplier_user");
            if (userData) {
              try {
                const user = JSON.parse(userData);
                if (user.id.toString() !== profileId) {
                  // Not the owner, redirect to businesses page
                  router.replace("/businesses");
                  return;
                }
              } catch (error) {
                console.error("Error parsing user data:", error);
                router.replace("/businesses");
                return;
              }
            } else {
              // Not logged in, redirect to businesses page
              router.replace("/businesses");
              return;
            }
          }
        } catch (prefError) {
          console.error("Error fetching preferences:", prefError);
          // If we can't get preferences, allow access (fallback)
        }

        setProfileData(data);
      } catch (err) {
        setError("حدث خطأ أثناء تحميل الملف الشخصي");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [id, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
          <p className="text-gray-600 text-lg">جاري تحميل الملف الشخصي...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 mb-4">
            <i className="ri-error-warning-line text-4xl"></i>
          </div>
          <p className="text-gray-700 text-lg">{error}</p>
        </div>
      </div>
    );
  }

  return <PublicBusinessProfile supplier={profileData} businessId={id} />;
}
