import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

if (import.meta.env.DEV) {
  const OriginalWebSocket = window.WebSocket;

  window.WebSocket = function (url, ...args) {
    try {
      if (typeof url === 'string' && url.includes('localhost:undefined')) {
        console.warn('Intercepted invalid WebSocket URL:', url);
        return {
          close: () => {},
          send: () => {},
          addEventListener: () => {},
          removeEventListener: () => {},
        } as unknown as WebSocket;
      }
      return new OriginalWebSocket(url, ...args);
    } catch (err) {
      console.warn('Suppressed WebSocket error:', err);
      return {
        close: () => {},
        send: () => {},
        addEventListener: () => {},
        removeEventListener: () => {},
      } as unknown as WebSocket;
    }
  } as unknown as typeof WebSocket;
}

createRoot(document.getElementById("root")!).render(<App />);