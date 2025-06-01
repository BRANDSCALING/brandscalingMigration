import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// Development-only WebSocket error suppression
if (typeof window !== 'undefined' && import.meta.env.DEV) {
  // Override console methods to suppress Vite connection messages
  const originalLog = console.log;
  const originalError = console.error;

  console.log = (...args) => {
    const message = args.join(' ');
    if (message.includes('[vite] connecting') || 
        message.includes('[vite] connected')) {
      return;
    }
    originalLog.apply(console, args);
  };

  console.error = (...args) => {
    const message = args.join(' ');
    if (message.includes('WebSocket') || 
        message.includes('wss://localhost:undefined') ||
        message.includes('Failed to construct') ||
        message.includes('DOMException')) {
      return;
    }
    originalError.apply(console, args);
  };

  // Suppress WebSocket errors at the global level
  window.addEventListener('unhandledrejection', (event) => {
    try {
      const reason = event.reason;
      const message = reason?.message || '';
      
      if (reason?.name === 'DOMException' && 
          (message.includes('WebSocket') ||
           message.includes('localhost:undefined') ||
           message.includes('Failed to construct'))) {
        event.preventDefault();
        return;
      }

      // Suppress navigation-related errors
      if (reason?.name === 'DOMException' && 
          (message.includes('navigate') || message.includes('location'))) {
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