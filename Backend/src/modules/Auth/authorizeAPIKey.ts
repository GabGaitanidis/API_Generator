import { getUserAPIKeyWithEndpoint } from "../User/user.repo";

async function authorizeAPIKey(apiKey: string, endpoint: string) {
  const results = await getUserAPIKeyWithEndpoint(apiKey, endpoint);

  return results.length;
}

export default authorizeAPIKey;
