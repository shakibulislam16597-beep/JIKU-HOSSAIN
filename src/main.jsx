import React from 'react';
import ReactDOM from 'react-dom/client';
import '@fontsource-variable/bricolage-grotesque';
import '@fontsource-variable/instrument-sans';
import '@fontsource-variable/anek-bangla';
import App from './App';
import ErrorBoundary from './components/ErrorBoundary';
import './index.css';

// Unregister any existing service workers and clear caches on startup to prevent old cached versions from serving a blank page
if (typeof window !== 'undefined') {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker
      .getRegistrations()
      .then((registrations) => {
        for (const registration of registrations) {
          registration.unregister().catch((err) => {
            console.warn('Failed to unregister service worker:', err);
          });
        }
      })
      .catch((err) => {
        console.warn('Error fetching service worker registrations:', err);
      });
  }

  if ('caches' in window) {
    caches
      .keys()
      .then((names) => {
        for (const name of names) {
          caches.delete(name).catch((err) => {
            console.warn('Failed to delete cache:', err);
          });
        }
      })
      .catch((err) => {
        console.warn('Error fetching cache keys:', err);
      });
  }
}

function escapeHtml(str) {
  return String(str ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function renderFatalError(reason) {
  const rootEl = document.getElementById('root');
  if (rootEl) {
    const message =
      reason?.message ||
      (typeof reason === 'string' ? reason : null) ||
      reason?.reason?.message ||
      JSON.stringify(reason) ||
      'An unexpected runtime error occurred.';

    const stack = reason?.stack || reason?.reason?.stack || '';

    rootEl.innerHTML = `
      <div style="min-height: 100vh; background-color: #F7F8FC; color: #0E1330; font-family: system-ui, -apple-system, sans-serif; display: flex; align-items: center; justify-content: center; padding: 20px;">
        <div style="background-color: #FFFFFF; border: 2px solid #0E1330; border-radius: 24px; box-shadow: 6px 6px 0px #0E1330; max-width: 600px; width: 100%; padding: 24px; box-sizing: border-box;">
          <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 16px; border-bottom: 2px solid #0E1330; padding-bottom: 12px;">
            <div style="width: 40px; height: 40px; background-color: #FFC933; border: 2px solid #0E1330; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-weight: 900; font-size: 20px;">!</div>
            <div>
              <h1 style="font-size: 18px; font-weight: 800; margin: 0; color: #0E1330;">Application Error</h1>
              <p style="font-size: 12px; color: #5B6079; margin: 2px 0 0 0;">Extrovat Lifestyle Startup Exception</p>
            </div>
          </div>
          <div style="background-color: #F7F8FC; border: 2px solid #0E1330; border-radius: 12px; padding: 12px; margin-bottom: 16px;">
            <p style="font-size: 12px; font-weight: 700; margin: 0 0 6px 0; color: #0E1330;">Error Message:</p>
            <pre style="margin: 0 0 10px 0; font-family: monospace; font-size: 12px; color: #DC2626; white-space: pre-wrap; word-break: break-word; background-color: #FEF2F2; padding: 8px; border-radius: 8px; border: 1px solid #FCA5A5; max-height: 150px; overflow-y: auto;">${escapeHtml(message)}</pre>
            ${
              stack
                ? `<p style="font-size: 12px; font-weight: 700; margin: 10px 0 6px 0; color: #0E1330;">Stack Trace:</p>
            <pre style="margin: 0; font-family: monospace; font-size: 10px; color: #4B5563; white-space: pre-wrap; word-break: break-word; background-color: #F3F4F6; padding: 8px; border-radius: 8px; border: 1px solid #D1D5DB; max-height: 180px; overflow-y: auto;">${escapeHtml(stack)}</pre>`
                : ''
            }
          </div>
          <div style="display: flex; gap: 10px;">
            <button onclick="window.location.reload()" style="flex: 1; background-color: #2436F5; color: #FFFFFF; border: 2px solid #0E1330; padding: 10px 16px; border-radius: 12px; font-weight: 800; font-size: 12px; cursor: pointer; box-shadow: 2px 2px 0px #0E1330;">Reload Page</button>
            <button onclick="window.location.hash='#/'; window.location.reload()" style="flex: 1; background-color: #FFC933; color: #0E1330; border: 2px solid #0E1330; padding: 10px 16px; border-radius: 12px; font-weight: 800; font-size: 12px; cursor: pointer; box-shadow: 2px 2px 0px #0E1330;">Go to Home</button>
          </div>
        </div>
      </div>
    `;
  }
}

// Global window unhandled error and rejection listeners
window.addEventListener('error', (event) => {
  console.error('Window uncaught error:', event.error || event.message);
  renderFatalError(event.error || event.message);
});

window.addEventListener('unhandledrejection', (event) => {
  console.error('Unhandled promise rejection:', event.reason);
  renderFatalError(event.reason);
});

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>
);
