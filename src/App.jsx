import React, { useState, useEffect } from 'react';
import SplashScreen from './components/SplashScreen';
import Home from './components/Home';

export default function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Sync dark mode class on html root element
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const handleSplashFinish = () => {
    setShowSplash(false);
  };

  const handleResetSplash = () => {
    setShowSplash(true);
  };

  const handleToggleDarkMode = () => {
    setIsDarkMode((prev) => !prev);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-200">
      {showSplash ? (
        <SplashScreen onFinish={handleSplashFinish} />
      ) : (
        <Home
          isDarkMode={isDarkMode}
          onToggleDarkMode={handleToggleDarkMode}
          onResetSplash={handleResetSplash}
        />
      )}
    </div>
  );
}
