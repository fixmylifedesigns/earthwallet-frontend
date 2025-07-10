// WalletApp.js - Standalone wallet component with authentication
import React, { useState, useEffect } from "react";
import { Capacitor } from "@capacitor/core";
import { initializeApp } from "firebase/app";
import { Routes, Route, MemoryRouter } from "react-router-dom";
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithCredential,
} from "firebase/auth";
import { Wallet as WalletPage, DebitcardPage } from "./pages/index"; // Import your existing WalletPage

import { signInWithPopup } from "firebase/auth";

const WalletApp = () => {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [authMode, setAuthMode] = useState("login"); // 'login' or 'signup'
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [FirebaseAuthentication, setFirebaseAuthentication] = useState(null);

  const isMobile = Capacitor.isNativePlatform();

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

  // Get app configuration from environment
  const appConfig = {
    name: import.meta.env.VITE_APP_NAME || "EarthWallet",
    description:
      import.meta.env.VITE_APP_DESCRIPTION ||
      "Turn Recycling Into Real Rewards",
    supportEmail:
      import.meta.env.VITE_SUPPORT_EMAIL || "contact@duranirving.com",
    supportPhone: import.meta.env.VITE_SUPPORT_PHONE || "1-800-RECYCLE",
  };

  // Load Capacitor Firebase plugin on native platforms
  useEffect(() => {
    const loadFirebasePlugin = async () => {
      if (Capacitor.isNativePlatform()) {
        try {
          const plugin = await import("@capacitor-firebase/authentication");
          setFirebaseAuthentication(plugin.FirebaseAuthentication);
          console.log("Capacitor Firebase plugin loaded successfully");
        } catch (error) {
          console.warn("Capacitor Firebase plugin not available:", error);
        }
      }
    };

    loadFirebasePlugin();
  }, []);

  // Debug platform info
  useEffect(() => {
    console.log("Wallet App Platform Info:", {
      isNative: Capacitor.isNativePlatform(),
      platform: Capacitor.getPlatform(),
      hasFirebasePlugin: !!FirebaseAuthentication,
      hasPopup: !Capacitor.isNativePlatform(),
    });
  }, [FirebaseAuthentication]);

  // Listen for authentication state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      console.log(
        "Auth state changed:",
        user ? "User signed in" : "User signed out"
      );
      setUser(user);
      setAuthLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // Email/Password Authentication
  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Basic validation
    if (!email || !password) {
      setError("Please enter both email and password.");
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      setLoading(false);
      return;
    }

    try {
      if (authMode === "login") {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
      }
      setEmail("");
      setPassword("");
    } catch (error) {
      console.error("Auth error:", error);

      let errorMessage = "An error occurred during authentication.";

      switch (error.code) {
        case "auth/user-not-found":
          errorMessage = "No account found with this email address.";
          break;
        case "auth/wrong-password":
          errorMessage = "Incorrect password.";
          break;
        case "auth/email-already-in-use":
          errorMessage = "An account with this email already exists.";
          break;
        case "auth/weak-password":
          errorMessage = "Password should be at least 6 characters.";
          break;
        case "auth/invalid-email":
          errorMessage = "Please enter a valid email address.";
          break;
        case "auth/too-many-requests":
          errorMessage = "Too many failed attempts. Please try again later.";
          break;
        case "auth/network-request-failed":
          errorMessage = "Network error. Please check your connection.";
          break;
        case "auth/invalid-credential":
          errorMessage = "Invalid email or password.";
          break;
        default:
          errorMessage = error.message || `Error: ${error.code}`;
      }

      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Google Sign-In
  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError("");

    try {
      if (Capacitor.isNativePlatform()) {
        // Native platform - try Capacitor Firebase plugin
        if (FirebaseAuthentication) {
          console.log("Attempting native Google sign-in...");

          try {
            const result = await FirebaseAuthentication.signInWithGoogle();
            console.log("Native sign-in successful:", result);

            if (result.credential?.idToken) {
              const credential = GoogleAuthProvider.credential(
                result.credential.idToken
              );
              await signInWithCredential(auth, credential);
            }
            return;
          } catch (nativeError) {
            console.error("Native Google sign-in failed:", nativeError);
            setError("Google Sign-In failed. Please try email/password login.");
            return;
          }
        } else {
          setError(
            "Google Sign-In plugin not available. Please try email/password login."
          );
          return;
        }
      } else {
        // Web platform - use popup
        if (signInWithPopup) {
          console.log("Using web popup sign-in...");
          const googleProvider = new GoogleAuthProvider();
          await signInWithPopup(auth, googleProvider);
        } else {
          setError("Google Sign-In not available in this environment.");
        }
      }
    } catch (error) {
      console.error("Google sign-in error:", error);

      let errorMessage = "Failed to sign in with Google.";

      if (error.code) {
        switch (error.code) {
          case "auth/popup-closed-by-user":
            errorMessage = "Sign-in was cancelled.";
            break;
          case "auth/popup-blocked":
            errorMessage =
              "Popup was blocked. Please allow popups and try again.";
            break;
          case "auth/network-request-failed":
            errorMessage = "Network error. Please check your connection.";
            break;
          case "auth/account-exists-with-different-credential":
            errorMessage =
              "An account already exists with this email using a different sign-in method.";
            break;
          default:
            errorMessage = error.message || `Sign-in error: ${error.code}`;
        }
      } else {
        errorMessage = error.message || "An unexpected error occurred.";
      }

      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Sign out
  const handleSignOut = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  // Show loading spinner while checking auth state
  if (authLoading) {
    return (
      <div
        className={`min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center ${
          isMobile ? "safe-area-top safe-area-bottom" : ""
        }`}
      >
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // User is authenticated - show wallet with navigation
  if (user) {
    return (
      <MemoryRouter>
        <div
          className={`min-h-screen bg-gradient-to-br from-green-50 to-blue-50 ${
            isMobile ? "safe-area-top safe-area-bottom" : ""
          }`}
        >
          {/* Simple navigation bar */}
          <nav className="bg-white shadow-lg">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between h-16">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <h1 className="text-2xl font-bold text-green-600">
                      🌍 {appConfig.name}
                    </h1>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  {/* <span className="text-gray-700 text-sm">
                    Welcome, {user.email}
                  </span> */}
                  <button
                    onClick={handleSignOut}
                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md text-sm font-medium"
                  >
                    Sign Out
                  </button>
                </div>
              </div>
            </div>
          </nav>

          {/* Your existing WalletPage component */}
          {/* <WalletPage user={user} /> */}
          <Routes>
            <Route path="/" element={<WalletPage user={user} />} />
            <Route path="/wallet" element={<WalletPage user={user} />} />
            <Route path="/debitcard" element={<DebitcardPage user={user} />} />
          </Routes>
        </div>
      </MemoryRouter>
    );
  }

  // User is not authenticated - show login screen
  return (
    <MemoryRouter>
      <div
        className={`min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4 ${
          isMobile ? "safe-area-top safe-area-bottom" : ""
        }`}
      >
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8">
          {/* Logo/Header */}
          <div className="text-center mb-8">
            <div className="text-4xl mb-4">🌍</div>
            <h1 className="text-3xl font-bold text-green-600 mb-2">
              {appConfig.name}
            </h1>
            <p className="text-gray-600">{appConfig.description}</p>
          </div>

          {/* Login Form */}
          <div className="space-y-4">
            {/* Google Sign In Button */}
            <button
              onClick={handleGoogleSignIn}
              disabled={loading}
              className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 rounded-xl shadow-sm bg-white text-lg font-medium text-gray-700 hover:bg-gray-50 disabled:bg-gray-100"
            >
              <svg className="w-6 h-6 mr-3" viewBox="0 0 24 24">
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
              {loading ? "Signing in..." : "Continue with Google"}
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

            {/* Email/Password Form */}
            <form onSubmit={handleAuth} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 text-lg focus:outline-none focus:ring-2 focus:ring-green-500"
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
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 text-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Enter your password"
                />
              </div>

              {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-xl">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-green-600 hover:bg-green-700 text-white py-3 px-4 rounded-xl font-medium text-lg disabled:bg-gray-400"
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    {authMode === "login"
                      ? "Signing In..."
                      : "Creating Account..."}
                  </span>
                ) : authMode === "login" ? (
                  "Sign In"
                ) : (
                  "Create Account"
                )}
              </button>
            </form>

            {/* Switch between login/signup */}
            <div className="text-center">
              <button
                onClick={() => {
                  setAuthMode(authMode === "login" ? "signup" : "login");
                  setError("");
                }}
                className="text-green-600 hover:text-green-700 text-lg font-medium"
              >
                {authMode === "login"
                  ? "Don't have an account? Sign up"
                  : "Already have an account? Sign in"}
              </button>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-8 text-center text-sm text-gray-500">
            <p>Support: {appConfig.supportEmail}</p>
          </div>
        </div>
      </div>
    </MemoryRouter>
  );
};

export default WalletApp;
