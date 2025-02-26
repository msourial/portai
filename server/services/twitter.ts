import { TwitterApi } from "twitter-api-v2";

if (!process.env.TWITTER_API_KEY || !process.env.TWITTER_API_SECRET) {
  throw new Error("Twitter API credentials not found");
}

const CLIENT_ID = process.env.TWITTER_API_KEY;
const CLIENT_SECRET = process.env.TWITTER_API_SECRET;
const CALLBACK_URL = "http://localhost:5000/api/auth/twitter/callback";

const client = new TwitterApi({ clientId: CLIENT_ID, clientSecret: CLIENT_SECRET });

export async function getAuthLink(state: string) {
  const { url, codeVerifier, state: authState } = await client.generateOAuth2AuthLink(
    CALLBACK_URL,
    { scope: ["tweet.read", "users.read"] }
  );
  
  return { url, codeVerifier, state: authState };
}

export async function handleCallback(code: string, codeVerifier: string) {
  const { client: loggedClient, accessToken } = await client.loginWithOAuth2({
    code,
    codeVerifier,
    redirectUri: CALLBACK_URL,
  });

  const { data: user } = await loggedClient.v2.me();
  return { user, accessToken };
}
