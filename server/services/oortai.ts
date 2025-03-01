import { User } from "@shared/schema";

interface OortAIConfig {
  agentId: string;
  agentEndpoint: string;
}

export class OortAIService {
  private config: OortAIConfig;

  constructor() {
    this.config = {
      agentId: "G1tdJoZ1_0eRR51ilOVID/8uNKUksu_0gcCSkpMM5HI",
      agentEndpoint: "https://console.oortech.com/agent"
    };
  }

  async handleChat(message: string): Promise<string> {
    try {
      console.log("Sending message to Oort AI agent:", message);

      // For now using fetch directly, can be enhanced with axios or other HTTP client
      const response = await fetch(`${this.config.agentEndpoint}/${this.config.agentId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`Oort AI API error: ${response.statusText}`);
      }

      const data = await response.json();

      // If no response data, provide a fallback
      if (!data || !data.response) {
        return "I understand you're asking about investments. However, I'm currently having trouble accessing detailed information. Could you please try asking your question again?";
      }

      return data.response;

    } catch (error) {
      console.error("Chat error:", error);
      // Provide a graceful fallback response
      return "I apologize, but I'm having trouble connecting to my AI services right now. Please try again in a moment.";
    }
  }
}

export const oortAI = new OortAIService();