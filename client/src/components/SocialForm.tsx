import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FaTelegram, FaDiscord, FaLinkedin, FaReddit, FaGithub, FaTiktok, FaInstagram, FaFacebook, FaYoutube } from "react-icons/fa";
import { SiX } from "react-icons/si";

type SocialPlatform = {
  name: string;
  icon: React.ReactNode;
  color: string;
  isEnabled: boolean;
};

export default function SocialForm({ walletAddress }: { walletAddress?: string }) {
  const { toast } = useToast();
  const [loading, setLoading] = useState<string | null>(null);

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
    try {
      setLoading(platform);
      const params = new URLSearchParams();
      if (walletAddress) {
        params.append('walletAddress', walletAddress);
      }

      // For X (formerly Twitter), use lowercase 'twitter' in the API path
      const apiPath = platform.toLowerCase() === 'x' ? 'twitter' : platform.toLowerCase();

      console.log(`Connecting to ${platform}...`);
      const response = await fetch(`/api/auth/${apiPath}?${params}`);

      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(errorData || `Failed to connect to ${platform}`);
      }

      const data = await response.json();

      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error(`Failed to get ${platform} auth URL`);
      }
    } catch (error) {
      console.error(`Error connecting to ${platform}:`, error);
      toast({
        variant: "destructive",
        title: "Connection Error",
        description: error instanceof Error ? error.message : `Failed to initiate ${platform} authentication. Please try again later.`,
      });
    } finally {
      setLoading(null);
    }
  };

  return (
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
            onClick={() => handleConnect(social.name)}
            className="w-full flex items-center justify-center gap-2"
            variant="outline"
            disabled={!social.isEnabled || loading === social.name}
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
  );
}