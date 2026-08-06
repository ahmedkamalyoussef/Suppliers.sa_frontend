export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "https://api.supplier.sa";

export const getApiUrl = (path: string) => {
  if (path.startsWith("http")) return path;
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  return `${API_BASE_URL}${cleanPath}`;
};
