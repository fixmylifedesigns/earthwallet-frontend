import React, { useState } from "react";

const ApiTestDashboard = ({ user }) => {
  // Configuration state
  const [apiBaseUrl, setApiBaseUrl] = useState("https://earthwalletapi.onrender.com");
  const [testEmail, setTestEmail] = useState(user?.email || " ");
  const [debugInfo, setDebugInfo] = useState("");
  // Data state
  const [wallet, setWallet] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [withdrawals, setWithdrawals] = useState([]);

  // Loading states
  const [loading, setLoading] = useState({});
  const [errors, setErrors] = useState({});

  // Form states
  const [depositForm, setDepositForm] = useState({
    material: "plastic",
    units: 1,
  });
  const [withdrawForm, setWithdrawForm] = useState({
    amount: "",
    bankToken: "tok_test_123",
  });
  const [transactionLimit, setTransactionLimit] = useState(10);
  const [withdrawalLimit, setWithdrawalLimit] = useState(10);

  // Helper function to make API calls
  const apiCall = async (endpoint, options = {}) => {
    const url = `${apiBaseUrl}${endpoint}`;

    let authHeaders = {
      "Content-Type": "application/json",
    };

    let debugMessage = `Making request to ${endpoint}\n`;

    if (user) {
      try {
        const idToken = await user.getIdToken();
        authHeaders["Authorization"] = `Bearer ${idToken}`;
        debugMessage += `Using Firebase token for user: ${user.email}\n`;
        debugMessage += `Token preview: ${idToken.substring(0, 50)}...\n`;
      } catch (error) {
        console.error("Failed to get ID token:", error);
        debugMessage += `Failed to get Firebase token: ${error.message}\n`;

        // Fall back to test header
        if (testEmail) {
          authHeaders["X-Test-User-Email"] = testEmail;
          debugMessage += `Falling back to test email: ${testEmail}\n`;
        }
      }
    } else if (testEmail) {
      authHeaders["X-Test-User-Email"] = testEmail;
      debugMessage += `Using test email: ${testEmail}\n`;
    } else {
      debugMessage += `No authentication method available\n`;
    }

    setDebugInfo(debugMessage);
    console.log("Auth Debug:", debugMessage);
    console.log("Request headers:", authHeaders);

    const defaultOptions = {
      headers: authHeaders,
    };

    const response = await fetch(url, { ...defaultOptions, ...options });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("API Error Response:", errorText);
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
      console.log(`${key} result:`, result);
      if (successCallback) successCallback(result);
    } catch (error) {
      console.error(`${key} error:`, error);
      setErrors((prev) => ({ ...prev, [key]: error.message }));
    } finally {
      setLoading((prev) => ({ ...prev, [key]: false }));
    }
  };

  // API handlers
  const handleGetWallet = () => {
    handleApiCall(
      "wallet",
      () => apiCall("/wallet"),
      (result) => {
        setWallet(result);
        setWallet((prev) => ({
          ...prev,
          lastUpdated: new Date().toLocaleString(),
        }));
      }
    );
  };

  const handleCreateDeposit = () => {
    handleApiCall(
      "deposit",
      () =>
        apiCall("/deposit", {
          method: "POST",
          body: JSON.stringify({
            material: depositForm.material,
            units: parseInt(depositForm.units),
          }),
        }),
      (result) => {
        // Refresh wallet after successful deposit
        handleGetWallet();
      }
    );
  };

  const handleGetTransactions = () => {
    handleApiCall(
      "transactions",
      () => apiCall(`/transactions?limit=${transactionLimit}`),
      (result) => setTransactions(result.transactions || result)
    );
  };

  const handleCreateWithdrawal = () => {
    const amountCents = Math.round(parseFloat(withdrawForm.amount) * 100);
    handleApiCall(
      "withdrawal",
      () =>
        apiCall("/withdraw", {
          method: "POST",
          body: JSON.stringify({
            amount_cents: amountCents,
            bank_token: withdrawForm.bankToken,
          }),
        }),
      (result) => {
        // Refresh wallet after successful withdrawal
        handleGetWallet();
      }
    );
  };

  const handleGetWithdrawals = () => {
    handleApiCall(
      "withdrawals",
      () => apiCall(`/withdrawals?limit=${withdrawalLimit}`),
      (result) => setWithdrawals(result.withdrawals || result)
    );
  };

  // Helper functions
  const formatMoney = (cents) => `$${(cents / 100).toFixed(2)}`;
  const calculateExpectedEarnings = () => {
    const rate = depositForm.material === "plastic" ? 5 : 10;
    const totalCents = depositForm.units * rate;
    return { cents: totalCents, dollars: formatMoney(totalCents) };
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  // Connection status
  const connectionStatus =
    apiBaseUrl && testEmail ? "connected" : "disconnected";

  return (
    <div className="min-h-screen bg-gray-50 p-6  w-full">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Flask API Test Dashboard
        </h1>
        {debugInfo && (
          <div className="bg-yellow-50 rounded-lg shadow p-6 border mb-6 text-black">
            <h2 className="text-xl font-semibold mb-4">Debug Information</h2>
            <pre className="text-sm bg-white p-3 rounded border overflow-x-auto">
              {debugInfo}
            </pre>
            {user && (
              <div className="mt-4 text-sm">
                <p>
                  <strong>Authenticated User:</strong> {user.email}
                </p>
                <p>
                  <strong>User UID:</strong> {user.uid}
                </p>
                <button
                  onClick={async () => {
                    try {
                      const token = await user.getIdToken();
                      console.log("Full Firebase Token:", token);
                      alert("Token logged to console");
                    } catch (error) {
                      console.error("Token error:", error);
                    }
                  }}
                  className="bg-yellow-500 text-white px-3 py-1 rounded text-xs mt-2"
                >
                  Log Full Token to Console
                </button>
              </div>
            )}
          </div>
        )}
        {/* API Configuration Section */}
        <div className="bg-white rounded-lg shadow p-6 border mb-6">
          <h2 className="text-xl font-semibold mb-4">API Configuration</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                API Base URL
              </label>
              <input
                type="text"
                value={apiBaseUrl}
                onChange={(e) => setApiBaseUrl(e.target.value)}
                className="border rounded px-3 py-2 w-full"
                placeholder="https://earthwalletapi.onrender.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Test Email
              </label>
              <input
                type="email"
                value={testEmail}
                onChange={(e) => setTestEmail(e.target.value)}
                className="border rounded px-3 py-2 w-full"
                placeholder="test@example.com"
              />
            </div>
          </div>
          <div className="mt-4 flex items-center">
            <span className="text-sm text-gray-600 mr-2">
              Connection Status:
            </span>
            <span
              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                connectionStatus === "connected"
                  ? "bg-green-100 text-green-800"
                  : "bg-red-100 text-red-800"
              }`}
            >
              <span
                className={`w-2 h-2 rounded-full mr-1 ${
                  connectionStatus === "connected"
                    ? "bg-green-400"
                    : "bg-red-400"
                }`}
              ></span>
              {connectionStatus}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Wallet Balance Section */}
          <div className="bg-white rounded-lg shadow p-6 border">
            <h2 className="text-xl font-semibold mb-4">Wallet Balance</h2>
            <button
              onClick={handleGetWallet}
              disabled={loading.wallet}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded disabled:bg-gray-400 mb-4"
            >
              {loading.wallet ? (
                <span className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Loading...
                </span>
              ) : (
                "Get Wallet"
              )}
            </button>

            {errors.wallet && (
              <div className="bg-red-100 border-red-500 text-red-700 p-3 rounded mb-4">
                {errors.wallet}
              </div>
            )}

            {wallet && (
              <div className="bg-gray-50 p-4 rounded">
                <p className="text-2xl font-bold text-green-600">
                  {formatMoney(wallet.balance_cents)}
                </p>
                <p className="text-sm text-gray-600">
                  Balance: {wallet.balance_cents} cents
                </p>
                {wallet.lastUpdated && (
                  <p className="text-xs text-gray-500 mt-2">
                    Last updated: {wallet.lastUpdated}
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Deposit Testing Section */}
          <div className="bg-white rounded-lg shadow p-6 border">
            <h2 className="text-xl font-semibold mb-4">Create Deposit</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Material
                </label>
                <select
                  value={depositForm.material}
                  onChange={(e) =>
                    setDepositForm((prev) => ({
                      ...prev,
                      material: e.target.value,
                    }))
                  }
                  className="border rounded px-3 py-2 w-full"
                >
                  <option value="plastic">Plastic (5¢ per unit)</option>
                  <option value="aluminum">Aluminum (10¢ per unit)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Units
                </label>
                <input
                  type="number"
                  min="1"
                  value={depositForm.units}
                  onChange={(e) =>
                    setDepositForm((prev) => ({
                      ...prev,
                      units: e.target.value,
                    }))
                  }
                  className="border rounded px-3 py-2 w-full"
                />
              </div>

              <div className="bg-green-50 p-3 rounded">
                <p className="text-sm text-green-700">
                  Expected earnings: {calculateExpectedEarnings().dollars}(
                  {calculateExpectedEarnings().cents} cents)
                </p>
              </div>

              <button
                onClick={handleCreateDeposit}
                disabled={loading.deposit}
                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded disabled:bg-gray-400 w-full"
              >
                {loading.deposit ? (
                  <span className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Creating...
                  </span>
                ) : (
                  "Create Deposit"
                )}
              </button>

              {errors.deposit && (
                <div className="bg-red-100 border-red-500 text-red-700 p-3 rounded">
                  {errors.deposit}
                </div>
              )}
            </div>
          </div>

          {/* Transaction History Section */}
          <div className="bg-white rounded-lg shadow p-6 border">
            <h2 className="text-xl font-semibold mb-4">Transaction History</h2>
            <div className="flex gap-4 mb-4">
              <input
                type="number"
                min="1"
                max="100"
                value={transactionLimit}
                onChange={(e) => setTransactionLimit(e.target.value)}
                className="border rounded px-3 py-2 w-20"
                placeholder="10"
              />
              <button
                onClick={handleGetTransactions}
                disabled={loading.transactions}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded disabled:bg-gray-400"
              >
                {loading.transactions ? (
                  <span className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Loading...
                  </span>
                ) : (
                  "Get Transactions"
                )}
              </button>
            </div>

            {errors.transactions && (
              <div className="bg-red-100 border-red-500 text-red-700 p-3 rounded mb-4">
                {errors.transactions}
              </div>
            )}

            {transactions.length > 0 && (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Type
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
                    {transactions.map((transaction, index) => (
                      <tr key={index}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {formatDate(transaction.created_at)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {transaction.transaction_type || "deposit"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {transaction.material || "-"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {transaction.units || "-"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {formatMoney(transaction.amount_cents)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Withdrawal Testing Section */}
          <div className="bg-white rounded-lg shadow p-6 border">
            <h2 className="text-xl font-semibold mb-4">Create Withdrawal</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Amount (USD)
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={withdrawForm.amount}
                  onChange={(e) =>
                    setWithdrawForm((prev) => ({
                      ...prev,
                      amount: e.target.value,
                    }))
                  }
                  className="border rounded px-3 py-2 w-full"
                  placeholder="10.00"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Bank Token
                </label>
                <input
                  type="text"
                  value={withdrawForm.bankToken}
                  onChange={(e) =>
                    setWithdrawForm((prev) => ({
                      ...prev,
                      bankToken: e.target.value,
                    }))
                  }
                  className="border rounded px-3 py-2 w-full"
                  placeholder="tok_test_123"
                />
              </div>

              {withdrawForm.amount && (
                <div className="bg-blue-50 p-3 rounded">
                  <p className="text-sm text-blue-700">
                    Amount in cents:{" "}
                    {Math.round(parseFloat(withdrawForm.amount) * 100)}
                  </p>
                </div>
              )}

              <button
                onClick={handleCreateWithdrawal}
                disabled={loading.withdrawal || !withdrawForm.amount}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded disabled:bg-gray-400 w-full"
              >
                {loading.withdrawal ? (
                  <span className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Processing...
                  </span>
                ) : (
                  "Create Withdrawal"
                )}
              </button>

              {errors.withdrawal && (
                <div className="bg-red-100 border-red-500 text-red-700 p-3 rounded">
                  {errors.withdrawal}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Withdrawal History Section */}
        <div className="bg-white rounded-lg shadow p-6 border mt-6">
          <h2 className="text-xl font-semibold mb-4">Withdrawal History</h2>
          <div className="flex gap-4 mb-4">
            <input
              type="number"
              min="1"
              max="100"
              value={withdrawalLimit}
              onChange={(e) => setWithdrawalLimit(e.target.value)}
              className="border rounded px-3 py-2 w-20"
              placeholder="10"
            />
            <button
              onClick={handleGetWithdrawals}
              disabled={loading.withdrawals}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded disabled:bg-gray-400"
            >
              {loading.withdrawals ? (
                <span className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Loading...
                </span>
              ) : (
                "Get Withdrawals"
              )}
            </button>
          </div>

          {errors.withdrawals && (
            <div className="bg-red-100 border-red-500 text-red-700 p-3 rounded mb-4">
              {errors.withdrawals}
            </div>
          )}

          {withdrawals.length > 0 && (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
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
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Bank Token
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {withdrawals.map((withdrawal, index) => (
                    <tr key={index}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatDate(withdrawal.created_at)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatMoney(withdrawal.amount_cents)}
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
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {withdrawal.bank_token}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ApiTestDashboard;
