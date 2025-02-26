import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Wallet2 } from "lucide-react";

interface WalletConnectProps {
  account: string | null;
  onConnect: () => void;
  error: string | null;
}

export default function WalletConnect({
  account,
  onConnect,
  error,
}: WalletConnectProps) {
  return (
    <div className="space-y-4">
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {account ? (
        <div className="p-4 bg-muted rounded-lg">
          <p className="text-sm text-muted-foreground">Connected Wallet</p>
          <p className="font-mono text-sm truncate">{account}</p>
        </div>
      ) : (
        <Button
          onClick={onConnect}
          className="w-full"
          variant="outline"
          size="lg"
        >
          <Wallet2 className="mr-2 h-4 w-4" />
          Connect MetaMask
        </Button>
      )}
    </div>
  );
}
