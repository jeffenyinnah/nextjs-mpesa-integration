// generateToken.js
const fetch = require("node-fetch");
const { Buffer } = require("buffer");

// Replace these with your actual API credentials
const API_CONFIG = {
  apiKey: process.env.NEXT_PUBLIC_MPESA_API_KEY,
  publicKey: process.env.NEXT_PUBLIC_MPESA_PUBLIC_KEY,
};
const generateBearerToken = async () => {
  try {
    const authResponse = await fetch(
      "https://api.sandbox.vm.co.mz/oauth/token",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Basic ${Buffer.from(
            `${API_CONFIG.apiKey}:${API_CONFIG.publicKey}`
          ).toString("base64")}`,
        },
        body: JSON.stringify({
          grant_type: "client_credentials",
        }),
      }
    );

    if (!authResponse.ok) {
      throw new Error(
        `Failed to fetch Bearer token: ${authResponse.statusText}`
      );
    }

    const authData = await authResponse.json();
    console.log("Bearer Token:", authData.access_token);
  } catch (error) {
    console.error("Error generating Bearer token:", error);
  }
};

generateBearerToken();
