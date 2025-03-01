import { User } from "@shared/schema";

export class OortAIService {
  private config: {
    agentUrl: string;
  };

  constructor() {
    this.config = {
      agentUrl: "https://console.oortech.com/agent/G1tdJoZ1_0eRR51ilOVID/8uNKUksu_0gcCSkpMM5HI"  
    };
  }

  async handleChat(message: string): Promise<string> {
    try {
      console.log("Sending message to Oort AI agent:", message);

      // Create URL with query parameter
      const url = new URL(this.config.agentUrl);
      url.searchParams.append('query', message);

      const response = await fetch(url.toString(), {
        method: 'GET',
        headers: {
          'Accept': 'application/json'
        }
      });

      if (!response.ok) {
        console.error(`API Error: ${response.status} ${response.statusText}`);
        throw new Error(`Failed to get response from AI agent (${response.status})`);
      }

      const data = await response.json();
      console.log("Oort AI response:", data);

      if (!data || !data.response) {
        console.error("Invalid response format:", data);
        return "I understand you're asking about investments. However, I'm currently having trouble accessing detailed information. Could you please try asking your question again?";
      }

      return data.response;

    } catch (error) {
      console.error("Chat error:", error);
      return "I apologize, but I'm having trouble connecting to my AI services right now. Please try again in a moment.";
    }
  }
}

export const oortAI = new OortAIService();