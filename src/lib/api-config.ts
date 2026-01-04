export const getApiUrl = (path: string) => {
  // Check if we are in a browser or a Capacitor app
  const isLocalhost =
    typeof window !== "undefined" &&
    (window.location.hostname === "localhost" ||
      window.location.hostname === "127.0.0.1");

  // Replace with your actual deployed Production URL (Vercel, AWS, etc.)
  const baseUrl = isLocalhost
    ? "http://localhost:3000"
    : "https://your-flip-finder-domain.com";

  // Ensure path starts with /
  const sanitizedPath = path.startsWith("/") ? path : `/${path}`;

  return `${baseUrl}${sanitizedPath}`;
};
