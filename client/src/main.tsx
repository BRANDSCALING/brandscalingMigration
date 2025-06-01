import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// Global error handlers for cleaner console
window.addEventListener('unhandledrejection', (event) => {
  // Suppress WebSocket connection errors from Vite HMR
  if (event.reason?.name === 'DOMException' && 
      (event.reason?.message?.includes('WebSocket') ||
       event.reason?.message?.includes('wss://localhost:undefined') ||
       event.reason?.message?.includes('Failed to construct'))) {
    event.preventDefault();
    return;
  }
  
  // Suppress navigation-related DOMExceptions
  if (event.reason?.name === 'DOMException' || 
      event.reason?.message?.includes('navigate') ||
      event.reason?.message?.includes('location')) {
    event.preventDefault();
    return;
  }
  
  // Suppress media play() interruption errors from browser/extensions
  if (event.reason?.name === 'DOMException' && 
      (event.reason?.message?.includes('play()') || 
       event.reason?.message?.includes('interrupted') ||
       event.reason?.message?.includes('pause()'))) {
    event.preventDefault();
    return;
  }
  
  // Suppress other common browser/extension errors
  if (event.reason?.message?.includes('Non-Error promise rejection') ||
      event.reason?.message?.includes('Script error') ||
      event.reason?.stack?.includes('extension://')) {
    event.preventDefault();
    return;
  }
  
  // Log remaining unhandled rejections with full details
  console.warn('Unhandled promise rejection:', {
    type: event.reason?.constructor?.name,
    message: event.reason?.message,
    stack: event.reason?.stack,
    full: event.reason
  });
});

window.addEventListener('error', (event) => {
  // Suppress common browser extension errors
  if (event.message?.includes('Non-Error promise rejection')) {
    event.preventDefault();
    return;
  }
});

createRoot(document.getElementById("root")!).render(<App />);
