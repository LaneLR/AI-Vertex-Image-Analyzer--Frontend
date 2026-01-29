import type { CapacitorConfig } from '@capacitor/cli'; 

const config: CapacitorConfig = {
  appId: 'com.thriftsavvy.app',
  appName: 'Thrift Savvy',
  webDir: 'out', // Matches your Next.js 'output: export' directory
  server: {
    androidScheme: 'https',
    iosScheme: 'https'
  },
  ios: {
    appendUserAgent: 'ThriftSavvy-Mobile-App'
  },
  android: {
    appendUserAgent: 'ThriftSavvy-Mobile-App'
  }
};

export default config;