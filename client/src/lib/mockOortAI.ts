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

  return {
    riskProfile: {
      score: riskScore,
      tolerance,
      factors: [
        "Social media sentiment analysis",
        "Crypto market correlation patterns",
        "Following influential traders",
        "Web3 community engagement metrics",
        "Transaction history patterns"
      ]
    },
    recommendations: {
      assets: [
        {
          symbol: "ETH",
          name: "Ethereum",
          percentage: tolerance === "high" ? 50 : 30,
          reason: "Strong DeFi ecosystem presence and upcoming protocol upgrades"
        },
        {
          symbol: "BTC",
          name: "Bitcoin",
          percentage: tolerance === "low" ? 40 : 25,
          reason: "Digital gold status and institutional adoption"
        },
        {
          symbol: "SOL",
          name: "Solana",
          percentage: tolerance === "high" ? 25 : 15,
          reason: "High performance blockchain with growing DeFi ecosystem"
        },
        {
          symbol: "LINK",
          name: "Chainlink",
          percentage: tolerance === "medium" ? 20 : 15,
          reason: "Essential Web3 infrastructure with cross-chain capabilities"
        },
        {
          symbol: "MATIC",
          name: "Polygon",
          percentage: tolerance === "low" ? 15 : 10,
          reason: "Scalability solution with strong enterprise partnerships"
        }
      ].slice(0, tolerance === "low" ? 3 : 5) // Show fewer options for low risk tolerance
    }
  };
}