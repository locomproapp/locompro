import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { Capacitor } from '@capacitor/core'
import { SplashScreen } from '@capacitor/splash-screen'
import { StatusBar, Style } from '@capacitor/status-bar'

// Configure native plugins
const initializeApp = async () => {
  if (Capacitor.isNativePlatform()) {
    // Configure status bar
    await StatusBar.setStyle({ style: Style.Dark })
    await StatusBar.setBackgroundColor({ color: '#ffffff' })
    
    // Show splash screen briefly
    await SplashScreen.show({
      showDuration: 3000,
      autoHide: true
    })
  }
}

initializeApp()

createRoot(document.getElementById("root")!).render(<App />);
