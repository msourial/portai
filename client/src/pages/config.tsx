import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { ExternalLink } from "lucide-react";

export default function Config() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [apiKey, setApiKey] = useState("");
  const [apiSecret, setApiSecret] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("/api/config/twitter", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          apiKey,
          apiSecret,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to save API keys");
      }

      toast({
        title: "Success",
        description: "X (Twitter) API keys have been saved",
      });

      // Clear the form
      setApiKey("");
      setApiSecret("");
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to save API keys",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">X (Twitter) API Configuration</CardTitle>
          <CardDescription>
            Configure your X Developer API credentials to enable social media integration
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Alert className="mb-6">
            <AlertTitle>How to get your API credentials:</AlertTitle>
            <AlertDescription className="mt-3">
              <ol className="list-decimal list-inside space-y-2">
                <li>Visit the <a href="https://developer.twitter.com/en/portal/dashboard" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline inline-flex items-center">X Developer Portal <ExternalLink className="h-3 w-3 ml-1" /></a></li>
                <li>Create a new project and app if you haven't already</li>
                <li>In your app settings, enable OAuth 2.0</li>
                <li>Set the callback URL to match your Replit domain</li>
                <li>Under "User authentication settings":
                  <ul className="list-disc list-inside ml-4 mt-2">
                    <li>Type of App: select "Web App"</li>
                    <li>Enable "OAuth 2.0"</li>
                    <li>Request email from users: Optional</li>
                    <li>Enable "Sign in with Twitter"</li>
                  </ul>
                </li>
                <li>Copy your "Client ID" (API Key) and "Client Secret"</li>
              </ol>
            </AlertDescription>
          </Alert>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="apiKey">API Key (Client ID)</Label>
              <Input
                id="apiKey"
                type="text"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="Enter your X API Key"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="apiSecret">API Secret (Client Secret)</Label>
              <Input
                id="apiSecret"
                type="password"
                value={apiSecret}
                onChange={(e) => setApiSecret(e.target.value)}
                placeholder="Enter your X API Secret"
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Saving..." : "Save API Keys"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}