import { getEndpoint, bindUrlToRule } from "../repository/rules.repo";
import { getUsersAPIKey } from "../repository/user.repo";
import urlGenerator from "../data_generation/urlCreator";
import { createDynamicUrl } from "../repository/url.repo";

async function createDynamicUrlService(userId: number, rulesId: number) {
  const apiKey = await getUsersAPIKey(userId);
  const endpoint = await getEndpoint(userId, rulesId);
  const urlString = urlGenerator(apiKey, endpoint);

  const createdUrl = await createDynamicUrl(userId, urlString, rulesId);

  if (createdUrl?.id) {
    await bindUrlToRule(rulesId, createdUrl.id);
  }

  return createdUrl;
}

export default createDynamicUrlService;
