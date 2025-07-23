import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.locompro.app',
  appName: 'LoComPro',
  webDir: 'dist',
  server: {
    url: 'https://locompro.com.ar',
    cleartext: true,
  },
  bundledWebRuntime: false,
  ios: {
    contentInset: 'never',
    scrollEnabled: false,
    backgroundColor: '#ffffff',
    allowsLinkPreview: false,
    presentationStyle: 'fullscreen',
    hideLogs: true,
    webContentsDebuggingEnabled: false
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 3000,
      backgroundColor: '#ffffff',
      showSpinner: true,
      spinnerColor: '#007AFF',
      androidSpinnerStyle: 'large',
      iosSpinnerStyle: 'small',
      splashFullScreen: true,
      splashImmersive: true
    },
    StatusBar: {
      style: 'DARK',
      backgroundColor: '#ffffff'
    }
  }
};

export default config;