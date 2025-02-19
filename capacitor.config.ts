import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'io.ionic.starter',
  appName: 'EventHive',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  }
};

export default config;
