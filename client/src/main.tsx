import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// Override console methods to filter WebSocket errors
const originalError = console.error;
console.error = (...args) => {
  const message = args.join(' ');
  if (message.includes('WebSocket') || 
      message.includes('wss://localhost:undefined') ||
      message.includes('Failed to construct')) {
    return;
  }
  originalError.apply(console, args);
};

// Global error handlers for cleaner console
window.addEventListener('unhandledrejection', (event) => {
  // Comprehensive WebSocket and HMR error suppression
  const reason = event.reason;
  const message = reason?.message || '';
  const stack = reason?.stack || '';
  
  if (reason?.name === 'DOMException' || 
      message.includes('WebSocket') ||
      message.includes('wss://') ||
      message.includes('ws://') ||
      message.includes('localhost:undefined') ||
      message.includes('Failed to construct') ||
      message.includes('HMR') ||
      message.includes('hot reload') ||
      stack.includes('WebSocket') ||
      stack.includes('vite')) {
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
