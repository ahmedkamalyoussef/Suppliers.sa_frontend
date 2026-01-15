export const API_BASE_URL = "http://localhost:8000";

export const getApiUrl = (path: string) => {
  return path.startsWith("http") ? path : `${API_BASE_URL}/${path}`;
};
