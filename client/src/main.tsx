import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

if (import.meta.env.DEV) {
  const OriginalWebSocket = window.WebSocket;

  const DummyWebSocket = function() {
    return {
      close: () => {},
      send: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
    } as unknown as WebSocket;
  };

  window.WebSocket = function (url, ...args) {
    try {
      if (typeof url === 'string' && (url.includes("localhost:undefined") || url.includes(":undefined"))) {
        // Optional: comment this line to suppress message
        // console.warn("Intercepted invalid WebSocket URL:", url);
        return new DummyWebSocket();
      }
      return new OriginalWebSocket(url, ...args);
    } catch (err) {
      console.warn('Suppressed WebSocket error:', err);
      return new DummyWebSocket();
    }
  } as unknown as typeof WebSocket;
}

createRoot(document.getElementById("root")!).render(<App />);