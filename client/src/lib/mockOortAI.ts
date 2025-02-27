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
        reason: "Based on your social media engagement with financial news and market analysis accounts, you show interest in broad market exposure. The S&P 500 ETF aligns with your preference for established companies frequently mentioned in your timeline."
      },
      {
        symbol: "VGK",
        name: "Vanguard FTSE Europe ETF",
        percentage: tolerance === "low" ? 10 : 15,
        reason: "Your interaction with European market news and following of EU-based analysts suggests potential interest in European market exposure. This ETF provides diversification into stable European economies."
      },
      // Bonds
      {
        symbol: "BND",
        name: "Vanguard Total Bond ETF",
        percentage: tolerance === "low" ? 30 : tolerance === "medium" ? 20 : 10,
        reason: "Analysis of your risk tolerance and social media sentiment shows a preference for stability. Your engagement with content about passive income and wealth preservation aligns with bond allocation."
      },
      // Commodities
      {
        symbol: "GLD",
        name: "SPDR Gold Shares",
        percentage: 10,
        reason: "Your recent interactions with posts about inflation hedging and following of commodity analysts indicate interest in gold. This allocation provides portfolio protection against market volatility you've expressed concern about."
      },
      {
        symbol: "SLV",
        name: "iShares Silver Trust",
        percentage: tolerance === "high" ? 5 : 0,
        reason: "Given your engagement with industrial metals and technology manufacturing content, silver exposure aligns with your interest in both precious metals and industrial applications."
      },
      // Agriculture
      {
        symbol: "DBA",
        name: "Invesco DB Agriculture Fund",
        percentage: tolerance === "low" ? 5 : 7,
        reason: "Your recent interactions with sustainable agriculture and food security content suggest interest in agricultural commodities. This fund provides exposure to essential agricultural futures markets."
      },
      {
        symbol: "VEGI",
        name: "iShares MSCI Global Agriculture",
        percentage: tolerance === "low" ? 5 : 8,
        reason: "Based on your follows of sustainable farming initiatives and agricultural technology companies, this ETF aligns with your interest in the future of agriculture and food production."
      },
      // Cryptocurrencies
      {
        symbol: "BTC",
        name: "Bitcoin",
        percentage: tolerance === "low" ? 5 : tolerance === "medium" ? 10 : 15,
        reason: "Analysis of your wallet history shows regular Bitcoin transactions and engagement with Bitcoin development discussions. Your social media activity indicates strong belief in Bitcoin as a store of value."
      },
      {
        symbol: "ETH",
        name: "Ethereum",
        percentage: tolerance === "low" ? 5 : tolerance === "medium" ? 8 : 12,
        reason: "Your wallet shows interaction with Ethereum DeFi protocols and NFT platforms. Your social engagement with Ethereum developers and DeFi projects suggests belief in the ecosystem's growth."
      },
      {
        symbol: "SOL",
        name: "Solana",
        percentage: tolerance === "high" ? 5 : 0,
        reason: "Your recent interactions with Solana developers and enthusiasm about high-performance blockchains in your social posts indicate interest in next-generation blockchain platforms."
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
        "Social media sentiment analysis of financial content",
        "Wallet transaction patterns and DeFi engagement",
        "Following patterns of market analysts and experts",
        "Engagement with financial news and discussions",
        "Historical investment behavior analysis"
      ]
    },
    recommendations
  };
}