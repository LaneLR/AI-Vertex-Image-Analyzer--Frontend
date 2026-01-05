export const getApiUrl = (path: string) => {
  const sanitizedPath = path.startsWith("/") ? path : `/${path}`;
  if (typeof window !== "undefined") {
    return sanitizedPath;
  }

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
  
  return `${baseUrl}${sanitizedPath}`;
};