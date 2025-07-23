
import React from 'react';
import { Capacitor } from '@capacitor/core';
import WebViewApp from './WebViewApp';

const App = () => {
  // If running on native platform, use WebView wrapper
  if (Capacitor.isNativePlatform()) {
    return <WebViewApp />;
  }

  // For web development, show a message
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-6">
      <div className="text-center max-w-md">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          LoComPro iOS App
        </h1>
        <p className="text-gray-600 mb-6">
          Esta es la versión web de desarrollo. La app nativa redirigirá a https://locompro.com.ar
        </p>
        <a 
          href="https://locompro.com.ar" 
          target="_blank" 
          rel="noopener noreferrer"
          className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors inline-block"
        >
          Ir a LoComPro
        </a>
      </div>
    </div>
  );
};

export default App;
