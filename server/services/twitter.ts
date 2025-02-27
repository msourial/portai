import { TwitterApi } from "twitter-api-v2";
import { generateKeyPairSync } from "crypto";

if (!process.env.TWITTER_API_KEY || !process.env.TWITTER_API_SECRET) {
  throw new Error("Twitter API credentials not found");
}

const CLIENT_ID = process.env.TWITTER_API_KEY;
const CLIENT_SECRET = process.env.TWITTER_API_SECRET;

// Get the Replit domain from environment variables
const REPLIT_DOMAIN = process.env.REPL_SLUG && process.env.REPL_OWNER ? 
  `https://${process.env.REPL_SLUG}.${process.env.REPL_OWNER}.repl.co` : 
  'http://localhost:5000';

const CALLBACK_URL = `${REPLIT_DOMAIN}/api/auth/twitter/callback`;

// Initialize client with OAuth 2.0 credentials
const client = new TwitterApi({
  clientId: CLIENT_ID,
  clientSecret: CLIENT_SECRET
});

export async function getAuthLink(state: string) {
  try {
    // Generate OAuth 2.0 URL with PKCE
    const { url, codeVerifier, state: authState } = await client.generateOAuth2AuthLink(
      CALLBACK_URL,
      {
        scope: ['tweet.read', 'users.read', 'offline.access'],
        state: state,
      }
    );

    console.log("Authorization URL generated:", {
      clientId: CLIENT_ID,
      callbackUrl: CALLBACK_URL,
      authUrl: url
    });

    return { url, codeVerifier, state: authState };
  } catch (error) {
    console.error("Error generating auth link:", error);
    throw error;
  }
}

export async function handleCallback(code: string, codeVerifier: string) {
  try {
    console.log("Handling callback with:", {
      code: code ? "present" : "missing",
      codeVerifier: codeVerifier ? "present" : "missing",
      callbackUrl: CALLBACK_URL
    });

    const { client: loggedClient, accessToken } = await client.loginWithOAuth2({
      code,
      codeVerifier,
      redirectUri: CALLBACK_URL,
    });

    const { data: user } = await loggedClient.v2.me();
    return { user, accessToken };
  } catch (error) {
    console.error("Twitter callback error:", error);
    throw error;
  }
}