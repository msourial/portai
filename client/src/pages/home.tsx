import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import SocialForm from "@/components/SocialForm";
import WalletConnect from "@/components/WalletConnect";
import { useWallet } from "@/lib/web3";

export default function Home() {
  const { account, connectMetaMask, connectCoinbase, error, walletType } = useWallet();

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-4xl space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-center text-primary">
              portAI
            </CardTitle>
            <p className="text-center text-muted-foreground mt-2">
              Your AI-Powered Investment Advisor
            </p>
          </CardHeader>
          <CardContent>
            <WalletConnect
              account={account}
              onConnectMetaMask={connectMetaMask}
              onConnectCoinbase={connectCoinbase}
              error={error}
              walletType={walletType}
            />
          </CardContent>
        </Card>

        <SocialForm walletAddress={account ?? undefined} />
      </div>
    </div>
  );
}