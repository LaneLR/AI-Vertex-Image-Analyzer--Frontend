import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.flipsavvy.app',
  appName: 'Flip Savvy',
  webDir: 'out',
  server: {
    // Correct property name for most Capacitor versions to add custom strings
    androidScheme: 'https',
    iosScheme: 'https'
  },
  // If your version supports global override, it goes here, 
  // but appending is more standard:
  ios: {
    appendUserAgent: 'FlipSavvy-Mobile-App'
  },
  android: {
    appendUserAgent: 'FlipSavvy-Mobile-App'
  }
};

export default config;