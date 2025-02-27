export async function simulateAnalysis(walletAddress: string) {
  await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate API delay

  // Analyze wallet address pattern to generate consistent but "random" data
  const hash = Array.from(walletAddress).reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const riskScore = (hash % 60) + 20; // Score between 20-80

  // Determine risk tolerance based on score
  let tolerance: "low" | "medium" | "high";
  if (riskScore < 40) tolerance = "low";
  else if (riskScore < 60) tolerance = "medium";
  else tolerance = "high";

  const recommendations = {
    assets: [
      // ETFs
      {
        symbol: "VOO",
        name: "Vanguard S&P 500 ETF",
        percentage: tolerance === "low" ? 25 : tolerance === "medium" ? 30 : 35,
        reason: "Broad US market exposure with low fees"
      },
      {
        symbol: "VGK",
        name: "Vanguard FTSE Europe ETF",
        percentage: tolerance === "low" ? 10 : 15,
        reason: "Geographic diversification through European markets"
      },
      // Bonds
      {
        symbol: "BND",
        name: "Vanguard Total Bond ETF",
        percentage: tolerance === "low" ? 30 : tolerance === "medium" ? 20 : 10,
        reason: "Fixed income stability through diversified bonds"
      },
      // Commodities
      {
        symbol: "GLD",
        name: "SPDR Gold Shares",
        percentage: 10,
        reason: "Traditional hedge against market volatility"
      },
      {
        symbol: "SLV",
        name: "iShares Silver Trust",
        percentage: tolerance === "high" ? 5 : 0,
        reason: "Industrial and precious metal exposure"
      },
      // Agriculture
      {
        symbol: "DBA",
        name: "Invesco DB Agriculture Fund",
        percentage: tolerance === "low" ? 5 : 7,
        reason: "Exposure to agricultural commodities futures"
      },
      {
        symbol: "VEGI",
        name: "iShares MSCI Global Agriculture",
        percentage: tolerance === "low" ? 5 : 8,
        reason: "Global agriculture companies exposure"
      },
      // Cryptocurrencies
      {
        symbol: "BTC",
        name: "Bitcoin",
        percentage: tolerance === "low" ? 5 : tolerance === "medium" ? 10 : 15,
        reason: "Digital gold status and institutional adoption"
      },
      {
        symbol: "ETH",
        name: "Ethereum",
        percentage: tolerance === "low" ? 5 : tolerance === "medium" ? 8 : 12,
        reason: "Smart contract platform with DeFi ecosystem"
      },
      {
        symbol: "SOL",
        name: "Solana",
        percentage: tolerance === "high" ? 5 : 0,
        reason: "High-performance blockchain for DeFi and NFTs"
      }
    ].filter(asset => asset.percentage > 0) // Remove assets with 0% allocation
  };

  // Ensure percentages add up to 100%
  const total = recommendations.assets.reduce((sum, asset) => sum + asset.percentage, 0);
  recommendations.assets = recommendations.assets.map(asset => ({
    ...asset,
    percentage: Math.round((asset.percentage / total) * 100)
  }));

  return {
    riskProfile: {
      score: riskScore,
      tolerance,
      factors: [
        "Social media sentiment analysis",
        "Market correlation patterns",
        "Risk tolerance assessment",
        "Investment time horizon",
        "Portfolio diversification metrics"
      ]
    },
    recommendations
  };
}