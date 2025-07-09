import React, { useState, useEffect } from 'react';

const KioskDashboard = () => {
  // State management
  const [currentScreen, setCurrentScreen] = useState('welcome');
  const [kioskId, setKioskId] = useState('');
  const [selectedMaterial, setSelectedMaterial] = useState('');
  const [itemCount, setItemCount] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [isElectron, setIsElectron] = useState(false);

  // API configuration
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || "https://earthwalletapi.onrender.com";

  // Material rates
  const MATERIAL_RATES = { plastic: 5, aluminum: 10 };

  // Check if running in electron
  useEffect(() => {
    if (typeof window !== 'undefined' && window.electronAPI) {
      setIsElectron(true);
    }
  }, []);

  // Disable context menu and certain shortcuts in electron
  useEffect(() => {
    if (isElectron) {
      const handleContextMenu = (e) => {
        e.preventDefault();
        return false;
      };

      const handleKeyDown = (e) => {
        // Disable common shortcuts that might interfere with kiosk mode
        if (
          e.key === 'F12' ||
          e.key === 'F11' ||
          (e.ctrlKey && e.shiftKey && e.key === 'I') ||
          (e.ctrlKey && e.shiftKey && e.key === 'C') ||
          (e.ctrlKey && e.key === 'r') ||
          e.key === 'F5'
        ) {
          e.preventDefault();
          return false;
        }
      };

      document.addEventListener('contextmenu', handleContextMenu);
      document.addEventListener('keydown', handleKeyDown);

      return () => {
        document.removeEventListener('contextmenu', handleContextMenu);
        document.removeEventListener('keydown', handleKeyDown);
      };
    }
  }, [isElectron]);

  // On-screen keyboard layout
  const keyboardLayout = [
    ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'],
    ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
    ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
    ['Z', 'X', 'C', 'V', 'B', 'N', 'M']
  ];

  // Helper function for public API calls (no authentication)
  const publicApiCall = async (endpoint, options = {}) => {
    const url = `${apiBaseUrl}${endpoint}`;
    
    const headers = {
      "Content-Type": "application/json",
    };

    const defaultOptions = {
      headers,
    };

    const response = await fetch(url, { ...defaultOptions, ...options });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API Error ${response.status}: ${errorText}`);
    }

    return response.json();
  };

  // Helper function for kiosk API calls
  const kioskApiCall = async (endpoint, kioskId, options = {}) => {
    const url = `${apiBaseUrl}${endpoint}`;
    
    const headers = {
      "Content-Type": "application/json",
      "X-Kiosk-User-ID": kioskId,
    };

    const defaultOptions = {
      headers,
    };

    const response = await fetch(url, { ...defaultOptions, ...options });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API Error ${response.status}: ${errorText}`);
    }

    return response.json();
  };

  // Handle virtual keyboard input
  const handleKeyPress = (key) => {
    if (key === 'BACKSPACE') {
      setKioskId(prev => prev.slice(0, -1));
    } else if (key === 'CLEAR') {
      setKioskId('');
    } else if (kioskId.length < 8) {
      setKioskId(prev => prev + key);
    }
    setError(''); // Clear error when typing
  };

  // Listen for spacebar when counting
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (currentScreen === 'counting' && event.code === 'Space') {
        event.preventDefault();
        setItemCount(prev => {
          const newCount = prev + 1;
          console.log(`Item detected! Total count: ${newCount}`);
          return newCount;
        });
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentScreen]);

  // Reset all state
  const resetKiosk = () => {
    setCurrentScreen('welcome');
    setKioskId('');
    setSelectedMaterial('');
    setItemCount(0);
    setIsSubmitting(false);
    setResult(null);
    setError('');
  };

  // Auto-reset after inactivity (for kiosk mode)
  useEffect(() => {
    let inactivityTimer;
    
    const resetInactivityTimer = () => {
      clearTimeout(inactivityTimer);
      inactivityTimer = setTimeout(() => {
        if (currentScreen !== 'welcome') {
          resetKiosk();
        }
      }, 300000); // 5 minutes of inactivity
    };

    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];
    
    events.forEach(event => {
      document.addEventListener(event, resetInactivityTimer, true);
    });

    resetInactivityTimer();

    return () => {
      clearTimeout(inactivityTimer);
      events.forEach(event => {
        document.removeEventListener(event, resetInactivityTimer, true);
      });
    };
  }, [currentScreen]);

  // Handle kiosk ID input
  const handleKioskIdSubmit = async () => {
    if (kioskId.length !== 8) {
      setError('Kiosk ID must be exactly 8 characters');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      const response = await publicApiCall("/validate-kiosk-id", {
        method: "POST",
        body: JSON.stringify({
          kiosk_id: kioskId
        }),
      });
      
      console.log(`Kiosk ID validated for user: ${response.user_email}`);
      setCurrentScreen('selectMaterial');
      setIsSubmitting(false);
    } catch (error) {
      console.error('Kiosk ID validation failed:', error);
      setError('Invalid Kiosk ID. Please check your ID and try again.');
      setIsSubmitting(false);
    }
  };

  // Handle material selection
  const handleMaterialSelect = (material) => {
    setSelectedMaterial(material);
    setCurrentScreen('counting');
    setItemCount(0);
  };

  // Submit deposit
  const handleSubmitDeposit = async () => {
    if (itemCount === 0) {
      setError('Please add at least one item before submitting');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      const response = await kioskApiCall("/deposit", kioskId, {
        method: "POST",
        body: JSON.stringify({
          material: selectedMaterial,
          units: itemCount,
        }),
      });

      setResult({
        success: true,
        message: response.message || 'Deposit successful!',
        amount: response.transaction.amount_cents,
        newBalance: response.new_balance_cents,
      });
      setCurrentScreen('result');
    } catch (error) {
      setResult({
        success: false,
        message: error.message || 'Deposit failed. Please try again.',
      });
      setCurrentScreen('result');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Calculate expected earnings
  const calculateEarnings = () => {
    const rate = MATERIAL_RATES[selectedMaterial] || 0;
    const totalCents = itemCount * rate;
    return {
      cents: totalCents,
      dollars: (totalCents / 100).toFixed(2),
    };
  };

  // Virtual Keyboard Component
  const VirtualKeyboard = () => (
    <div className="bg-gray-100 rounded-xl p-4 mt-4">
      <div className="space-y-2">
        {keyboardLayout.map((row, rowIndex) => (
          <div key={rowIndex} className="flex justify-center space-x-1">
            {row.map((key) => (
              <button
                key={key}
                onClick={() => handleKeyPress(key)}
                className="bg-white hover:bg-gray-200 active:bg-gray-300 border-2 border-gray-300 rounded-lg w-12 h-12 text-lg font-bold shadow-lg transform active:scale-95 transition-all duration-100"
              >
                {key}
              </button>
            ))}
          </div>
        ))}
        
        {/* Special keys row */}
        <div className="flex justify-center space-x-1 mt-3">
          <button
            onClick={() => handleKeyPress('CLEAR')}
            className="bg-red-500 hover:bg-red-600 active:bg-red-700 text-white border-2 border-red-600 rounded-lg px-4 h-12 text-sm font-bold shadow-lg transform active:scale-95 transition-all duration-100"
          >
            CLEAR
          </button>
          <button
            onClick={() => handleKeyPress('BACKSPACE')}
            className="bg-yellow-500 hover:bg-yellow-600 active:bg-yellow-700 text-white border-2 border-yellow-600 rounded-lg px-4 h-12 text-lg font-bold shadow-lg transform active:scale-95 transition-all duration-100"
          >
            ⌫
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className={`bg-gradient-to-br from-green-400 to-blue-600 flex items-center justify-center p-2 text-black ${
      isElectron ? 'h-screen w-screen' : 'h-screen'
    }`}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-6xl h-[95vh] flex flex-col overflow-hidden">
        
        {/* Header */}
        <div className="bg-green-600 text-white p-4 rounded-t-2xl text-center flex-shrink-0">
          <div className="flex justify-between items-center">
            <div className="flex-1">
              <h1 className="text-3xl font-bold">EarthWallet Kiosk</h1>
              <p className="text-green-100 mt-1 text-lg">Recycle • Earn • Repeat</p>
            </div>
            {isElectron && (
              <div className="text-right">
                <div className="text-sm text-green-100">Electron Mode</div>
                <div className="text-xs text-green-200">
                  {new Date().toLocaleTimeString()}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-6 flex flex-col justify-center overflow-y-auto">
          
          {/* Welcome Screen */}
          {currentScreen === 'welcome' && (
            <div className="text-center space-y-6">
              <div className="text-6xl mb-4">♻️</div>
              <h2 className="text-4xl font-bold text-gray-800 mb-4">
                Welcome to EarthWallet Kiosk
              </h2>
              <p className="text-xl text-gray-600 mb-8">
                Turn your recyclables into cash instantly!
              </p>
              <button
                onClick={() => setCurrentScreen('enterKioskId')}
                className="bg-green-600 hover:bg-green-700 active:bg-green-800 text-white text-2xl font-bold py-4 px-12 rounded-2xl shadow-xl transform hover:scale-105 active:scale-95 transition-all duration-200"
              >
                START RECYCLING
              </button>
              {isElectron && (
                <div className="mt-8 text-sm text-gray-500">
                  Running in Kiosk Mode - Touch to begin
                </div>
              )}
            </div>
          )}

          {/* Enter Kiosk ID Screen */}
          {currentScreen === 'enterKioskId' && (
            <div className="text-center space-y-4">
              <h2 className="text-3xl font-bold text-gray-800 mb-4">
                Enter Your Kiosk ID
              </h2>
              <p className="text-lg text-gray-600 mb-4">
                Your 8-character Kiosk ID can be found in your EarthWallet account
              </p>
              
              <div className="space-y-4">
                {/* Kiosk ID Display */}
                <div className="bg-gray-50 border-4 border-gray-300 rounded-xl py-4 px-8 mx-auto w-fit">
                  <div className="text-3xl font-mono font-bold text-center text-gray-800 min-w-[300px] tracking-wider">
                    {kioskId.padEnd(8, '_')}
                  </div>
                  <div className="text-sm text-gray-500 mt-1">
                    {kioskId.length}/8 characters
                  </div>
                </div>
                
                {error && (
                  <div className="text-red-600 text-lg font-bold bg-red-100 p-3 rounded-xl mx-auto max-w-md">
                    {error}
                  </div>
                )}
                
                {/* Virtual Keyboard */}
                <VirtualKeyboard />
                
                <div className="flex justify-center space-x-4 mt-4">
                  <button
                    onClick={() => setCurrentScreen('welcome')}
                    className="bg-gray-500 hover:bg-gray-600 active:bg-gray-700 text-white text-lg font-bold py-3 px-8 rounded-xl shadow-lg transform active:scale-95 transition-all duration-100"
                  >
                    Back
                  </button>
                  <button
                    onClick={handleKioskIdSubmit}
                    disabled={kioskId.length !== 8 || isSubmitting}
                    className="bg-green-600 hover:bg-green-700 active:bg-green-800 disabled:bg-gray-400 text-white text-lg font-bold py-3 px-8 rounded-xl shadow-lg transform active:scale-95 transition-all duration-100 disabled:transform-none disabled:active:scale-100"
                  >
                    {isSubmitting ? (
                      <span className="flex items-center">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                        Validating...
                      </span>
                    ) : (
                      'Continue'
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Select Material Screen */}
          {currentScreen === 'selectMaterial' && (
            <div className="text-center space-y-6">
              <h2 className="text-3xl font-bold text-gray-800 mb-6">
                What are you recycling today?
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                <button
                  onClick={() => handleMaterialSelect('plastic')}
                  className="bg-blue-500 hover:bg-blue-600 active:bg-blue-700 text-white p-8 rounded-2xl shadow-2xl transform hover:scale-105 active:scale-95 transition-all duration-200 group"
                >
                  <div className="text-6xl mb-4 group-hover:animate-bounce">🍼</div>
                  <div className="text-2xl font-bold mb-3">Plastic Bottles</div>
                  <div className="text-lg bg-blue-400 bg-opacity-50 rounded-xl py-2 px-4">5¢ per bottle</div>
                </button>
                
                <button
                  onClick={() => handleMaterialSelect('aluminum')}
                  className="bg-gray-500 hover:bg-gray-600 active:bg-gray-700 text-white p-8 rounded-2xl shadow-2xl transform hover:scale-105 active:scale-95 transition-all duration-200 group"
                >
                  <div className="text-6xl mb-4 group-hover:animate-bounce">🥤</div>
                  <div className="text-2xl font-bold mb-3">Aluminum Cans</div>
                  <div className="text-lg bg-gray-400 bg-opacity-50 rounded-xl py-2 px-4">10¢ per can</div>
                </button>
              </div>
              
              <button
                onClick={() => setCurrentScreen('enterKioskId')}
                className="bg-gray-500 hover:bg-gray-600 active:bg-gray-700 text-white text-lg font-bold py-3 px-8 rounded-xl shadow-lg transform active:scale-95 transition-all duration-100 mt-6"
              >
                Back
              </button>
            </div>
          )}

          {/* Counting Screen */}
          {currentScreen === 'counting' && (
            <div className="text-center space-y-6">
              <h2 className="text-3xl font-bold text-gray-800 mb-4">
                Insert your {selectedMaterial === 'plastic' ? 'plastic bottles' : 'aluminum cans'}
              </h2>
              
              <div className="bg-gray-100 rounded-2xl p-8 mb-6">
                <div className="text-7xl font-bold text-green-600 mb-4">
                  {itemCount}
                </div>
                <div className="text-2xl text-gray-600 mb-4">
                  {selectedMaterial === 'plastic' ? 'Bottles' : 'Cans'} Detected
                </div>
                <div className="text-xl text-green-600 font-bold">
                  Current Value: ${calculateEarnings().dollars}
                </div>
              </div>
              
              <div className="bg-blue-50 border-4 border-blue-200 rounded-xl p-4 mb-6">
                <p className="text-lg text-blue-800">
                  <span className="font-bold">Instructions:</span> Insert items one by one into the machine.
                  <br />
                  <span className="text-sm mt-1 block">
                    {isElectron ? '(Hardware integration active)' : '(Press SPACEBAR to simulate item detection)'}
                  </span>
                </p>
              </div>
              
              <div className="flex justify-center space-x-4">
                <button
                  onClick={() => setCurrentScreen('selectMaterial')}
                  className="bg-gray-500 hover:bg-gray-600 active:bg-gray-700 text-white text-lg font-bold py-3 px-8 rounded-xl shadow-lg transform active:scale-95 transition-all duration-100"
                >
                  Back
                </button>
                <button
                  onClick={handleSubmitDeposit}
                  disabled={itemCount === 0 || isSubmitting}
                  className="bg-green-600 hover:bg-green-700 active:bg-green-800 disabled:bg-gray-400 text-white text-lg font-bold py-3 px-8 rounded-xl shadow-lg transform active:scale-95 transition-all duration-100 disabled:transform-none disabled:active:scale-100"
                >
                  {isSubmitting ? 'Processing...' : 'No More Items - Submit'}
                </button>
              </div>
            </div>
          )}

          {/* Result Screen */}
          {currentScreen === 'result' && (
            <div className="text-center space-y-6">
              <div className="text-7xl mb-4">
                {result?.success ? '🎉' : '❌'}
              </div>
              
              <h2 className={`text-3xl font-bold mb-4 ${
                result?.success ? 'text-green-600' : 'text-red-600'
              }`}>
                {result?.success ? 'Deposit Successful!' : 'Deposit Failed'}
              </h2>
              
              <div className="bg-gray-50 rounded-2xl p-6 mb-6">
                <p className="text-xl text-gray-800 mb-4">
                  {result?.message}
                </p>
                
                {result?.success && (
                  <div className="space-y-3">
                    <div className="text-3xl font-bold text-green-600">
                      Earned: ${(result.amount / 100).toFixed(2)}
                    </div>
                    <div className="text-xl text-gray-600">
                      Account Balance: ${(result.newBalance / 100).toFixed(2)}
                    </div>
                    <div className="text-lg text-gray-500">
                      {itemCount} {selectedMaterial === 'plastic' ? 'bottles' : 'cans'} recycled
                    </div>
                  </div>
                )}
              </div>
              
              <div className="flex justify-center space-x-4">
                <button
                  onClick={() => setCurrentScreen('selectMaterial')}
                  className="bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-lg font-bold py-3 px-8 rounded-xl shadow-lg transform active:scale-95 transition-all duration-100"
                >
                  Deposit More
                </button>
                <button
                  onClick={resetKiosk}
                  className="bg-green-600 hover:bg-green-700 active:bg-green-800 text-white text-lg font-bold py-3 px-8 rounded-xl shadow-lg transform active:scale-95 transition-all duration-100"
                >
                  Finish
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-gray-100 p-3 rounded-b-2xl text-center text-gray-600 flex-shrink-0">
          <div className="flex justify-between items-center">
            <p className="text-sm">EarthWallet • Making recycling rewarding</p>
            <div className="text-xs text-gray-500">
              {isElectron && (
                <span>Kiosk Mode • </span>
              )}
              {currentScreen === 'counting' && !isElectron && (
                <span>Press SPACEBAR to simulate item detection • </span>
              )}
              Auto-reset in 5min idle
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default KioskDashboard;