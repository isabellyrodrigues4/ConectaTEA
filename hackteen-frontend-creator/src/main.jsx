import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';
import { AuthProvider } from './contexts/AuthContext';
import { UIProvider } from './contexts/UIContext';

// start MSW in dev
if (import.meta.env.DEV) {
  // import worker dynamically
  import('./mocks/browser').then(({ worker }) => {
    // worker.start() is called inside browser.js
  });
}

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <UIProvider>
      <AuthProvider>
        <App />
      </AuthProvider>
    </UIProvider>
  </React.StrictMode>
);
