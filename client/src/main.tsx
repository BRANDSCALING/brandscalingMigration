import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// Global error handlers for cleaner console
window.addEventListener('unhandledrejection', (event) => {
  // Suppress media play() interruption errors from browser/extensions
  if (event.reason?.name === 'DOMException' && 
      event.reason?.message?.includes('play()')) {
    event.preventDefault();
    return;
  }
  
  // Log other unhandled promise rejections
  console.warn('Unhandled promise rejection:', event.reason);
});

window.addEventListener('error', (event) => {
  // Suppress common browser extension errors
  if (event.message?.includes('Non-Error promise rejection')) {
    event.preventDefault();
    return;
  }
});

createRoot(document.getElementById("root")!).render(<App />);
