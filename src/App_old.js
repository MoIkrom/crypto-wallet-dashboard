import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

const App = () => {
  const [walletAddress, setWalletAddress] = useState("");
  const [ethBalance, setEthBalance] = useState(null);
  const [cryptoPrices, setCryptoPrices] = useState([]);

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const address = await signer.getAddress();
        setWalletAddress(address);
        const balance = await provider.getBalance(address);
        setEthBalance(ethers.utils.formatEther(balance));
      } catch (error) {
        console.error("Error connecting wallet: ", error);
      }
    } else {
      alert("Metamask is not installed!");
    }
  };

  const fetchCryptoPrices = async () => {
    try {
      const response = await axios.get(
        "https://api.coingecko.com/api/v3/simple/price",
        {
          params: {
            ids: "bitcoin,ethereum,binancecoin,solana,cardano",
            vs_currencies: "usd",
          },
        }
      );
      setCryptoPrices(response.data);
    } catch (error) {
      console.error("Error fetching crypto prices: ", error);
    }
  };

  useEffect(() => {
    fetchCryptoPrices();
  }, []);

  return (
    <div className="container text-center mt-5">
      <h1 className="mb-4">Web3 Wallet & Crypto Prices</h1>
      <button onClick={connectWallet} className="btn btn-primary mb-3">
        Connect Wallet
      </button>
      {walletAddress && (
        <div className="alert alert-info">
          <p>
            <strong>Wallet Address:</strong> {walletAddress}
          </p>
          <p>
            <strong>ETH Balance:</strong> {ethBalance} ETH
          </p>
        </div>
      )}
      <h2 className="mt-4">Crypto Prices</h2>
      <div className="row mt-3">
        {Object.keys(cryptoPrices).map((coin) => (
          <div key={coin} className="col-md-2">
            <div className="card p-3 mb-3">
              <h5 className="card-title text-uppercase">{coin}</h5>
              <p className="card-text">${cryptoPrices[coin].usd}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default App;
