/// <reference types="@capacitor/status-bar" />
import type { CapacitorConfig } from '@capacitor/cli'; 

const config: CapacitorConfig = {
  appId: 'com.resaleiq.app',
  appName: 'ResaleIQ',
  webDir: 'out', 
  server: {
    androidScheme: 'https',
    iosScheme: 'https',
  },
  ios: {
    appendUserAgent: 'ResaleIQ-Mobile-App',
    backgroundColor: '#ffffff', 
  },
  android: {
    appendUserAgent: 'ResaleIQ-Mobile-App'
  },
  plugins: {
    StatusBar: {
      overlaysWebView: false,
      style: 'DARK',
      backgroundColor: '#0f0f0f'
    }
  }
};

export default config;