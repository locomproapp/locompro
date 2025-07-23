import React, { useState, useEffect } from 'react';
import { Network } from '@capacitor/network';
import { App } from '@capacitor/app';
import { Capacitor } from '@capacitor/core';

const WebViewApp = () => {
  const [isOnline, setIsOnline] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check network status
    const checkNetworkStatus = async () => {
      const status = await Network.getStatus();
      setIsOnline(status.connected);
    };

    // Listen for network changes
    let networkListener: any;
    let appStateListener: any;

    const setupListeners = async () => {
      networkListener = await Network.addListener('networkStatusChange', (status) => {
        setIsOnline(status.connected);
        if (status.connected && !isLoading) {
          // Reload the page if connection restored
          window.location.reload();
        }
      });

      // Handle app state changes (iOS backgrounding/foregrounding)
      appStateListener = await App.addListener('appStateChange', ({ isActive }) => {
        if (isActive && !isOnline) {
          checkNetworkStatus();
        }
      });
    };

    setupListeners();
    checkNetworkStatus();

    // Simulate loading time
    const timer = setTimeout(() => {
      setIsLoading(false);
      if (isOnline) {
        // Redirect to the actual website
        window.location.href = 'https://locompro.com.ar';
      }
    }, 3000);

    return () => {
      clearTimeout(timer);
      if (networkListener) networkListener.remove();
      if (appStateListener) appStateListener.remove();
    };
  }, [isLoading]);

  // Handle external links
  useEffect(() => {
    if (Capacitor.isNativePlatform()) {
      const handleClick = (e: Event) => {
        const target = e.target as HTMLAnchorElement;
        if (target.tagName === 'A' && target.href) {
          const url = new URL(target.href);
          const currentDomain = 'locompro.com.ar';
          
          // If it's an external link, open in Safari
          if (!url.hostname.includes(currentDomain)) {
            e.preventDefault();
            window.open(target.href, '_system');
          }
        }
      };

      document.addEventListener('click', handleClick);
      return () => document.removeEventListener('click', handleClick);
    }
  }, []);

  if (!isOnline) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-6">
        <div className="text-center max-w-md">
          <div className="mb-6">
            <svg 
              className="w-16 h-16 mx-auto text-gray-400 mb-4" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={1.5} 
                d="M12 9v3m0 0v3m0-3h3m-3 0H9m12-3a9 9 0 11-18 0 9 9 0 0118 0z" 
              />
            </svg>
          </div>
          <h1 className="text-xl font-semibold text-gray-900 mb-3">
            Sin conexión a internet
          </h1>
          <p className="text-gray-600 mb-6 leading-relaxed">
            Por favor, revisá tu conexión e intentá nuevamente.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            Intentar nuevamente
          </button>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="mb-6">
            <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto"></div>
          </div>
          <p className="text-lg text-gray-700 font-medium">Cargando…</p>
        </div>
      </div>
    );
  }

  // This should redirect to the website, but just in case
  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="text-center">
        <p className="text-lg text-gray-700">Redirigiendo...</p>
      </div>
    </div>
  );
};

export default WebViewApp;