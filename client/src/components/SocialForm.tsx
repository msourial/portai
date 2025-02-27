import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FaTelegram, FaDiscord, FaLinkedin, FaReddit, FaGithub, FaTiktok, FaInstagram, FaFacebook, FaYoutube } from "react-icons/fa";
import { SiX } from "react-icons/si";
import RiskAnalysis from "./RiskAnalysis";
import AssetRecommendations from "./AssetRecommendations";
import { simulateAnalysis } from "@/lib/mockOortAI";

type SocialPlatform = {
  name: string;
  icon: React.ReactNode;
  color: string;
  isEnabled: boolean;
};

export default function SocialForm({ walletAddress }: { walletAddress?: string }) {
  const { toast } = useToast();
  const [loading, setLoading] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<any>(null);

  const socials: SocialPlatform[] = [
    { name: "X", icon: <SiX />, color: "#000000", isEnabled: true },
    { name: "Telegram", icon: <FaTelegram />, color: "#0088cc", isEnabled: false },
    { name: "Discord", icon: <FaDiscord />, color: "#5865F2", isEnabled: false },
    { name: "LinkedIn", icon: <FaLinkedin />, color: "#0A66C2", isEnabled: false },
    { name: "Reddit", icon: <FaReddit />, color: "#FF4500", isEnabled: false },
    { name: "GitHub", icon: <FaGithub />, color: "#333", isEnabled: false },
    { name: "TikTok", icon: <FaTiktok />, color: "#000000", isEnabled: false },
    { name: "Instagram", icon: <FaInstagram />, color: "#E4405F", isEnabled: false },
    { name: "Facebook", icon: <FaFacebook />, color: "#1877F2", isEnabled: false },
    { name: "YouTube", icon: <FaYoutube />, color: "#FF0000", isEnabled: false },
  ];

  const handleConnect = async (platform: string) => {
    if (!walletAddress) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please connect your wallet first",
      });
      return;
    }

    setLoading(platform);

    // Simulate X authentication popup
    if (platform === "X") {
      const width = 600;
      const height = 600;
      const left = window.innerWidth / 2 - width / 2;
      const top = window.innerHeight / 2 - height / 2;

      // Create mock popup
      const popup = window.open(
        "about:blank",
        "Connect to X",
        `width=${width},height=${height},left=${left},top=${top}`
      );

      if (popup) {
        popup.document.write(`
          <html>
            <head>
              <title>X Authentication</title>
              <style>
                body { font-family: system-ui; margin: 0; padding: 20px; background: #000; color: white; }
                .container { text-align: center; margin-top: 50px; }
                .logo { font-size: 48px; margin-bottom: 20px; }
                .message { margin: 20px 0; }
                .button { 
                  background: white; 
                  color: black; 
                  border: none; 
                  padding: 10px 20px; 
                  border-radius: 20px; 
                  cursor: pointer; 
                }
              </style>
            </head>
            <body>
              <div class="container">
                <div class="logo">X</div>
                <h2>Authorize portfolAI</h2>
                <p class="message">This application will be able to:</p>
                <ul style="text-align: left;">
                  <li>Read your tweets</li>
                  <li>See who you follow</li>
                  <li>Analyze your interests</li>
                </ul>
                <button class="button" onclick="window.close()">Authorize App</button>
              </div>
            </body>
          </html>
        `);

        // Check when popup is closed
        const checkClosed = setInterval(async () => {
          if (popup.closed) {
            clearInterval(checkClosed);
            // Generate mock analysis
            const mockData = await simulateAnalysis(walletAddress);
            setAnalysis(mockData);
            setLoading(null);

            toast({
              title: "Success",
              description: "Successfully connected to X",
            });
          }
        }, 500);
      }
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">
            Connect Your Social Media
          </CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          {socials.map((social) => (
            <Button
              key={social.name}
              onClick={() => social.isEnabled && handleConnect(social.name)}
              className={`w-full flex items-center justify-center gap-2 ${!social.isEnabled ? 'opacity-50 cursor-not-allowed' : ''}`}
              variant="outline"
              disabled={!social.isEnabled || loading !== null}
            >
              <span style={{ color: social.color }}>
                {social.icon}
              </span>
              {loading === social.name
                ? "Connecting..."
                : `Connect ${social.name}`}
              {!social.isEnabled && " (Coming Soon)"}
            </Button>
          ))}
        </CardContent>
      </Card>

      {analysis && (
        <div className="space-y-6">
          <RiskAnalysis riskProfile={analysis.riskProfile} />
          <AssetRecommendations recommendations={analysis.recommendations} />
        </div>
      )}
    </div>
  );
}