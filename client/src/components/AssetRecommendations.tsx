import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { User } from "@shared/schema";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { SiRobinhood } from "react-icons/si";
import { Building2 } from "lucide-react"; // Using a more generic icon for IBKR

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

export default function AssetRecommendations({
  recommendations,
}: {
  recommendations: NonNullable<User["recommendations"]>;
}) {
  const { toast } = useToast();
  const [investmentAmount, setInvestmentAmount] = useState("");
  const [showAllocation, setShowAllocation] = useState(false);
  const [selectedBroker, setSelectedBroker] = useState<"robinhood" | "ibkr" | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);

  const data = recommendations.assets.map((asset) => ({
    name: asset.symbol,
    value: asset.percentage,
  }));

  const handleBrokerConnect = async (broker: "robinhood" | "ibkr") => {
    setIsConnecting(true);
    setSelectedBroker(broker);

    // Simulate broker authentication popup
    const width = 600;
    const height = 600;
    const left = window.innerWidth / 2 - width / 2;
    const top = window.innerHeight / 2 - height / 2;

    const popup = window.open(
      "about:blank",
      `Connect to ${broker === "robinhood" ? "Robinhood" : "IBKR"}`,
      `width=${width},height=${height},left=${left},top=${top}`
    );

    if (popup) {
      popup.document.write(`
        <html>
          <head>
            <title>${broker === "robinhood" ? "Robinhood" : "IBKR"} Authentication</title>
            <style>
              body { 
                font-family: system-ui; 
                margin: 0; 
                padding: 20px; 
                background: ${broker === "robinhood" ? "#00C805" : "#d44d25"}; 
                color: white; 
              }
              .container { text-align: center; margin-top: 50px; }
              .logo { font-size: 48px; margin-bottom: 20px; }
              .message { margin: 20px 0; }
              .button { 
                background: white; 
                color: ${broker === "robinhood" ? "#00C805" : "#d44d25"}; 
                border: none; 
                padding: 10px 20px; 
                border-radius: 20px; 
                cursor: pointer; 
              }
              ul { text-align: left; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="logo">${broker === "robinhood" ? "Robinhood" : "IBKR"}</div>
              <h2>Authorize portfolAI</h2>
              <p class="message">This application will be able to:</p>
              <ul>
                <li>View your portfolio</li>
                <li>Place trades on your behalf</li>
                <li>Monitor order status</li>
              </ul>
              <button class="button" onclick="window.close()">Authorize App</button>
            </div>
          </body>
        </html>
      `);

      // Check when popup is closed
      const checkClosed = setInterval(() => {
        if (popup.closed) {
          clearInterval(checkClosed);
          setIsConnecting(false);

          toast({
            title: "Success",
            description: `Successfully connected to ${broker === "robinhood" ? "Robinhood" : "IBKR"}`,
          });

          // Show allocation after successful connection
          setShowAllocation(true);
        }
      }, 500);
    }
  };

  const handleInvest = () => {
    const amount = parseFloat(investmentAmount);
    if (isNaN(amount) || amount <= 0) {
      toast({
        variant: "destructive",
        title: "Invalid amount",
        description: "Please enter a valid investment amount",
      });
      return;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recommended Portfolio</CardTitle>
        <CardDescription>
          Personalized asset allocation based on your risk profile
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                label
              >
                {data.map((_, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="space-y-4">
          {recommendations.assets.map((asset, i) => (
            <div key={asset.symbol} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div
                    className="h-3 w-3 rounded-full"
                    style={{ backgroundColor: COLORS[i % COLORS.length] }}
                  />
                  <span className="font-medium">
                    {asset.name} ({asset.symbol})
                  </span>
                </div>
                <span className="font-medium">{asset.percentage}%</span>
              </div>
              <p className="text-sm text-muted-foreground">{asset.reason}</p>
            </div>
          ))}
        </div>

        <Dialog>
          <DialogTrigger asChild>
            <Button className="w-full">Buy These Assets</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Investment Amount</DialogTitle>
              <DialogDescription>
                Enter the amount and connect your broker to invest in this portfolio
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label htmlFor="amount">Investment Amount ($)</Label>
                <Input
                  id="amount"
                  type="number"
                  min="0"
                  step="0.01"
                  value={investmentAmount}
                  onChange={(e) => {
                    setInvestmentAmount(e.target.value);
                    const amount = parseFloat(e.target.value);
                    if (!isNaN(amount) && amount > 0) {
                      setShowAllocation(true); // Show allocation immediately
                      setSelectedBroker(null); // Reset selected broker if amount changes
                    } else {
                      setShowAllocation(false); // Hide allocation if invalid amount
                    }
                  }}
                  placeholder="Enter amount"
                />
              </div>

              {investmentAmount && !isNaN(parseFloat(investmentAmount)) && parseFloat(investmentAmount) > 0 && (
                <div className="space-y-4">
                  <h4 className="font-medium">Investment Breakdown:</h4>
                  {recommendations.assets.map((asset) => (
                    <div
                      key={asset.symbol}
                      className="flex justify-between text-sm"
                    >
                      <span>{asset.symbol}</span>
                      <span>
                        ${((parseFloat(investmentAmount) * asset.percentage) / 100).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              <div className="space-y-2">
                <Label>Connect Broker to Execute</Label>
                <div className="grid gap-4 sm:grid-cols-2">
                  <Button
                    onClick={() => handleBrokerConnect("robinhood")}
                    className="w-full"
                    variant="outline"
                    disabled={isConnecting || !investmentAmount}
                  >
                    <SiRobinhood className="mr-2 h-4 w-4" style={{ color: '#00C805' }} />
                    {isConnecting && selectedBroker === "robinhood"
                      ? "Connecting..."
                      : "Connect Robinhood"}
                  </Button>

                  <Button
                    onClick={() => handleBrokerConnect("ibkr")}
                    className="w-full"
                    variant="outline"
                    disabled={isConnecting || !investmentAmount}
                  >
                    <Building2 className="mr-2 h-4 w-4" style={{ color: '#d44d25' }} />
                    {isConnecting && selectedBroker === "ibkr"
                      ? "Connecting..."
                      : "Connect IBKR"}
                  </Button>
                </div>
              </div>

              {showAllocation && selectedBroker && (
                <Alert>
                  <AlertDescription>
                    Connected to {selectedBroker === "robinhood" ? "Robinhood" : "IBKR"}.
                    Ready to execute trades based on the allocation above.
                  </AlertDescription>
                </Alert>
              )}
            </div>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}