import React, { useState, useEffect } from "react";
import "./App.css";
import { ethers } from "ethers";
import { fetchCryptoData } from "./services/CryptoDataService";

function App() {
  const [walletAddress, setWalletAddress] = useState("");
  const [ethBalance, setEthBalance] = useState(null);
  const [cryptoData, setCryptoData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // Cryptocurrencies to track (by CoinGecko IDs)
  const cryptoIds = ["bitcoin", "ethereum", "cardano", "solana", "polkadot"];

  useEffect(() => {
    loadCryptoData();

    // Fetch crypto prices every 60 seconds
    const interval = setInterval(() => {
      loadCryptoData();
    }, 60000);

    return () => clearInterval(interval);
  },[]);

  const loadCryptoData = async () => {
    try {
      const data = await fetchCryptoData(cryptoIds);
      setCryptoData(data);
    } catch (err) {
      console.error("Error loading crypto data:", err);
    }
  };

  // Function to connect wallet
  const connectWallet = async () => {
    try {
      setIsLoading(true);
      setError("");

      // Check if MetaMask is installed
      if (!window.ethereum) {
        throw new Error(
          "MetaMask is not installed. Please install MetaMask to use this feature."
        );
      }

      // Request account access
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      const account = accounts[0];
      setWalletAddress(account);

      // Get ETH balance
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const balance = await provider.getBalance(account);
      setEthBalance(ethers.utils.formatEther(balance));

      // Set up event listener for account changes
      window.ethereum.on("accountsChanged", (accounts) => {
        if (accounts.length === 0) {
          // User disconnected their wallet
          setWalletAddress("");
          setEthBalance(null);
        } else {
          setWalletAddress(accounts[0]);
          updateEthBalance(accounts[0], provider);
        }
      });

      setIsLoading(false);
    } catch (err) {
      setIsLoading(false);
      setError(err.message || "Failed to connect wallet");
      console.error(err);
    }
  };

  // Update ETH balance
  const updateEthBalance = async (address, provider) => {
    try {
      const balance = await provider.getBalance(address);
      setEthBalance(ethers.utils.formatEther(balance));
    } catch (err) {
      console.error("Error fetching ETH balance:", err);
    }
  };

  return (
    <div className="app-container">
      <header>
        <h1>Crypto Wallet Dashboard</h1>
      </header>

      <div className="wallet-section">
        <h2>Wallet Connection</h2>
        <button
          className="connect-button"
          onClick={connectWallet}
          disabled={isLoading || walletAddress}
        >
          {isLoading
            ? "Connecting..."
            : walletAddress
            ? "Wallet Connected"
            : "Connect Wallet"}
        </button>

        {error && <p className="error-message">{error}</p>}

        {walletAddress && (
          <div className="wallet-info">
            <div className="wallet-address">
              <h3>Wallet Address:</h3>
              <p>{walletAddress}</p>
            </div>
            <div className="wallet-balance">
              <h3>ETH Balance:</h3>
              <p>
                {ethBalance
                  ? `${parseFloat(ethBalance).toFixed(4)} ETH`
                  : "Loading..."}
              </p>
            </div>
          </div>
        )}
      </div>

      <div className="crypto-section">
        <h2>Crypto Currency Prices</h2>
        {cryptoData.length > 0 ? (
          <table className="crypto-table">
            <thead>
              <tr>
                <th>Coin</th>
                <th>Price (USD)</th>
                <th>24h Change</th>
                <th>Market Cap</th>
              </tr>
            </thead>
            <tbody>
              {cryptoData.map((crypto) => (
                <tr key={crypto.id}>
                  <td>
                    <div className="crypto-name">
                      <img src={crypto.image} alt={crypto.name} />
                      <span>{crypto.name}</span>
                    </div>
                  </td>
                  <td>${crypto.current_price.toLocaleString()}</td>
                  <td
                    className={
                      crypto.price_change_percentage_24h > 0
                        ? "positive-change"
                        : "negative-change"
                    }
                  >
                    {crypto.price_change_percentage_24h.toFixed(2)}%
                  </td>
                  <td>${crypto.market_cap.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>Loading cryptocurrency data...</p>
        )}
      </div>
    </div>
  );
}

export default App;
