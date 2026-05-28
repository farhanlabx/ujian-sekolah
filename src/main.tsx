// Safari/Chrome iframe specific patch for window.fetch writeability
try {
  const nativeFetch = window.fetch;
  if (nativeFetch) {
    try {
      Object.defineProperty(window, 'fetch', {
        value: nativeFetch,
        writable: true,
        configurable: true,
        enumerable: true
      });
    } catch (e) {
      const proto = Object.getPrototypeOf(window);
      if (proto && 'fetch' in proto) {
        Object.defineProperty(proto, 'fetch', {
          value: nativeFetch,
          writable: true,
          configurable: true,
          enumerable: true
        });
      }
    }
  }
} catch (e) {
  console.warn('Unable to patch window.fetch for writeability', e);
}

try {
  const nativeFetch = globalThis.fetch;
  if (nativeFetch) {
    Object.defineProperty(globalThis, 'fetch', {
      value: nativeFetch,
      writable: true,
      configurable: true,
      enumerable: true
    });
  }
} catch (e) {
  console.warn('Unable to patch globalThis.fetch for writeability', e);
}

import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Register service worker for PWA support
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js')
      .then(registration => {
        console.log('✅ Service Worker registered:', registration);
      })
      .catch(err => {
        console.warn('❌ Service Worker registration failed:', err);
      });
  });
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
