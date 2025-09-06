import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.dogswab.app',
  appName: 'DOGSWAB',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: "#77e1c0",
      showSpinner: false
    },
    StatusBar: {
      style: 'light',
      backgroundColor: "#77e1c0"
    }
  }
};

export default config;