
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

try {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
} catch (error) {
  console.error("Mounting Error:", error);
  rootElement.innerHTML = `
    <div style="padding: 2rem; color: #b91c1c; font-family: sans-serif; text-align: center;">
      <h1 font-weight: 900;>System Error</h1>
      <p>We encountered a problem starting the application.</p>
      <pre style="text-align: left; background: #fee2e2; padding: 1rem; border-radius: 1rem; margin-top: 1rem; font-size: 0.8rem; overflow: auto;">
        ${error instanceof Error ? error.stack || error.message : String(error)}
      </pre>
      <button onclick="location.reload()" style="margin-top: 1rem; padding: 0.5rem 1rem; background: #b91c1c; color: white; border: none; border-radius: 0.5rem; cursor: pointer;">
        Retry Loading
      </button>
    </div>
  `;
}
