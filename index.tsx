import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
// @ts-ignore — JSX class component, TS config doesn't support class fields
import { ErrorBoundary } from './ErrorBoundary.jsx';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>
);
