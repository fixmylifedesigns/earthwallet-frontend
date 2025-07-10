import React from "react";

const EarthWalletProjectPage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Banner Section */}
      <section className="bg-gradient-to-br from-green-600 via-green-700 to-blue-800 text-white">
        <div className="max-w-6xl mx-auto px-6 py-20">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              🌍 EarthWallet
            </h1>
            <p className="text-xl md:text-2xl font-light mb-8 max-w-4xl mx-auto leading-relaxed">
              Revolutionary recycling rewards platform that turns your
              environmental impact into instant cash rewards
            </p>
            <div className="flex flex-col md:flex-row gap-4 justify-center items-center">
              <div className="bg-white bg-opacity-20 backdrop-blur rounded-lg px-6 py-3">
                <span className="text-lg font-semibold">
                  ♻️ Recycle • 💰 Earn • 🌱 Repeat
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Demo Video Section */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              See EarthWallet in Action
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Watch how our innovative platform makes recycling rewarding and
              accessible to everyone
            </p>
          </div>

          {/* Video Placeholder */}
          <div className="max-w-4xl mx-auto">
            <div className="relative aspect-video bg-gray-900 rounded-2xl shadow-2xl overflow-hidden">
              {/* YouTube embed placeholder */}
              <iframe 
                className="w-full h-full" 
                src="https://www.youtube.com/embed/hJZm0pdFi-c?si=86iqrui-mI_mWdW3" 
                title="EarthWallet Demo"
                frameBorder="0" 
                allowFullScreen
              ></iframe>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Earth Wallet Android App and Kiosk Desktop App
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 mt-8 justify-center">
            <a
              href="/downloads/earthwallet.apk"
              download
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium text-center"
            >
              Download for EarthWallet for Android
            </a>

            <a
              href="/downloads/earthwallet-setup.exe"
              download
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium text-center"
            >
              Download for Eathwallet Kiosk Windows
            </a>
          </div>
        </div>
      </section>

      {/* Kiosk Desktop App Section */}
      <section className="py-16 bg-gray-100">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                🖥️ Smart Kiosk Desktop App
              </h2>
              <div className="space-y-4 text-lg text-gray-700">
                <p>
                  Our cutting-edge kiosk application, built with{" "}
                  <strong>React.js</strong> and packaged using{" "}
                  <strong>Electron</strong>, transforms any computer into a
                  powerful recycling station.
                </p>
                <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-green-500">
                  <h3 className="font-semibold text-gray-900 mb-2">
                    🔑 Kiosk ID Login
                  </h3>
                  <p>
                    Users simply enter their unique 8-character Kiosk ID from
                    their EarthWallet to get started
                  </p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-blue-500">
                  <h3 className="font-semibold text-gray-900 mb-2">
                    💰 Instant Payments
                  </h3>
                  <p>
                    Deposit bottles and cans to receive immediate payments
                    directly to your digital wallet
                  </p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-purple-500">
                  <h3 className="font-semibold text-gray-900 mb-2">
                    🚀 Future Technology
                  </h3>
                  <p>
                    Currently simulated with spacebar input, we're developing
                    integration with smart hardware featuring:
                  </p>
                  <ul className="list-disc list-inside mt-2 space-y-1 text-gray-600">
                    <li>Precision weight mechanisms</li>
                    <li>
                      AI-powered image recognition for real-time bottle
                      classification
                    </li>
                    <li>Barcode scanning for material identification</li>
                    <li>
                      Custom device integration with dedicated counting software
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-br from-green-500 to-blue-600 p-8 rounded-2xl text-white">
              <div className="text-center">
                <div className="text-6xl mb-4">🏪</div>
                <h3 className="text-2xl font-bold mb-4">Kiosk Features</h3>
                <div className="space-y-3 text-left">
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">🎯</span>
                    <span>Touch-optimized interface</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">⚡</span>
                    <span>Real-time transaction processing</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">🔒</span>
                    <span>Secure kiosk ID authentication</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">📊</span>
                    <span>Live balance updates</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Wallet App Section */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="bg-gradient-to-br from-blue-500 to-green-600 p-8 rounded-2xl text-white">
              <div className="text-center">
                <div className="text-6xl mb-4">📱</div>
                <h3 className="text-2xl font-bold mb-4">Mobile Wallet</h3>
                <div className="space-y-3 text-left">
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">💳</span>
                    <span>Instant withdrawals to bank account</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">📈</span>
                    <span>Real-time transaction history</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">🔐</span>
                    <span>Firebase authentication</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">🌐</span>
                    <span>Cross-platform compatibility</span>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                📲 Digital Wallet App
              </h2>
              <div className="space-y-4 text-lg text-gray-700">
                <p>
                  Built with <strong>React.js</strong> and deployable to mobile
                  devices using <strong>Capacitor</strong>, our wallet app puts
                  financial control in users' hands.
                </p>
                <div className="bg-gray-50 p-6 rounded-lg border-l-4 border-green-500">
                  <h3 className="font-semibold text-gray-900 mb-2">
                    💸 Seamless Withdrawals
                  </h3>
                  <p>
                    Powered by <strong>Stripe Payouts</strong>, users can
                    transfer earnings directly to their bank accounts with just
                    a few taps
                  </p>
                </div>
                <div className="bg-gray-50 p-6 rounded-lg border-l-4 border-blue-500">
                  <h3 className="font-semibold text-gray-900 mb-2">
                    📊 Transaction Transparency
                  </h3>
                  <p>
                    Complete visibility into all deposits and withdrawals with
                    detailed transaction histories and real-time balance updates
                  </p>
                </div>
                <div className="bg-gray-50 p-6 rounded-lg border-l-4 border-purple-500">
                  <h3 className="font-semibold text-gray-900 mb-2">
                    🏦 Future Banking Integration
                  </h3>
                  <p>
                    Planned integration with <strong>Stripe Connect</strong> to
                    allow users to link their own bank accounts through a secure
                    portal
                  </p>
                </div>
                <div className="bg-gray-50 p-6 rounded-lg border-l-4 border-orange-500">
                  <h3 className="font-semibold text-gray-900 mb-2">
                    📱 Multi-Platform Deployment
                  </h3>
                  <p>
                    Single React.js codebase deployed to{" "}
                    <strong>Android</strong> and <strong>iOS</strong> using
                    Capacitor for native app experiences
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Backend Section */}
      <section className="py-16 bg-gray-100">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              ⚙️ Robust Backend Infrastructure
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Enterprise-grade API built with Flask, secured by Firebase, and
              powered by Stripe
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-xl shadow-lg border-t-4 border-red-500">
              <div className="text-3xl mb-4">🔐</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Firebase Authentication
              </h3>
              <p className="text-gray-600 mb-4">
                Secure user authentication with Firebase ID tokens verified
                server-side for maximum security
              </p>
              <div className="text-sm text-gray-500">
                <span className="font-medium">Features:</span> Token validation,
                user management, session handling
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-lg border-t-4 border-blue-500">
              <div className="text-3xl mb-4">💰</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Wallet Management
              </h3>
              <p className="text-gray-600 mb-4">
                Complete wallet lifecycle management from user creation to
                balance tracking and transaction history
              </p>
              <div className="text-sm text-gray-500">
                <span className="font-medium">Endpoints:</span> /wallet,
                /transactions, user account management
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-lg border-t-4 border-green-500">
              <div className="text-3xl mb-4">📦</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Deposit Processing
              </h3>
              <p className="text-gray-600 mb-4">
                Smart deposit endpoint that calculates payouts based on material
                type and quantity with instant balance updates
              </p>
              <div className="text-sm text-gray-500">
                <span className="font-medium">Materials:</span> Plastic (5¢),
                Aluminum (10¢) per unit
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-lg border-t-4 border-purple-500">
              <div className="text-3xl mb-4">💸</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Stripe Withdrawals
              </h3>
              <p className="text-gray-600 mb-4">
                Seamless integration with Stripe Payouts for direct bank
                transfers, with automatic balance deduction and transaction
                logging
              </p>
              <div className="text-sm text-gray-500">
                <span className="font-medium">Process:</span> Balance
                verification → Stripe payout → Account update
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-lg border-t-4 border-yellow-500">
              <div className="text-3xl mb-4">🏪</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Kiosk Integration
              </h3>
              <p className="text-gray-600 mb-4">
                Specialized endpoints for kiosk operations with unique ID-based
                authentication for secure, app-free transactions
              </p>
              <div className="text-sm text-gray-500">
                <span className="font-medium">Features:</span> Kiosk ID
                validation, touch-optimized responses
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-lg border-t-4 border-indigo-500">
              <div className="text-3xl mb-4">🛡️</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Security & Reliability
              </h3>
              <p className="text-gray-600 mb-4">
                Production-ready with rate limiting, comprehensive error
                handling, and secure token management
              </p>
              <div className="text-sm text-gray-500">
                <span className="font-medium">Stack:</span> Flask, PostgreSQL,
                Redis, Railway deployment
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Future Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              🚀 Coming Soon
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Exciting features in development to enhance the EarthWallet
              ecosystem
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-gradient-to-br from-purple-500 to-pink-600 p-6 rounded-xl text-white">
              <div className="text-4xl mb-4">💳</div>
              <h3 className="text-xl font-bold mb-3">
                EarthWallet Debit Cards
              </h3>
              <p className="text-purple-100 mb-4">
                Instant access to your earnings with Stripe-powered debit cards
                for immediate spending
              </p>
              <div className="text-sm text-purple-200">
                Order physical cards directly from the app
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-500 to-cyan-600 p-6 rounded-xl text-white">
              <div className="text-4xl mb-4">🗺️</div>
              <h3 className="text-xl font-bold mb-3">Kiosk Location Map</h3>
              <p className="text-blue-100 mb-4">
                Interactive maps in both web and mobile apps to help users find
                the nearest recycling kiosks
              </p>
              <div className="text-sm text-blue-200">
                Real-time availability and directions
              </div>
            </div>

            <div className="bg-gradient-to-br from-green-500 to-teal-600 p-6 rounded-xl text-white">
              <div className="text-4xl mb-4">🏧</div>
              <h3 className="text-xl font-bold mb-3">Cash Withdrawal ATMs</h3>
              <p className="text-green-100 mb-4">
                React.js and Electron-powered ATM software for instant cash
                withdrawals from EarthWallet balances
              </p>
              <div className="text-sm text-green-200">
                Physical cash access to digital earnings
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-gradient-to-r from-green-600 to-blue-600 text-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Join the Recycling Revolution
          </h2>
          <p className="text-xl mb-8 opacity-90">
            EarthWallet is transforming how we think about recycling, making
            environmental responsibility both rewarding and accessible
          </p>
          <div className="flex flex-col md:flex-row gap-4 justify-center">
            <button className="bg-white text-green-600 px-8 py-3 rounded-lg font-bold text-lg hover:bg-gray-100 transition-colors">
              Download App
            </button>
            <button className="border-2 border-white text-white px-8 py-3 rounded-lg font-bold text-lg hover:bg-white hover:text-green-600 transition-colors">
              Find Kiosks
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default EarthWalletProjectPage;
