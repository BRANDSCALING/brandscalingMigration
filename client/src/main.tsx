import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// Comprehensive Vite HMR and WebSocket error suppression
if (typeof window !== 'undefined') {
  // Override console methods to suppress Vite connection messages
  const originalLog = console.log;
  const originalError = console.error;
  const originalWarn = console.warn;

  console.log = (...args) => {
    const message = args.join(' ');
    if (message.includes('[vite] connecting') || 
        message.includes('[vite] connected') ||
        message.includes('vite:ws')) {
      return;
    }
    originalLog.apply(console, args);
  };

  console.error = (...args) => {
    const message = args.join(' ');
    if (message.includes('WebSocket') || 
        message.includes('wss://localhost:undefined') ||
        message.includes('Failed to construct') ||
        message.includes('DOMException') ||
        message.includes('vite:ws')) {
      return;
    }
    originalError.apply(console, args);
  };

  console.warn = (...args) => {
    const message = args.join(' ');
    if (message.includes('WebSocket') || 
        message.includes('vite:ws') ||
        message.includes('HMR')) {
      return;
    }
    originalWarn.apply(console, args);
  };

  // Suppress WebSocket construction errors at the global level
  window.addEventListener('unhandledrejection', (event) => {
    try {
      const reason = event.reason;
      const message = reason?.message || '';
      const stack = reason?.stack || '';
      
      // Comprehensive Vite/WebSocket error filtering
      if (reason?.name === 'DOMException' && 
          (message.includes('WebSocket') ||
           message.includes('wss://') ||
           message.includes('ws://') ||
           message.includes('localhost:undefined') ||
           message.includes('Failed to construct') ||
           stack.includes('WebSocket') ||
           stack.includes('vite'))) {
        event.preventDefault();
        return;
      }

      // Suppress navigation-related errors
      if (reason?.name === 'DOMException' && 
          (message.includes('navigate') || message.includes('location'))) {
        event.preventDefault();
        return;
      }

      // Suppress media errors from browser/extensions
      if (reason?.name === 'DOMException' && 
          (message.includes('play()') || message.includes('interrupted'))) {
        event.preventDefault();
        return;
      }

      // Suppress browser extension errors
      if (message.includes('Non-Error promise rejection') ||
          message.includes('Script error') ||
          stack.includes('extension://')) {
        event.preventDefault();
        return;
      }
    } catch (suppressionError) {
      // Silently handle any errors in error suppression
    }
  });

  window.addEventListener('error', (event) => {
    try {
      if (event.message?.includes('WebSocket') ||
          event.message?.includes('vite') ||
          event.message?.includes('Non-Error promise rejection')) {
        event.preventDefault();
        return;
      }
    } catch (suppressionError) {
      // Silently handle any errors in error suppression
    }
  });
}

createRoot(document.getElementById("root")!).render(<App />);
