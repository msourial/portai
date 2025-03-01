import { Switch, Route } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import Home from "@/pages/home";
import Dashboard from "@/pages/dashboard";
import Portfolio from "@/pages/portfolio";
import NotFound from "@/pages/not-found";
import ChatDialog from "@/components/ChatDialog";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/dashboard/:walletAddress">
        {(params) => <Dashboard walletAddress={params.walletAddress} />}
      </Route>
      <Route path="/portfolio" component={Portfolio} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router />
      <ChatDialog />
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;