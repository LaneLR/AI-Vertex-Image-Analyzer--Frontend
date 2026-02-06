import type { CapacitorConfig } from '@capacitor/cli'; 

const config: CapacitorConfig = {
  appId: 'com.resaleiq.app',
  appName: 'ResaleIQ',
  webDir: 'out', // Matches your Next.js 'output: export' directory
  server: {
    androidScheme: 'https',
    iosScheme: 'https'
  },
  ios: {
    appendUserAgent: 'ResaleIQ-Mobile-App',
    backgroundColor: 'var(--bg-main)'
  },
  android: {
    appendUserAgent: 'ResaleIQ-Mobile-App'
  }
};

export default config;