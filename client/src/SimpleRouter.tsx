import { useState } from 'react';
import HomePage from './HomePage';
import QuickFix from './QuickFix';

export default function SimpleRouter() {
  const [currentPage, setCurrentPage] = useState(() => {
    const path = window.location.pathname;
    if (path === '/quiz' || path === '/entrepreneurial-dna-quiz') return 'quiz';
    return 'home';
  });

  // Update URL when page changes
  const navigateTo = (page: string) => {
    setCurrentPage(page);
    const url = page === 'quiz' ? '/quiz' : '/';
    window.history.pushState({}, '', url);
  };

  // Listen for browser back/forward buttons
  window.onpopstate = () => {
    const path = window.location.pathname;
    if (path === '/quiz' || path === '/entrepreneurial-dna-quiz') {
      setCurrentPage('quiz');
    } else {
      setCurrentPage('home');
    }
  };

  if (currentPage === 'quiz') {
    return <QuickFix />;
  }

  return <HomePage />;
}