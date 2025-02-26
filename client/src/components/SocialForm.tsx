import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertUserSchema } from "@shared/schema";
import { useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { useLocation } from "wouter";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FaTwitter, FaTelegram } from "react-icons/fa";

export default function SocialForm({ walletAddress }: { walletAddress: string }) {
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const form = useForm({
    resolver: zodResolver(insertUserSchema),
    defaultValues: {
      walletAddress,
      twitterHandle: "",
      telegramHandle: "",
    },
  });

  const mutation = useMutation({
    mutationFn: async (data: typeof form.getValues) => {
      const res = await apiRequest("POST", "/api/users", data);
      return res.json();
    },
    onSuccess: () => {
      setLocation(`/dashboard/${walletAddress}`);
    },
    onError: () => {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to submit social handles",
      });
    },
  });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit((data) => mutation.mutate(data))}
        className="space-y-4"
      >
        <FormField
          control={form.control}
          name="twitterHandle"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center gap-2">
                <FaTwitter className="text-[#1DA1F2]" />
                Twitter Handle
              </FormLabel>
              <FormControl>
                <Input {...field} placeholder="@username" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="telegramHandle"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center gap-2">
                <FaTelegram className="text-[#0088cc]" />
                Telegram Handle
              </FormLabel>
              <FormControl>
                <Input {...field} placeholder="@username" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          className="w-full"
          disabled={mutation.isPending}
        >
          {mutation.isPending ? "Analyzing..." : "Start Analysis"}
        </Button>
      </form>
    </Form>
  );
}
