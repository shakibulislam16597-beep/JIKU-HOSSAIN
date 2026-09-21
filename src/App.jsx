import React, { useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from './lib/firebase';

import SplashScreen from './components/SplashScreen';
import Home from './components/Home';
import AdminLogin from './admin/AdminLogin';
import AdminLayout from './admin/AdminLayout';

export default function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [currentHash, setCurrentHash] = useState(window.location.hash || '#/');
  const [user, setUser] = useState(null);
  const [isAdminActive, setIsAdminActive] = useState(false);
  const [authChecking, setAuthChecking] = useState(true);

  // Hash listener for HashRouter navigation
  useEffect(() => {
    const handleHashChange = () => {
      setCurrentHash(window.location.hash || '#/');
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Firebase auth state listener + admins/{uid} check with full error catch resilience
  useEffect(() => {
    if (!auth || !db) {
      setUser(null);
      setIsAdminActive(false);
      setAuthChecking(false);
      return;
    }

    let unsubscribe = () => {};
    try {
      unsubscribe = onAuthStateChanged(
        auth,
        async (currentUser) => {
          setUser(currentUser);
          if (currentUser) {
            try {
              const adminDocRef = doc(db, 'admins', currentUser.uid);
              const adminDocSnap = await getDoc(adminDocRef);
              if (adminDocSnap.exists() && adminDocSnap.data()?.active === true) {
                setIsAdminActive(true);
              } else {
                setIsAdminActive(false);
              }
            } catch (e) {
              console.warn('Error verifying admin status:', e);
              setIsAdminActive(false);
            }
          } else {
            setIsAdminActive(false);
          }
          setAuthChecking(false);
        },
        (error) => {
          console.warn('Auth state listener error:', error);
          setUser(null);
          setIsAdminActive(false);
          setAuthChecking(false);
        }
      );
    } catch (err) {
      console.warn('Firebase Auth initialization error:', err);
      setUser(null);
      setIsAdminActive(false);
      setAuthChecking(false);
    }

    return () => {
      if (typeof unsubscribe === 'function') {
        unsubscribe();
      }
    };
  }, []);

  const handleSplashFinish = () => {
    setShowSplash(false);
  };

  const handleResetSplash = () => {
    setShowSplash(true);
  };

  // Determine if navigating to admin route
  const isAdminRoute = currentHash.startsWith('#/admin');

  if (isAdminRoute) {
    if (currentHash === '#/admin/login') {
      return <AdminLogin />;
    }

    // Protected Admin Routes
    if (authChecking) {
      return (
        <div className="min-h-screen bg-[#F7F8FC] flex items-center justify-center font-sans text-[#0E1330]">
          <div className="text-center space-y-2">
            <div className="w-8 h-8 border-4 border-[#2436F5] border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-xs font-heading font-bold text-[#5B6079]">Authenticating admin...</p>
          </div>
        </div>
      );
    }

    if (!user || !isAdminActive) {
      // Redirect to login if unauthenticated or not an active admin
      window.location.hash = '#/admin/login';
      return <AdminLogin />;
    }

    return <AdminLayout currentHash={currentHash} user={user} />;
  }

  // Storefront view
  return (
    <div className="min-h-screen bg-white text-gray-900 selection:bg-black selection:text-white font-sans">
      {showSplash ? (
        <SplashScreen onFinish={handleSplashFinish} />
      ) : (
        <Home onResetSplash={handleResetSplash} isAdmin={user && isAdminActive} />
      )}
    </div>
  );
}
