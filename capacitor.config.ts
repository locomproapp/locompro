import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.locompro.app',
  appName: 'locompro',
  webDir: 'dist',
  server: {
    url: 'https://36ecd180-7b81-44e9-989d-a0c23d56bc27.lovableproject.com?forceHideBadge=true',
    cleartext: true,
  },
  bundledWebRuntime: false
};

export default config;