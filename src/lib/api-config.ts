// // export const getApiUrl = (path: string) => {
// //   const sanitizedPath = path.startsWith("/") ? path : `/${path}`;
// //   if (typeof window !== "undefined") {
// //     return sanitizedPath;
// //   }

// //   const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
  
// //   return `${baseUrl}${sanitizedPath}`;
// // };

// // lib/api-config.ts

// /**
//  * Replace this with your actual Render or AWS production URL
//  */
// const PRODUCTION_API_URL = "https://flip-finder.onrender.com";

// export const getApiUrl = (path: string) => {
//   const sanitizedPath = path.startsWith("/") ? path : `/${path}`;

//   if (typeof window !== "undefined") {
//     // 1. Check if running inside a Native App (iOS/Android)
//     const isNativeApp = 
//       window.location.protocol === 'capacitor:' || 
//       window.location.protocol === 'http:' && window.location.hostname === 'localhost';

//     // 2. If it's the app, it MUST use the absolute production URL
//     if (isNativeApp && !window.location.port) { 
//       // return `${PRODUCTION_API_URL}${sanitizedPath}`;
//       return `${process.env.NEXT_PUBLIC_API_URL}${sanitizedPath}`;
//     }

//     // 3. If it's a browser, use relative paths (standard Next.js behavior)
//     return sanitizedPath;
//   }

//   // 4. Server-side rendering (SSR) logic
//   const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || PRODUCTION_API_URL;
//   return `${baseUrl}${sanitizedPath}`;
// };

// lib/api-config.ts

const PRODUCTION_API_URL = "https://flip-finder.onrender.com";

export const getApiUrl = (path: string) => {
  const sanitizedPath = path.startsWith("/") ? path : `/${path}`;
  
  // Use the env variable if it exists, otherwise fallback to Production
  const baseUrl = process.env.NEXT_PUBLIC_API_URL 
    // || PRODUCTION_API_URL;

  if (typeof window !== "undefined") {
    // If we are in development (localhost), we MUST use the absolute URL (port 5000)
    // because Next.js (port 3000) is no longer hosting the API.
    if (window.location.hostname === 'localhost') {
      return `${baseUrl}${sanitizedPath}`;
    }

    // For production web builds, relative paths are fine if hosted on the same domain
    // but absolute paths are safer for Capacitor.
    return `${baseUrl}${sanitizedPath}`;
  }

  return `${baseUrl}${sanitizedPath}`;
};