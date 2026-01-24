export const API_BASE_URL = "https://api.supplier.sa"; //"http://localhost:8000";

export const getApiUrl = (path: string) => {
  return path.startsWith("http") ? path : `${API_BASE_URL}/${path}`;
};
