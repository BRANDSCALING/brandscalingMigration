import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

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
}

createRoot(document.getElementById("root")!).render(<App />);