import img from "./assets/default.png";

// Helper function to get avatar with fallback
export const getAvatarUrl = (
  avatar: string | null | undefined,
  name: string
) => {
  if (avatar && avatar !== "" && !avatar.includes("uploads/default.png")) {
    return avatar.startsWith("http")
      ? avatar
      : `http://localhost:8000/${avatar}`;
  }
  // Use local default avatar
  return img.src;
};
