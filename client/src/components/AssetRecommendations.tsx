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
import { User } from "@shared/schema";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

export default function AssetRecommendations({
  recommendations,
}: {
  recommendations: NonNullable<User["recommendations"]>;
}) {
  const { toast } = useToast();
  const [investmentAmount, setInvestmentAmount] = useState("");
  const [showAllocation, setShowAllocation] = useState(false);

  const data = recommendations.assets.map((asset) => ({
    name: asset.symbol,
    value: asset.percentage,
  }));

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
    setShowAllocation(true);
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
                Enter the total amount you want to invest in this portfolio
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
                  onChange={(e) => setInvestmentAmount(e.target.value)}
                  placeholder="Enter amount"
                />
              </div>
              <Button onClick={handleInvest} className="w-full">
                Calculate Allocation
              </Button>

              {showAllocation && (
                <div className="mt-4 space-y-2">
                  <h4 className="font-medium">Allocation Breakdown:</h4>
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
            </div>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}