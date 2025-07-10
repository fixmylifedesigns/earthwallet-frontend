import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// Mobile initialization
import { Capacitor } from '@capacitor/core';

// Initialize mobile features if running on native platform
if (Capacitor.isNativePlatform()) {
  import('@capacitor/status-bar').then(({ StatusBar, Style }) => {
    StatusBar.setStyle({ style: Style.Light });
    StatusBar.setBackgroundColor({ color: '#16a34a' });
  });
  
  import('@capacitor/splash-screen').then(({ SplashScreen }) => {
    // Hide splash screen after app loads
    setTimeout(() => {
      SplashScreen.hide();
    }, 1000);
  });
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)