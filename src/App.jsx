import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import { initializeApp } from "firebase/app";
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";

import {
  LandingPage,
  Wallet,
  KioskDashboard as Kiosk,
  EarthWalletProjectPage,
  DebitcardPage,
} from "./pages/index";
import "./index.css";
import ApiTestDashboard from "./pages/ApiTestDashboard";

// Firebase configuration from environment variables
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

// Get product mode from environment or window API
const getProductMode = () => {
  // Check if we're in electron
  if (typeof window !== 'undefined' && window.electronAPI) {
    return window.electronAPI.getProductMode();
  }
  // Check Vite environment variable
  return import.meta.env.VITE_PRODUCT_MODE || 'web';
};

// Get app configuration from environment
const appConfig = {
  name: import.meta.env.VITE_APP_NAME || 'EarthWallet',
  description: import.meta.env.VITE_APP_DESCRIPTION || 'Turn Recycling Into Real Rewards',
  supportEmail: import.meta.env.VITE_SUPPORT_EMAIL || 'contact@duranirving.com',
  supportPhone: import.meta.env.VITE_SUPPORT_PHONE || '1-800-RECYCLE',
};

const App = () => {
  const [user, setUser] = useState(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  // Get the current product mode
  const productMode = getProductMode();
  console.log('Current product mode:', productMode);

  // Listen for authentication state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });
    return () => unsubscribe();
  }, []);

  // Authentication handlers
  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      if (authMode === "login") {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
      }
      setShowAuthModal(false);
      setEmail("");
      setPassword("");
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError("");

    try {
      await signInWithPopup(auth, googleProvider);
      setShowAuthModal(false);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const openAuthModal = (mode) => {
    setAuthMode(mode);
    setShowAuthModal(true);
    setError("");
  };

  // Render different app structures based on product mode
  const renderApp = () => {
    switch (productMode) {
      case 'kiosk':
        // Kiosk mode - only render the kiosk dashboard, no navigation
        return (
          <div className="w-full h-screen">
            <Kiosk />
          </div>
        );

      case 'wallet':
        // Wallet mode - minimal navigation, focused on wallet functionality
        return (
          <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 w-full">
            {/* Minimal Navigation for Wallet App */}
            <nav className="bg-white shadow-lg">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <h1 className="text-2xl font-bold text-green-600">
                        {appConfig.name}
                      </h1>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    {user ? (
                      <div className="flex items-center space-x-4">
                        <span className="text-gray-700">Welcome, {user.email}</span>
                        <button
                          onClick={handleSignOut}
                          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md text-sm font-medium"
                        >
                          Sign Out
                        </button>
                      </div>
                    ) : (
                      <>
                        <button
                          onClick={() => openAuthModal("login")}
                          className="text-green-600 hover:text-green-700 px-3 py-2 rounded-md text-sm font-medium"
                        >
                          Log In
                        </button>
                        <button
                          onClick={() => openAuthModal("signup")}
                          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm font-medium"
                        >
                          Sign Up
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </nav>

            <Router>
              <Routes>
                <Route path="/" element={<Wallet user={user} />} />
                <Route path="/wallet" element={<Wallet user={user} />} />
              </Routes>
            </Router>

            {/* Auth Modal */}
            {showAuthModal && renderAuthModal()}
          </div>
        );

      default:
        // Web mode - full navigation and all routes
        return (
          <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 w-full">
            {/* Full Navigation */}
            <nav className="bg-white shadow-lg">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <h1 className="text-2xl font-bold text-green-600">
                        {appConfig.name}
                      </h1>
                    </div>
                    <div className="hidden md:block">
                      <div className="ml-10 flex items-baseline space-x-4">
                        <a
                          href="#features"
                          className="text-gray-600 hover:text-green-600 px-3 py-2 rounded-md text-sm font-medium"
                        >
                          Features
                        </a>
                        <a
                          href="#how-it-works"
                          className="text-gray-600 hover:text-green-600 px-3 py-2 rounded-md text-sm font-medium"
                        >
                          How It Works
                        </a>
                        <a
                          href="#contact"
                          className="text-gray-600 hover:text-green-600 px-3 py-2 rounded-md text-sm font-medium"
                        >
                          Contact
                        </a>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    {user ? (
                      <div className="flex items-center space-x-4">
                        <span className="text-gray-700">Welcome, {user.email}</span>
                        <button
                          onClick={handleSignOut}
                          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md text-sm font-medium"
                        >
                          Sign Out
                        </button>
                      </div>
                    ) : (
                      <>
                        <button
                          onClick={() => openAuthModal("login")}
                          className="text-green-600 hover:text-green-700 px-3 py-2 rounded-md text-sm font-medium"
                        >
                          Log In
                        </button>
                        <button
                          onClick={() => openAuthModal("signup")}
                          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm font-medium"
                        >
                          Sign Up
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </nav>

            <Router>
              <Routes>
                <Route
                  path="/"
                  element={<LandingPage openAuthModal={openAuthModal} user={user} appConfig={appConfig} />}
                />
                <Route path="/kiosk" element={<Kiosk />} />
                <Route path="/test" element={<ApiTestDashboard user={user} />} />
                <Route path="/wallet" element={<Wallet user={user} />} />
                <Route path="/project-page" element={<EarthWalletProjectPage />} />
                <Route path="/debitcard" element={<DebitcardPage user={user}/>} />

              </Routes>
            </Router>

            {/* Auth Modal */}
            {showAuthModal && renderAuthModal()}
          </div>
        );
    }
  };

  const renderAuthModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-900">
            {authMode === "login" ? "Sign In" : "Create Account"}
          </h2>
          <button
            onClick={() => setShowAuthModal(false)}
            className="text-gray-400 hover:text-gray-600"
          >
            ✕
          </button>
        </div>

        <div className="space-y-4">
          {/* Google Sign In Button */}
          <button
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:bg-gray-100"
          >
            <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            {loading ? "Signing in..." : `Continue with Google`}
          </button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">
                Or continue with email
              </span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="your@email.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Enter your password"
            />
          </div>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          <button
            onClick={handleAuth}
            disabled={loading}
            className="w-full bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-md font-medium disabled:bg-gray-400"
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                {authMode === "login" ? "Signing In..." : "Creating Account..."}
              </span>
            ) : authMode === "login" ? (
              "Sign In"
            ) : (
              "Create Account"
            )}
          </button>
        </div>

        <div className="mt-4 text-center">
          <button
            onClick={() =>
              setAuthMode(authMode === "login" ? "signup" : "login")
            }
            className="text-green-600 hover:text-green-700 text-sm"
          >
            {authMode === "login"
              ? "Don't have an account? Sign up"
              : "Already have an account? Sign in"}
          </button>
        </div>
      </div>
    </div>
  );

  return renderApp();
};

export default App;