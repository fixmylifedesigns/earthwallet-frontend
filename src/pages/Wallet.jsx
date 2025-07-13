import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Capacitor } from "@capacitor/core";
import QRCode from "qrcode";

const WalletPage = ({ user }) => {
  // State for wallet data
  const [wallet, setWallet] = useState(null);
  const [deposits, setDeposits] = useState([]);
  const [withdrawals, setWithdrawals] = useState([]);
  const [userKioskId, setUserKioskId] = useState(null);
  const [qrcode, setQRCode] = useState(null);

  // UI state
  const [activeTab, setActiveTab] = useState("deposits");
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [withdrawalAmount, setWithdrawalAmount] = useState("");
  const [withdrawAllSelected, setWithdrawAllSelected] = useState(false);
  const [showKioskId, setShowKioskId] = useState(false);
  const isMobile = Capacitor.isNativePlatform();
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Loading and error states
  const [loading, setLoading] = useState({});
  const [errors, setErrors] = useState({});

  // API configuration
  const apiBaseUrl = "https://earthwalletapi.onrender.com"; // Adjust as needed
  const testEmail = user?.email || "";

  // Helper function to make API calls (same pattern as your test dashboard)
  const apiCall = async (endpoint, options = {}) => {
    const url = `${apiBaseUrl}${endpoint}`;

    let authHeaders = {
      "Content-Type": "application/json",
    };

    if (user) {
      try {
        const idToken = await user.getIdToken();
        authHeaders["Authorization"] = `Bearer ${idToken}`;
      } catch (error) {
        console.error("Failed to get ID token:", error);

        // Fall back to test header (same as your test dashboard)
        if (testEmail) {
          authHeaders["X-Test-User-Email"] = testEmail;
        }
      }
    } else if (testEmail) {
      authHeaders["X-Test-User-Email"] = testEmail;
    }

    const defaultOptions = {
      headers: authHeaders,
    };

    const response = await fetch(url, { ...defaultOptions, ...options });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API Error ${response.status}: ${errorText}`);
    }

    return response.json();
  };

  // Generic handler for API calls
  const handleApiCall = async (key, apiCallFn, successCallback) => {
    setLoading((prev) => ({ ...prev, [key]: true }));
    setErrors((prev) => ({ ...prev, [key]: null }));

    try {
      const result = await apiCallFn();
      if (successCallback) successCallback(result);
    } catch (error) {
      console.error(`${key} error:`, error);
      setErrors((prev) => ({ ...prev, [key]: error.message }));
    } finally {
      setLoading((prev) => ({ ...prev, [key]: false }));
    }
  };

  // Fetch wallet data
  const fetchWallet = () => {
    handleApiCall(
      "wallet",
      () => apiCall("/wallet"),
      (result) => setWallet(result)
    );
  };

  // Fetch deposits with pagination
  const fetchDeposits = (page = 1) => {
    const offset = (page - 1) * itemsPerPage;
    handleApiCall(
      "deposits",
      () => apiCall(`/transactions?limit=${itemsPerPage}&offset=${offset}`),
      (result) => setDeposits(result.transactions || result)
    );
  };

  // Fetch withdrawals with pagination
  const fetchWithdrawals = (page = 1) => {
    const offset = (page - 1) * itemsPerPage;
    handleApiCall(
      "withdrawals",
      () => apiCall(`/withdrawals?limit=${itemsPerPage}&offset=${offset}`),
      (result) => setWithdrawals(result.withdrawals || result)
    );
  };

  // Fetch user's kiosk ID
  const fetchKioskId = () => {
    if (!user) return; // skip when signed-out
    handleApiCall(
      "kioskId",
      () => apiCall("/user/kiosk-id"),
      (r) => setUserKioskId(r.kiosk_id)
    );
  };

  // Handle withdrawal submission
  const handleWithdrawal = () => {
    const amount = withdrawAllSelected
      ? wallet.balance_cents / 100
      : parseFloat(withdrawalAmount);
    const amountCents = Math.round(amount * 100);

    if (amountCents < 100) {
      setErrors((prev) => ({
        ...prev,
        withdrawal: "Minimum withdrawal is $1.00",
      }));
      return;
    }

    handleApiCall(
      "withdrawal",
      () =>
        apiCall("/withdraw", {
          method: "POST",
          body: JSON.stringify({
            amount_cents: amountCents,
            bank_token: "tok_test_123", // You might want to handle this differently
          }),
        }),
      (result) => {
        setShowWithdrawModal(false);
        setWithdrawalAmount("");
        setWithdrawAllSelected(false);
        setErrors((prev) => ({ ...prev, withdrawal: null }));
        fetchWallet();
        fetchWithdrawals(currentPage);
      }
    );
  };

  const handleQRGeneration = async (state) => {
    if (state === "Show") {
      QRCode.toDataURL(userKioskId, { width:200, errorCorrectionLevel: "H" })
        .then((url) => {
          setQRCode(url);
        })
        .catch((err) => {
          console.error("QR Code generation error:", err);
          setQRCode(null);
        });
    } else {
      setQRCode(null);
    }
  };

  // Load initial data
  useEffect(() => {
    if (user === undefined) return;
    fetchWallet();
    fetchDeposits(1);
    fetchWithdrawals(1);
    fetchKioskId();
  }, [user]);

  // Handle tab change and pagination reset
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setCurrentPage(1);
    if (tab === "deposits") {
      fetchDeposits(1);
    } else {
      fetchWithdrawals(1);
    }
  };

  // Helper functions
  const formatMoney = (cents) => `$${(cents / 100).toFixed(2)}`;
  const formatDate = (dateString) => new Date(dateString).toLocaleDateString();

  // Get current data for active tab
  const currentData = activeTab === "deposits" ? deposits : withdrawals;
  const hasNextPage = currentData.length === itemsPerPage;
  const hasPrevPage = currentPage > 1;

  return (
    <div
      className={`min-h-screen bg-gray-50 p-6 ${
        isMobile ? "safe-area-top safe-area-bottom" : ""
      }`}
    >
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Wallet</h1>
          <p className="text-gray-600 mt-2">
            Manage your balance and view transaction history
          </p>
        </div>

        {/* Balance Section */}
        <div className="bg-white rounded-lg shadow-sm border p-8 mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="mb-6 md:mb-0">
              <h2 className="text-lg font-medium text-gray-900 mb-2">
                Available Balance
              </h2>
              {wallet ? (
                <div className="text-4xl font-bold text-gray-900">
                  {formatMoney(wallet.balance_cents)}
                </div>
              ) : (
                <div className="animate-pulse bg-gray-200 h-12 w-32 rounded"></div>
              )}

              {/* Kiosk ID Section */}
              <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-blue-900">
                      Kiosk ID for deposits
                    </p>
                    <p className="text-xs text-blue-700">
                      Use this ID at any kiosk to add funds
                    </p>
                  </div>
                  <button
                    onClick={() => setShowKioskId(!showKioskId)}
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium m-2 "
                  >
                    {showKioskId ? "Hide" : "Show"} ID
                  </button>
                  <button
                    onClick={() => handleQRGeneration(!qrcode ? "Show" : "Hide")}
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium m-2 "
                  >
                    {qrcode ? "Hide" : "Show"} QR Code
                  </button>
                </div>
                {showKioskId && userKioskId && (
                  <div className="mt-2 p-2 bg-white border border-blue-200 rounded font-mono text-lg font-bold text-center text-blue-900">
                    {userKioskId}
                  </div>
                )}
              </div>
            </div>
            {qrcode && (
              <img
                src={qrcode}
                alt="QR Code"
                className="w-62 h-62 rounded-lg"
              />
            )}

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => setShowWithdrawModal(true)}
                disabled={!wallet || wallet.balance_cents < 100}
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-6 py-3 rounded-lg font-medium transition-colors"
              >
                Withdraw Funds
              </button>

              <Link
                to="/debitcard"
                className="bg-gray-100 hover:bg-gray-200 text-gray-900 px-6 py-3 rounded-lg font-medium transition-colors text-center"
              >
                Apply for Debit Card
              </Link>
            </div>
          </div>
        </div>

        {/* Recent Activity Section */}
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">
              Recent Activity
            </h2>
          </div>

          {/* Tabs */}
          <div className="border-b border-gray-200">
            <nav className="flex">
              <button
                onClick={() => handleTabChange("deposits")}
                className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === "deposits"
                    ? "border-blue-600 text-blue-600"
                    : "border-transparent text-white hover:text-gray-700"
                }`}
              >
                Deposits
              </button>
              <button
                onClick={() => handleTabChange("withdrawals")}
                className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === "withdrawals"
                    ? "border-blue-600 text-blue-600"
                    : "border-transparent text-white hover:text-gray-700"
                }`}
              >
                Withdrawals
              </button>
            </nav>
          </div>

          {/* Table Content */}
          <div className="p-6">
            {loading[activeTab] ? (
              <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            ) : errors[activeTab] ? (
              <div className="text-center py-12 text-red-600">
                Error loading {activeTab}: {errors[activeTab]}
              </div>
            ) : currentData.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                No {activeTab} found
              </div>
            ) : (
              <>
                {/* Deposits Table */}
                {activeTab === "deposits" && (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead>
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Date
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Material
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Units
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Amount
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {deposits.map((deposit, index) => (
                          <tr key={index} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {formatDate(deposit.created_at)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 capitalize">
                              {deposit.material || "-"}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {deposit.units || "-"}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-600">
                              +{formatMoney(deposit.amount_cents)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {/* Withdrawals Table */}
                {activeTab === "withdrawals" && (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead>
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Date
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Amount
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Status
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {withdrawals.map((withdrawal, index) => (
                          <tr key={index} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {formatDate(withdrawal.created_at)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-red-600">
                              -{formatMoney(withdrawal.amount_cents)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span
                                className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                  withdrawal.status === "completed"
                                    ? "bg-green-100 text-green-800"
                                    : withdrawal.status === "pending"
                                    ? "bg-yellow-100 text-yellow-800"
                                    : "bg-red-100 text-red-800"
                                }`}
                              >
                                {withdrawal.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {/* Pagination */}
                <div className="flex items-center justify-between mt-6">
                  <div className="text-sm text-gray-700">
                    Page {currentPage} of {activeTab} history
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={!hasPrevPage}
                      className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Previous
                    </button>
                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={!hasNextPage}
                      className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Next
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Withdrawal Modal */}
      {showWithdrawModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              Withdraw Funds
            </h3>

            <div className="mb-6 p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-800">
                Withdrawals are sent directly to your bank account and typically
                arrive within 2-3 business days.
              </p>
            </div>

            <div className="mb-6 p-4 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
              <p className="text-sm text-gray-700 text-center mb-3">
                Want instant access to your money?
              </p>
              <Link
                to="/debitcard"
                className="block w-full bg-purple-600 hover:bg-purple-700 text-white text-center py-2 px-4 rounded-lg font-medium transition-colors"
              >
                Apply for a Debit Card
              </Link>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Available Balance:{" "}
                {wallet ? formatMoney(wallet.balance_cents) : "$0.00"}
              </label>
            </div>

            <div className="mb-4">
              <label className="flex items-center mb-3">
                <input
                  type="checkbox"
                  checked={withdrawAllSelected}
                  onChange={(e) => {
                    setWithdrawAllSelected(e.target.checked);
                    if (e.target.checked) {
                      setWithdrawalAmount("");
                    }
                  }}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-gray-700">
                  Withdraw all funds
                </span>
              </label>

              {!withdrawAllSelected && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Custom Amount (USD)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="1"
                    max={wallet ? wallet.balance_cents / 100 : 0}
                    value={withdrawalAmount}
                    onChange={(e) => setWithdrawalAmount(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter amount"
                  />
                </div>
              )}
            </div>

            <p className="text-xs text-gray-500 mb-6">
              Minimum withdrawal is $1.00 USD
            </p>

            {errors.withdrawal && (
              <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                {errors.withdrawal}
              </div>
            )}

            <div className="flex space-x-3">
              <button
                onClick={() => {
                  setShowWithdrawModal(false);
                  setWithdrawalAmount("");
                  setWithdrawAllSelected(false);
                  setErrors((prev) => ({ ...prev, withdrawal: null }));
                }}
                className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleWithdrawal}
                disabled={
                  loading.withdrawal ||
                  (!withdrawAllSelected && !withdrawalAmount)
                }
                className="flex-1 px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 rounded-md transition-colors"
              >
                {loading.withdrawal ? "Processing..." : "Withdraw"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WalletPage;
