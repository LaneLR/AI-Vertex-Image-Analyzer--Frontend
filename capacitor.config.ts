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
    backgroundColor: '#eeeeee', 
  },
  android: {
    appendUserAgent: 'ResaleIQ-Mobile-App'
  },
  plugins: {
    StatusBar: {
      overlaysWebView: false,
      style: 'DEFAULT',
      backgroundColor: '#eeeeee'
    }
  }
};

export default config;