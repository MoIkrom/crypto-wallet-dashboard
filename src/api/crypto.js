// api/crypto.js
import { createServer } from "http";
import { parse } from "url";

// Rate limiting middleware
const rateLimit = (req, res, next) => {
  // Simple in-memory store - in production use Redis or similar
  const WINDOW_SIZE_IN_SECONDS = 60;
  const MAX_REQUESTS_PER_WINDOW = 10;
  const ipAddress = req.headers["x-forwarded-for"] || req.socket.remoteAddress;

  // Get current timestamp
  const now = Math.floor(Date.now() / 1000);

  // Initialize or get the requests map
  global.requestCounts = global.requestCounts || new Map();

  // Get the request count and timestamp for this IP
  const requestData = global.requestCounts.get(ipAddress) || {
    count: 0,
    resetTime: now + WINDOW_SIZE_IN_SECONDS,
  };

  // Reset if window has passed
  if (now > requestData.resetTime) {
    requestData.count = 1;
    requestData.resetTime = now + WINDOW_SIZE_IN_SECONDS;
  } else {
    requestData.count += 1;
  }

  // Update the map
  global.requestCounts.set(ipAddress, requestData);

  // Check if rate limit exceeded
  if (requestData.count > MAX_REQUESTS_PER_WINDOW) {
    res.statusCode = 429;
    res.end(JSON.stringify({ error: "Rate limit exceeded. Try again later." }));
    return;
  }

  next();
};

// Authentication middleware
const authenticate = (req, res, next) => {
  const apiKey = req.headers["x-api-key"];

  // Check if API key is valid (in production, use a more secure method)
  if (!apiKey || apiKey !== process.env.API_SECRET_KEY) {
    res.statusCode = 401;
    res.end(JSON.stringify({ error: "Unauthorized - Invalid API key" }));
    return;
  }

  next();
};

// Apply middleware and handle routes
const handleRequest = (req, res) => {
  res.setHeader("Content-Type", "application/json");

  // Parse URL to get pathname
  const { pathname, query } = parse(req.url, true);

  // Define routes
  if (pathname === "/api/crypto/prices") {
    // Get cryptocurrency prices
    const currencies = query.symbols
      ? query.symbols.split(",")
      : ["BTC", "ETH"];

    // Mock data - in production, fetch from a real API
    const prices = currencies.reduce((acc, curr) => {
      acc[curr] = {
        price: Math.random() * 10000,
        change24h: (Math.random() * 10 - 5).toFixed(2),
      };
      return acc;
    }, {});

    res.end(
      JSON.stringify({
        success: true,
        timestamp: Date.now(),
        data: prices,
      })
    );
  } else if (pathname === "/api/crypto/convert") {
    // Currency conversion
    const { from, to, amount } = query;

    if (!from || !to || !amount) {
      res.statusCode = 400;
      res.end(
        JSON.stringify({
          error: "Missing required parameters: from, to, amount",
        })
      );
      return;
    }

    // Mock conversion rate - in production, use real data
    const rate = Math.random() * 100;
    const result = parseFloat(amount) * rate;

    res.end(
      JSON.stringify({
        success: true,
        from,
        to,
        amount: parseFloat(amount),
        rate,
        result,
        timestamp: Date.now(),
      })
    );
  } else {
    // Handle 404
    res.statusCode = 404;
    res.end(JSON.stringify({ error: "Endpoint not found" }));
  }
};

// Create server with middleware chain
const server = (req, res) => {
  // Helper function to chain middleware
  const runMiddleware = (middlewares, index = 0) => {
    if (index < middlewares.length) {
      middlewares[index](req, res, () => runMiddleware(middlewares, index + 1));
    } else {
      handleRequest(req, res);
    }
  };

  // Apply middleware chain
  runMiddleware([rateLimit, authenticate]);
};

// Export the server as the default handler
module.exports = server;
