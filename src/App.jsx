import React, { useState, useEffect } from 'react';
import SplashScreen from './components/SplashScreen';
import Home from './components/Home';

export default function App() {
  const [showSplash, setShowSplash] = useState(true);

  const handleSplashFinish = () => {
    setShowSplash(false);
  };

  const handleResetSplash = () => {
    setShowSplash(true);
  };

  return (
    <div className="min-h-screen bg-white text-gray-900 selection:bg-black selection:text-white">
      {showSplash ? (
        <SplashScreen onFinish={handleSplashFinish} />
      ) : (
        <Home onResetSplash={handleResetSplash} />
      )}
    </div>
  );
}
