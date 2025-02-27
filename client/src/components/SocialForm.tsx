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
    { name: "X", icon: <SiX />, color: "#000000", isEnabled: false },
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
            className={`w-full flex items-center justify-center gap-2 opacity-50 cursor-not-allowed`}
            variant="outline"
            disabled={true}
          >
            <span style={{ color: social.color }}>
              {social.icon}
            </span>
            Connect {social.name}
            {" (Coming Soon)"}
          </Button>
        ))}
      </CardContent>
    </Card>
  );
}