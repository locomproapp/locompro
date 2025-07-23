import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.locompro.ar',
  appName: 'LoCompro',
  webDir: 'dist',
  server: {
    url: 'https://locompro.com.ar',
    cleartext: true
  },
  ios: {
    backgroundColor: '#ffffff',
    webContentsDebuggingEnabled: false,
    limitsNavigationsToAppBoundDomains: true,
    scheme: 'https',
    allowsLinkPreview: false,
    scrollEnabled: false,
    overrideUserAgent: 'LoCompro/1.0 (iOS)',
    contentInset: 'never'
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 3000,
      launchAutoHide: true,
      backgroundColor: '#ffffff',
      androidSplashResourceName: 'splash',
      androidScaleType: 'CENTER_CROP',
      showSpinner: false,
      androidSpinnerStyle: 'large',
      iosSpinnerStyle: 'small',
      spinnerColor: '#0066CC',
      splashFullScreen: true,
      splashImmersive: true,
      layoutName: 'launch_screen',
      useDialog: true
    },
    StatusBar: {
      style: 'default',
      backgroundColor: '#ffffff'
    }
  }
};

export default config;