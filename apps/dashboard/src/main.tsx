/**
 * @file apps/dashboard/src/main.tsx
 * @description Application client bootstrapping script for the TARCMS Management Dashboard.
 * Mounts the React component tree into the DOM root.
 */

import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { App } from './App';
import './styles/globals.css';

const rootElement = document.getElementById('root');

if (rootElement) {
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </React.StrictMode>
  );
}
