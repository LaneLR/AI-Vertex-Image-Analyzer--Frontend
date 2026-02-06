declare module '@capacitor/cli' {
  export interface CapacitorConfig {
    appId: string;
    appName: string;
    webDir: string;
    server?: {
      androidScheme?: string;
      iosScheme?: string;
      hostname?: string;
    };
    ios?: {
      appendUserAgent?: string;
      backgroundColor?: string;
    };
    android?: {
      appendUserAgent?: string;
    };
    plugins?: {
      
    }
  }
}