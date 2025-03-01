import { useState, useEffect } from 'react';
import { Badge } from "@/components/ui/badge";
import { Loader2 } from "lucide-react";

interface AIStatusIndicatorProps {
  lastResponse: string | null;
  isLoading: boolean;
}

export default function AIStatusIndicator({ lastResponse, isLoading }: AIStatusIndicatorProps) {
  const [status, setStatus] = useState<'connected' | 'error' | 'loading'>('loading');

  useEffect(() => {
    if (isLoading) {
      setStatus('loading');
    } else if (lastResponse?.includes("trouble connecting") || lastResponse?.includes("having trouble")) {
      setStatus('error');
    } else if (lastResponse) {
      setStatus('connected');
    }
  }, [lastResponse, isLoading]);

  if (status === 'error') {
    return (
      <Badge 
        variant="destructive" 
        className="absolute top-2 right-2 bg-red-500/15 text-red-500 border border-red-500/20"
      >
        Connection Error
      </Badge>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <Badge 
        variant={status === 'connected' ? "default" : "secondary"}
        className="flex items-center gap-1"
      >
        {status === 'loading' && <Loader2 className="h-3 w-3 animate-spin" />}
        <div className={`h-2 w-2 rounded-full ${
          status === 'connected' ? 'bg-green-500' : 
          'bg-yellow-500'
        }`} />
        {status === 'connected' ? 'AI Connected' : 'Connecting...'}
      </Badge>
    </div>
  );
}