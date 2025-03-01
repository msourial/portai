import { User } from "@shared/schema";

export class OortAIService {
  private config: {
    agentId: string;
    agentEndpoint: string;
  };

  constructor() {
    this.config = {
      agentId: "G1tdJoZ1_0eRR51ilOVID/8uNKUksu_0gcCSkpMM5HI",
      agentEndpoint: "https://console.oortech.com/api/agent"  // Updated to use API endpoint
    };
  }

  async handleChat(message: string): Promise<string> {
    try {
      console.log("Sending message to Oort AI agent:", message);

      const response = await fetch(`${this.config.agentEndpoint}/${this.config.agentId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          message: message,
          type: 'chat'
        })
      });

      if (!response.ok) {
        console.error(`API Error: ${response.status} ${response.statusText}`);
        throw new Error(`Failed to get response from AI agent (${response.status})`);
      }

      const data = await response.json();

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