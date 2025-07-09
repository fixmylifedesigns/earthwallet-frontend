import React, { useState } from "react";
import { Link } from "react-router-dom";

const DebitCardPage = ({ user, openAuthModal }) => {
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [orderProcessing, setOrderProcessing] = useState(false);

  // Handle card order
  const handleOrderCard = async () => {
    setOrderProcessing(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setOrderProcessing(false);
    setShowOrderModal(true);
  };

  // Card visual component
  const CardVisual = ({ className = "" }) => (
    <div className={`relative w-80 h-48 mx-auto ${className}`}>
      {/* Card */}
      <div className="absolute inset-0 bg-gradient-to-br from-green-400 via-green-500 to-green-600 rounded-2xl shadow-2xl transform hover:scale-105 transition-transform duration-300">
        <div className="p-6 h-full flex flex-col justify-between text-white">
          {/* Top section */}
          <div className="flex justify-between items-start">
            <div>
              <div className="text-xs opacity-80">EarthWallet</div>
              <div className="text-lg font-bold">Debit Card</div>
            </div>
            <div className="text-2xl">♻️</div>
          </div>
          
          {/* Middle section */}
          <div className="space-y-2">
            <div className="font-mono text-lg tracking-wider">
              •••• •••• •••• ••••
            </div>
            <div className="flex justify-between text-sm">
              <div>
                <div className="text-xs opacity-80">VALID THRU</div>
                <div className="font-mono">••/••</div>
              </div>
              <div>
                <div className="text-xs opacity-80">CVV</div>
                <div className="font-mono">•••</div>
              </div>
            </div>
          </div>
          
          {/* Bottom section */}
          <div>
            <div className="font-semibold text-sm">
              YOUR NAME HERE
            </div>
          </div>
        </div>
      </div>
      
      {/* Chip */}
      <div className="absolute top-16 left-8 w-8 h-6 bg-yellow-400 rounded opacity-90"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-center lg:text-left">
              <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
                Turn Your 
                <span className="text-green-600 block">Rewards Into</span>
                <span className="text-blue-600">Real Money</span>
              </h1>
              <p className="text-xl text-gray-600 mb-8 max-w-2xl">
                Get instant access to your recycling rewards with the EarthWallet Debit Card. 
                No waiting, no transfers - just tap and spend your environmental impact.
              </p>
              
              {user ? (
                <div className="space-y-4">
                  <button
                    onClick={handleOrderCard}
                    disabled={orderProcessing}
                    className="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white text-xl font-bold px-8 py-4 rounded-2xl shadow-xl transform hover:scale-105 active:scale-95 transition-all duration-200"
                  >
                    {orderProcessing ? (
                      <span className="flex items-center">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mr-3"></div>
                        Processing Order...
                      </span>
                    ) : (
                      "Order Your Card Now"
                    )}
                  </button>
                  <p className="text-sm text-gray-500">
                    Free shipping • No monthly fees • Instant activation
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  <button
                    onClick={() => openAuthModal("signup")}
                    className="bg-green-600 hover:bg-green-700 text-white text-xl font-bold px-8 py-4 rounded-2xl shadow-xl transform hover:scale-105 active:scale-95 transition-all duration-200"
                  >
                    Sign Up to Apply
                  </button>
                  <p className="text-sm text-gray-500">
                    Already have an account? 
                    <button 
                      onClick={() => openAuthModal("login")}
                      className="text-green-600 hover:text-green-700 font-medium ml-1"
                    >
                      Sign in here
                    </button>
                  </p>
                </div>
              )}
            </div>
            
            <div className="flex justify-center lg:justify-end">
              <CardVisual />
            </div>
          </div>
        </div>
        
        {/* Decorative elements - behind content */}
  <div className="absolute top-0 right-0 -mt-4 -mr-4 w-72 h-72 bg-green-200 rounded-full opacity-20 animate-pulse z-0"></div>
  <div className="absolute bottom-0 left-0 -mb-4 -ml-4 w-96 h-96 bg-blue-200 rounded-full opacity-20 animate-pulse z-0"></div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose EarthWallet Card?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              The smartest way to access and spend your recycling rewards
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6 rounded-2xl bg-gradient-to-br from-green-50 to-green-100 border border-green-200">
              <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl text-white">⚡</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Instant Access
              </h3>
              <p className="text-gray-600">
                Use your recycling rewards immediately. No waiting for transfers or processing delays.
              </p>
            </div>

            <div className="text-center p-6 rounded-2xl bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200">
              <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl text-white">🚫</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Zero Fees
              </h3>
              <p className="text-gray-600">
                No monthly fees, no minimum balance requirements, no hidden charges. Keep more of what you earn.
              </p>
            </div>

            <div className="text-center p-6 rounded-2xl bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200">
              <div className="w-16 h-16 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl text-white">🌍</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Eco-Friendly
              </h3>
              <p className="text-gray-600">
                Made from 85% recycled materials. Your card reflects your commitment to the environment.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-600">
              From recycling to spending in three simple steps
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center relative">
              <div className="w-16 h-16 bg-green-600 text-white rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-bold">
                1
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Recycle & Earn
              </h3>
              <p className="text-gray-600">
                Deposit bottles and cans at EarthWallet kiosks to earn rewards instantly in your digital wallet.
              </p>
              
              {/* Connector arrow */}
              <div className="hidden md:block absolute top-8 -right-4 w-8 h-0.5 bg-green-300"></div>
            </div>

            <div className="text-center relative">
              <div className="w-16 h-16 bg-green-600 text-white rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-bold">
                2
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Get Your Card
              </h3>
              <p className="text-gray-600">
                Order your EarthWallet Debit Card and receive it in 2-5 business days with free shipping.
              </p>
              
              {/* Connector arrow */}
              <div className="hidden md:block absolute top-8 -right-4 w-8 h-0.5 bg-green-300"></div>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-green-600 text-white rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-bold">
                3
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Spend Anywhere
              </h3>
              <p className="text-gray-600">
                Use your card at millions of locations worldwide or withdraw cash from 55,000+ ATMs.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-green-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold mb-2">55K+</div>
              <div className="text-green-100">Fee-Free ATMs</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">$0</div>
              <div className="text-green-100">Monthly Fees</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">24/7</div>
              <div className="text-green-100">Customer Support</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">100%</div>
              <div className="text-green-100">Fraud Protection</div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Details */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                All the Benefits You Need
              </h2>
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-green-600 text-sm">✓</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Worldwide Acceptance</h3>
                    <p className="text-gray-600">Use anywhere Visa is accepted - online, in-store, or abroad.</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-green-600 text-sm">✓</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Real-Time Notifications</h3>
                    <p className="text-gray-600">Get instant alerts for every transaction to keep your account secure.</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-green-600 text-sm">✓</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Mobile App Control</h3>
                    <p className="text-gray-600">Freeze/unfreeze your card, view transactions, and manage settings from your phone.</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-green-600 text-sm">✓</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Zero Liability Protection</h3>
                    <p className="text-gray-600">100% protection against unauthorized transactions when reported promptly.</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-green-100 to-blue-100 rounded-3xl p-8 text-center">
              <div className="text-6xl mb-6">📱</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Complete Mobile Control
              </h3>
              <p className="text-gray-600 mb-6">
                Manage every aspect of your card from the EarthWallet mobile app. 
                Check balances, view transactions, and control security settings.
              </p>
              <div className="inline-flex items-center text-green-600 font-medium">
                Download App Soon 
                <span className="ml-2">→</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-green-600 to-blue-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Get Your EarthWallet Card?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of users who are already spending their recycling rewards instantly
          </p>
          
          {user ? (
            <div className="space-y-4">
              <button
                onClick={handleOrderCard}
                disabled={orderProcessing}
                className="bg-white text-green-600 hover:bg-gray-100 disabled:bg-gray-200 text-xl font-bold px-8 py-4 rounded-2xl shadow-xl transform hover:scale-105 active:scale-95 transition-all duration-200"
              >
                {orderProcessing ? (
                  <span className="flex items-center">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-green-600 mr-3"></div>
                    Processing Order...
                  </span>
                ) : (
                  "Order Your Card - Free Shipping"
                )}
              </button>
              <p className="text-green-100 text-sm">
                Delivered in 2-5 business days • No fees • Instant activation
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <button
                onClick={() => openAuthModal("signup")}
                className="bg-white text-green-600 hover:bg-gray-100 text-xl font-bold px-8 py-4 rounded-2xl shadow-xl transform hover:scale-105 active:scale-95 transition-all duration-200"
              >
                Create Account & Apply
              </button>
              <p className="text-green-100 text-sm">
                Already have an account? 
                <button 
                  onClick={() => openAuthModal("login")}
                  className="text-white hover:text-green-100 font-medium ml-1 underline"
                >
                  Sign in to order
                </button>
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Order Success Modal */}
      {showOrderModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-8 w-full max-w-md text-center">
            <div className="text-6xl mb-6">🎉</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Order Placed Successfully!
            </h2>
            <p className="text-gray-600 mb-6">
              Your EarthWallet Debit Card is on its way! You should expect to receive it within 
              <strong className="text-green-600"> 2-5 business days</strong>.
            </p>
            
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6 text-left">
              <h3 className="font-semibold text-green-900 mb-2">What's Next:</h3>
              <ul className="text-sm text-green-800 space-y-1">
                <li>• We'll send you tracking information via email</li>
                <li>• Activate your card when it arrives</li>
                <li>• Start spending your recycling rewards instantly!</li>
              </ul>
            </div>

            <div className="space-y-3">
              <Link
                  to="/wallet"
                className="w-full bg-green-600 hover:bg-green-700 text-white py-3 px-6 rounded-lg font-medium transition-colors"
              >
                Continue to Wallet
              </Link>
              {/* <button
                onClick={() => setShowOrderModal(false)}
                className="w-full text-gray-600 hover:text-gray-800 py-2 text-sm"
              >
                Close
              </button> */}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DebitCardPage;