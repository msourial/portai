import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { User } from "@shared/schema";
import { AlertTriangle, ShieldCheck, Zap } from "lucide-react";

const riskIcons = {
  low: <ShieldCheck className="h-6 w-6 text-green-500" />,
  medium: <Zap className="h-6 w-6 text-yellow-500" />,
  high: <AlertTriangle className="h-6 w-6 text-red-500" />,
};

export default function RiskAnalysis({
  riskProfile,
}: {
  riskProfile: NonNullable<User["riskProfile"]>;
}) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          {riskIcons[riskProfile.tolerance]}
          <CardTitle>Risk Analysis</CardTitle>
        </div>
        <CardDescription>
          Based on your social media activity and wallet history
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <div className="flex justify-between mb-2">
            <span className="text-sm font-medium">Risk Score</span>
            <span className="text-sm text-muted-foreground">
              {Math.round(riskProfile.score)}%
            </span>
          </div>
          <Progress value={riskProfile.score} className="h-2" />
        </div>

        <div>
          <h4 className="text-sm font-medium mb-2">Analysis Factors</h4>
          <ul className="space-y-2">
            {riskProfile.factors.map((factor, i) => (
              <li
                key={i}
                className="text-sm text-muted-foreground flex items-center gap-2"
              >
                <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                {factor}
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
