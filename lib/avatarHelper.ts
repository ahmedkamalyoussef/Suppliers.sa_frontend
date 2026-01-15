import img from "./assets/default.png";
import { getApiUrl } from "./config";

// Helper function to get avatar with fallback
export const getAvatarUrl = (
  avatar: string | null | undefined,
  name: string
) => {
  if (
    avatar &&
    avatar !== "" &&
    !avatar.includes("uploads/default.png") &&
    !avatar.includes("images/default-avatar.png")
  ) {
    return getApiUrl(avatar);
  }
  // Use local default avatar
  return img.src;
};
