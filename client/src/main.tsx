if (import.meta.env.DEV) {
  const OriginalWebSocket = window.WebSocket;
  class DummyWebSocket {
    onopen = null;
    onmessage = null;
    onerror = null;
    onclose = null;
    close() {}
    send() {}
    addEventListener() {}
    removeEventListener() {}
    dispatchEvent() { return false; }
    readyState = 3;
  }

  window.WebSocket = function (url: string, protocols?: string | string[]) {
    if (typeof url === 'string' && (url.includes('localhost:undefined') || url.includes(':undefined'))) {
      return new DummyWebSocket();
    }
    try {
      return new OriginalWebSocket(url, protocols);
    } catch (err) {
      return new DummyWebSocket();
    }
  } as any;

  // Additional console filtering
  const originalConsoleLog = console.log;
  console.log = (...args) => {
    const message = args.join(' ');
    if (message.includes('[vite] connecting') || message.includes('[vite] connected')) {
      return;
    }
    originalConsoleLog.apply(console, args);
  };

  // Suppress unhandled rejection events related to WebSocket
  window.addEventListener('unhandledrejection', (event) => {
    const reason = event.reason;
    if (reason?.message?.includes('WebSocket') || 
        reason?.message?.includes('localhost:undefined') ||
        reason?.name === 'DOMException') {
      event.preventDefault();
    }
  });
}

import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

createRoot(document.getElementById("root")!).render(<App />);