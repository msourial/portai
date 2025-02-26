import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent } from "@/components/ui/card";
import { Wallet2 } from "lucide-react";
import { SiCoinbase } from "react-icons/si";

interface WalletConnectProps {
  account: string | null;
  onConnectMetaMask: () => void;
  onConnectCoinbase: () => void;
  error: string | null;
  walletType: 'metamask' | 'coinbase' | null;
}

export default function WalletConnect({
  account,
  onConnectMetaMask,
  onConnectCoinbase,
  error,
  walletType,
}: WalletConnectProps) {
  return (
    <div className="space-y-4">
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {account ? (
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">
              Connected to {walletType === 'metamask' ? 'MetaMask' : 'Coinbase Wallet'}
            </p>
            <p className="font-mono text-sm truncate mt-1">{account}</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          <Button
            onClick={onConnectMetaMask}
            className="w-full"
            variant="outline"
            size="lg"
          >
            <Wallet2 className="mr-2 h-4 w-4" />
            Connect MetaMask
          </Button>

          <Button
            onClick={onConnectCoinbase}
            className="w-full"
            variant="outline"
            size="lg"
          >
            <SiCoinbase className="mr-2 h-4 w-4" style={{ color: '#0052FF' }} />
            Connect Coinbase
          </Button>
        </div>
      )}
    </div>
  );
}