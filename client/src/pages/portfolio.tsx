import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useLocation } from "wouter";
import { useEffect, useState } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

interface PortfolioProps {
  broker: string;
  amount: string;
  allocations: Array<{
    symbol: string;
    name: string;
    amount: number;
    percentage: number;
  }>;
}

export default function Portfolio() {
  const [location] = useLocation();
  const [portfolio, setPortfolio] = useState<PortfolioProps | null>(null);

  useEffect(() => {
    // Get portfolio data from URL state
    const searchParams = new URLSearchParams(location.split('?')[1]);
    const portfolioData = {
      broker: searchParams.get('broker') || '',
      amount: searchParams.get('amount') || '',
      allocations: JSON.parse(decodeURIComponent(searchParams.get('allocations') || '[]')),
    };
    setPortfolio(portfolioData as PortfolioProps);
  }, [location]);

  if (!portfolio) return null;

  const data = portfolio.allocations.map((asset) => ({
    name: asset.symbol,
    value: asset.percentage,
  }));

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-3xl">Your Portfolio</CardTitle>
            <p className="text-muted-foreground">
              Connected to {portfolio.broker} - Total Investment: ${parseFloat(portfolio.amount).toLocaleString()}
            </p>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
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
                <h3 className="text-lg font-semibold">Asset Allocation</h3>
                <div className="space-y-3">
                  {portfolio.allocations.map((asset, i) => (
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
                        <div className="text-right">
                          <div className="font-medium">
                            ${asset.amount.toLocaleString()}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {asset.percentage}%
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between text-sm">
                <span>Portfolio Created</span>
                <span>{new Date().toLocaleDateString()}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span>Connected to {portfolio.broker}</span>
                <span>{new Date().toLocaleTimeString()}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span>Initial Investment</span>
                <span>${parseFloat(portfolio.amount).toLocaleString()}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
