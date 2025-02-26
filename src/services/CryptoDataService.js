// Create a new file: src/services/CryptoDataService.js
import axios from "axios";

export const fetchCryptoData = async (cryptoIds) => {
  try {
    const response = await axios.get(
      "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1&sparkline=false"
    );
    return await response.data;
  } catch (error) {
    console.log("Error fetching cryptocurrency data:", error);
    console.error("Error fetching cryptocurrency data:", error);
    // Return mock data as fallback
    // return getMockCryptoData();
  }
};
// export const fetchCryptoData = async (cryptoIds) => {
//   try {
//     // Use a CORS proxy to bypass CORS restrictions
//     const proxyUrl = "https://corsproxy.io/?";
//     const targetUrl = `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${cryptoIds.join(
//       ","
//     )}&order=market_cap_desc&per_page=5&page=1&sparkline=false&price_change_percentage=24h`;

//     const response = await fetch(proxyUrl + encodeURIComponent(targetUrl));

//     if (!response.ok) {
//       throw new Error("Failed to fetch crypto data");
//     }

//     return await response.json();
//   } catch (error) {
//     console.error("Error fetching cryptocurrency data:", error);
//     // Return mock data as fallback
//     return getMockCryptoData();
//   }
// };

// Mock data to use as fallback when API fails
const getMockCryptoData = () => {
  return [
    {
      id: "bitcoin",
      symbol: "btc",
      name: "Bitcoin",
      image: "https://assets.coingecko.com/coins/images/1/large/bitcoin.png",
      current_price: 65432.21,
      market_cap: 1274589324321,
      price_change_percentage_24h: 2.45,
    },
    {
      id: "ethereum",
      symbol: "eth",
      name: "Ethereum",
      image: "https://assets.coingecko.com/coins/images/279/large/ethereum.png",
      current_price: 3456.78,
      market_cap: 415678932105,
      price_change_percentage_24h: 1.23,
    },
    {
      id: "cardano",
      symbol: "ada",
      name: "Cardano",
      image: "https://assets.coingecko.com/coins/images/975/large/cardano.png",
      current_price: 0.56,
      market_cap: 19876543210,
      price_change_percentage_24h: -0.45,
    },
    {
      id: "solana",
      symbol: "sol",
      name: "Solana",
      image: "https://assets.coingecko.com/coins/images/4128/large/solana.png",
      current_price: 120.34,
      market_cap: 50123456789,
      price_change_percentage_24h: 3.21,
    },
    {
      id: "polkadot",
      symbol: "dot",
      name: "Polkadot",
      image:
        "https://assets.coingecko.com/coins/images/12171/large/polkadot.png",
      current_price: 6.78,
      market_cap: 8765432109,
      price_change_percentage_24h: -1.23,
    },
  ];
};
