import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.flipfinder.app',
  appName: 'Flip Finder',
  webDir: 'out',
  server: {
    // Correct property name for most Capacitor versions to add custom strings
    androidScheme: 'https',
    iosScheme: 'https'
  },
  // If your version supports global override, it goes here, 
  // but appending is more standard:
  ios: {
    appendUserAgent: 'FlipFinder-Mobile-App'
  },
  android: {
    appendUserAgent: 'FlipFinder-Mobile-App'
  }
};

export default config;