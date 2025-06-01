import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// Development-only WebSocket error suppression for Vite HMR
if (typeof window !== 'undefined' && import.meta.env.DEV) {
  const OriginalWebSocket = window.WebSocket;
  
  window.WebSocket = function(url: string | URL, protocols?: string | string[]) {
    try {
      const urlString = url.toString();
      
      // Check for invalid URLs with undefined ports
      if (urlString.includes('localhost:undefined') || 
          urlString.includes(':undefined') ||
          urlString.includes('wss://localhost:undefined')) {
        
        // Return a dummy WebSocket object that does nothing
        return {
          close: () => {},
          send: () => {},
          addEventListener: () => {},
          removeEventListener: () => {},
          dispatchEvent: () => false,
          readyState: 3, // CLOSED
          url: urlString,
          protocol: '',
          extensions: '',
          bufferedAmount: 0,
          binaryType: 'blob' as BinaryType,
          onopen: null,
          onclose: null,
          onerror: null,
          onmessage: null,
          CONNECTING: 0,
          OPEN: 1,
          CLOSING: 2,
          CLOSED: 3
        } as WebSocket;
      }
      
      // For valid URLs, create normal WebSocket
      return new OriginalWebSocket(url, protocols);
    } catch (error) {
      // If any error occurs during construction, return dummy object
      return {
        close: () => {},
        send: () => {},
        addEventListener: () => {},
        removeEventListener: () => {},
        dispatchEvent: () => false,
        readyState: 3, // CLOSED
        url: url.toString(),
        protocol: '',
        extensions: '',
        bufferedAmount: 0,
        binaryType: 'blob' as BinaryType,
        onopen: null,
        onclose: null,
        onerror: null,
        onmessage: null,
        CONNECTING: 0,
        OPEN: 1,
        CLOSING: 2,
        CLOSED: 3
      } as WebSocket;
    }
  } as any;

  // Suppress console messages from Vite
  const originalConsoleLog = console.log;
  const originalConsoleError = console.error;

  console.log = (...args) => {
    const message = args.join(' ');
    if (message.includes('[vite] connecting') || 
        message.includes('[vite] connected')) {
      return;
    }
    originalConsoleLog.apply(console, args);
  };

  console.error = (...args) => {
    const message = args.join(' ');
    if (message.includes('WebSocket') || 
        message.includes('wss://localhost:undefined') ||
        message.includes('Failed to construct') ||
        message.includes('DOMException')) {
      return;
    }
    originalConsoleError.apply(console, args);
  };

  // Global error suppression
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
    } catch (suppressionError) {
      // Silently handle any errors in error suppression
    }
  });
}

createRoot(document.getElementById("root")!).render(<App />);