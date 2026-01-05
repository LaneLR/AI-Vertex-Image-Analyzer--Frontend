export const getApiUrl = (path: string) => {
  if (typeof window !== "undefined") {
    // If it's an internal NextAuth call, use a relative path
    // This fixes the "Failed to fetch" on /api/auth/session
    if (path.includes("/api/auth") || path.includes("/api/verify")) {
      return path.startsWith("/") ? path : `/${path}`;
    }

    const isLocalhost =
      window.location.hostname === "localhost" ||
      window.location.hostname === "127.0.0.1";

    // For other API calls (like your scanner), use the logic below
    const baseUrl = isLocalhost
      ? "http://localhost:3000"
      : "https://your-flip-finder-domain.com";

    const sanitizedPath = path.startsWith("/") ? path : `/${path}`;
    return `${baseUrl}${sanitizedPath}`;
  }

  // Fallback for server-side calls
  return path;
};
