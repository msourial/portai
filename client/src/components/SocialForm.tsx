import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FaTwitter, FaTelegram } from "react-icons/fa";

export default function SocialForm({ walletAddress }: { walletAddress: string }) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const startTwitterAuth = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/auth/twitter?walletAddress=${walletAddress}`);
      const data = await response.json();

      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error("Failed to get Twitter auth URL");
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to initiate Twitter authentication",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardContent className="pt-6 space-y-4">
        <Button
          onClick={startTwitterAuth}
          className="w-full"
          variant="outline"
          disabled={isLoading}
        >
          <FaTwitter className="mr-2 text-[#1DA1F2]" />
          {isLoading ? "Connecting..." : "Connect with Twitter"}
        </Button>

        <Button
          className="w-full"
          variant="outline"
          disabled
        >
          <FaTelegram className="mr-2 text-[#0088cc]" />
          Connect with Telegram (Coming Soon)
        </Button>
      </CardContent>
    </Card>
  );
}