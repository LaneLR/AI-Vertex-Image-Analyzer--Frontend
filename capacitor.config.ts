import type { CapacitorConfig } from '@capacitor/cli'; 

const config: CapacitorConfig = {
  appId: 'com.flipsavvy.app',
  appName: 'Flip Savvy',
  webDir: 'out', // Matches your Next.js 'output: export' directory
  server: {
    androidScheme: 'https',
    iosScheme: 'https'
  },
  ios: {
    appendUserAgent: 'FlipSavvy-Mobile-App'
  },
  android: {
    appendUserAgent: 'FlipSavvy-Mobile-App'
  }
};

export default config;