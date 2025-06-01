// vite-websocket-override.js
;(function () {
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

  window.WebSocket = function (url, protocols) {
    if (typeof url === 'string' && (url.includes('localhost:undefined') || url.includes(':undefined'))) {
      console.warn('Intercepted invalid WebSocket URL:', url);
      return new DummyWebSocket();
    }
    try {
      return new OriginalWebSocket(url, protocols);
    } catch (err) {
      return new DummyWebSocket();
    }
  };
})();