import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { User } from "@shared/schema";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

export default function AssetRecommendations({
  recommendations,
}: {
  recommendations: NonNullable<User["recommendations"]>;
}) {
  const data = recommendations.assets.map((asset) => ({
    name: asset.symbol,
    value: asset.percentage,
  }));

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
      </CardContent>
    </Card>
  );
}
