import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import SocialForm from "@/components/SocialForm";
import WalletConnect from "@/components/WalletConnect";
import { useWallet } from "@/lib/web3";

export default function Home() {
  const { account, connectWallet, error } = useWallet();

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-center text-primary">
            portfolAI
          </CardTitle>
          <p className="text-center text-muted-foreground mt-2">
            Your AI-Powered Investment Advisor
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          <WalletConnect
            account={account}
            onConnect={connectWallet}
            error={error}
          />
          {account && <SocialForm walletAddress={account} />}
        </CardContent>
      </Card>
    </div>
  );
}
