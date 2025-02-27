import { TwitterApi } from "twitter-api-v2";

if (!process.env.TWITTER_API_KEY || !process.env.TWITTER_API_SECRET) {
  throw new Error("Twitter API credentials not found");
}

const CLIENT_ID = process.env.TWITTER_API_KEY;
const CLIENT_SECRET = process.env.TWITTER_API_SECRET;

// Get the correct Replit domain
const REPLIT_DOMAIN = `https://${process.env.REPL_SLUG}.${process.env.REPL_OWNER}.repl.co`;
const CALLBACK_URL = `${REPLIT_DOMAIN}/api/auth/twitter/callback`;

// Initialize client with OAuth 2.0 credentials
const client = new TwitterApi({
  clientId: CLIENT_ID,
  clientSecret: CLIENT_SECRET,
});

export async function getAuthLink(state: string) {
  try {
    // Generate OAuth 2.0 URL with PKCE
    const { url, codeVerifier, state: authState } = await client.generateOAuth2AuthLink(
      CALLBACK_URL,
      {
        scope: ['tweet.read', 'users.read', 'follows.read'],
        state,
      }
    );

    console.log("OAuth2 Details:", {
      callbackUrl: CALLBACK_URL,
      scopes: ['tweet.read', 'users.read', 'follows.read'],
      state,
      authUrl: url
    });

    return { url, codeVerifier, state: authState };
  } catch (error) {
    // Enhanced error logging
    console.error("Error generating OAuth link:", {
      error: error instanceof Error ? error.message : error,
      clientIdPresent: !!CLIENT_ID,
      clientSecretPresent: !!CLIENT_SECRET,
      domain: REPLIT_DOMAIN,
      callback: CALLBACK_URL
    });
    throw error;
  }
}

export async function handleCallback(code: string, codeVerifier: string) {
  try {
    console.log("Processing callback with:", {
      callbackUrl: CALLBACK_URL,
      codePresent: !!code,
      verifierPresent: !!codeVerifier
    });

    const { client: loggedClient, accessToken } = await client.loginWithOAuth2({
      code,
      codeVerifier,
      redirectUri: CALLBACK_URL,
    });

    const { data: user } = await loggedClient.v2.me();
    return { user, accessToken };
  } catch (error) {
    // Enhanced error logging
    console.error("Callback processing error:", {
      error: error instanceof Error ? error.message : error,
      callbackUrl: CALLBACK_URL,
      codePresent: !!code,
      verifierPresent: !!codeVerifier
    });
    throw error;
  }
}