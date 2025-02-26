import { useQuery } from "@tanstack/react-query";
import { User } from "@shared/schema";
import RiskAnalysis from "@/components/RiskAnalysis";
import AssetRecommendations from "@/components/AssetRecommendations";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function Dashboard({ walletAddress }: { walletAddress: string }) {
  const { data: user, isLoading } = useQuery<User>({
    queryKey: ["/api/users", walletAddress],
  });

  if (isLoading) {
    return (
      <div className="container mx-auto p-6 space-y-6">
        <Skeleton className="h-[200px] w-full" />
        <Skeleton className="h-[400px] w-full" />
      </div>
    );
  }

  if (!user?.riskProfile || !user?.recommendations) {
    return (
      <Card className="m-6">
        <CardHeader>
          <CardTitle>Analysis in Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Please wait while we analyze your data...
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <RiskAnalysis riskProfile={user.riskProfile} />
      <AssetRecommendations recommendations={user.recommendations} />
    </div>
  );
}
